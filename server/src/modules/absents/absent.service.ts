import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SupabaseService } from 'src/config/supabase/supabase.service';
import { CreateAbsentDtoResponse } from './dto/createAbsent.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  GetAllAbsentDto,
  GetAllAbsentDtoResponse,
} from './dto/getAllAbsent.dto';
import {
  GetUserAbsentDto,
  GetUserAbsentDtoResponse,
} from './dto/getUserAbsent.dto';
import { AbsentCheckoutDtoResponse } from './dto/absentCheckout.dto';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class AbsentsService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
    private cacheService: CacheService,
  ) {}
  async createAbsent(
    picture: Express.Multer.File,
    userId: number,
  ): Promise<CreateAbsentDtoResponse> {
    if (!picture) {
      throw new InternalServerErrorException('File kosong');
    }
    if (!picture.mimetype.startsWith('image/')) {
      throw new InternalServerErrorException('File harus berupa gambar');
    }
    if (picture.size > 10 * 1024 * 1024) {
      throw new InternalServerErrorException('Ukuran file maksimal 10MB');
    }

    if (await this.isAlreadtyAbsentToday(userId)) {
      throw new Error('Kamu sudah absen hari ini');
    }

    const pictPath = await this.supaBaseUpload(picture);
    await this.prismaService.absent.create({
      data: {
        picturePath: pictPath,
        userId: Number(userId),
        checkIn: new Date(),
      },
    });

    await Promise.all([
      this.cacheService.deleteWithPattern('absents:getAll:*'),
      this.cacheService.deleteWithPattern(`absents:user:${userId}:*`),
      this.cacheService.deleteWithPattern(`absents:my:${userId}:*`),
    ]);

    const res: CreateAbsentDtoResponse = {
      statusCode: HttpStatus.CREATED,
      message: 'Absen berhasil',
    };
    return res;
  }

  async getAllAbsent(query: GetAllAbsentDto) {
    const { page, limit, sortBy, sortOrder, search, date } = query;
    const cacheKey = `absents:getAll:${page}:${limit}:${sortBy}:${sortOrder}:${search || ''}:${date || ''}`;

    const cachedData = await this.cacheService.get(cacheKey) as GetAllAbsentDtoResponse;
    if (cachedData) {
      return cachedData;
    }

    const offset = (page - 1) * limit;
    const resData = await this.prismaService.absent.findMany({
      take: limit,
      skip: offset,
      where: {
        OR: [
          { user: { name: { contains: search } } },
          { user: { email: { contains: search } } },
        ],
        user: {
          del: null,
        },
        createdAt: date
          ? {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
            }
          : undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        picturePath: true,
        checkIn: true,
        checkOut: true,
      },
    });

    const total = await this.prismaService.absent.count({
      where: {
        OR: [
          { user: { name: { contains: search } } },
          { user: { email: { contains: search } } },
        ],
        user: {
          del: null,
        },
        createdAt: date
          ? {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
            }
          : undefined,
      },
    });

    let signedUrls: (string | null)[] = [];
    if (resData.length > 0) {
      const pictUrls = resData
        .map((item) => item.picturePath)
        .filter(Boolean) as string[];
      signedUrls = await this.getSignedUrl(pictUrls);
    }

    const response: GetAllAbsentDtoResponse = {
      statusCode: HttpStatus.OK,
      message: 'Absen retrieved successfully',
      data: resData
        ? resData.map((item, index) => ({
            id: item.id,
            name: item.user.name,
            email: item.user.email,
            role: item.user.role.name,
            picturePath: signedUrls[index] || null,
            date: new Date(item.checkIn).toLocaleDateString('id-ID'),
            checkIn: new Date(item.checkIn).toLocaleTimeString('id-ID'),
            checkOut: item.checkOut
              ? new Date(item.checkOut).toLocaleTimeString('id-ID')
              : null,
          }))
        : [],
      total,
    };

    await this.cacheService.set(cacheKey, response);
    return response;
  }

  async getUserAbsent(userId: number, req: any, query: GetUserAbsentDto) {
    if (req.user.roleId !== 1 && req.user.id !== userId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk melihat data ini',
      );
    }

    const { page, limit, sortBy, sortOrder } = query;
    const cacheKey = `absents:user:${userId}:${page}:${limit}:${sortBy}:${sortOrder}:${query.date || ''}`;

    const cachedData = await this.cacheService.get(cacheKey) as GetUserAbsentDtoResponse;
    if (cachedData) {
      return cachedData;
    }

    const offset = (page - 1) * limit;
    const resData = await this.prismaService.absent.findMany({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: userId,
          del: null,
        },
        createdAt: query.date
          ? {
              gte: new Date(query.date),
              lt: new Date(
                new Date(query.date).getTime() + 24 * 60 * 60 * 1000,
              ),
            }
          : undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        picturePath: true,
        checkIn: true,
        checkOut: true,
      },
    });

    const nama = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        del: null,
      },
      select: {
        name: true,
      },
    });

    const total = await this.prismaService.absent.count({
      where: {
        user: {
          id: userId,
          del: null,
        },
        createdAt: query.date
          ? {
              gte: new Date(query.date),
              lt: new Date(
                new Date(query.date).getTime() + 24 * 60 * 60 * 1000,
              ),
            }
          : undefined,
      },
    });

    let signedUrls: (string | null)[] = [];
    if (resData.length > 0) {
      const pictUrls = resData
        .map((item) => item.picturePath)
        .filter(Boolean) as string[];
      signedUrls = await this.getSignedUrl(pictUrls);
    }

    const response: GetUserAbsentDtoResponse = {
      statusCode: HttpStatus.OK,
      message: 'Absen retrieved successfully',
      data: resData
        ? resData.map((item, index) => ({
            id: item.id,
            picturePath: signedUrls[index] || null,
            date: new Date(item.checkIn).toLocaleDateString('id-ID'),
            checkIn: new Date(item.checkIn).toLocaleTimeString('id-ID'),
            checkOut: item.checkOut
              ? new Date(item.checkOut).toLocaleTimeString('id-ID')
              : null,
          }))
        : [],
      total,
      name: nama?.name ? nama?.name : '',
    };

    await this.cacheService.set(cacheKey, response);
    return response;
  }

  async absentCheckOut(userId: number): Promise<AbsentCheckoutDtoResponse> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const absent = await this.prismaService.absent.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
      },
    });

    if (!absent) {
      throw new NotFoundException('Anda belum melakukan absen hari ini');
    }
    if (absent.checkOut) {
      throw new BadRequestException('Anda sudah melakukan checkout hari ini');
    }

    const now = new Date();
    if (absent.checkIn > now) {
      throw new BadRequestException('Waktu check-out tidak valid');
    }

    await this.prismaService.absent.update({
      where: {
        id: absent.id,
      },
      data: {
        checkOut: now,
      },
    });

    await Promise.all([
      this.cacheService.deleteWithPattern('absents:getAll:*'),
      this.cacheService.deleteWithPattern(`absents:user:${userId}:*`),
      this.cacheService.deleteWithPattern(`absents:my:${userId}:*`),
    ]);

    return {
      statusCode: HttpStatus.OK,
      message: 'Checkout berhasil',
    };
  }

  async getMyAbsent(userId: number, name: string, query: GetUserAbsentDto) {
    const { page, limit, sortBy, sortOrder, date } = query;
    const cacheKey = `absents:my:${userId}:${page}:${limit}:${sortBy}:${sortOrder}:${date || ''}`;

    const cachedData = await this.cacheService.get(cacheKey) as GetUserAbsentDtoResponse;
    if (cachedData) {
      return cachedData;
    }

    const offset = (page - 1) * limit;
    const resData = await this.prismaService.absent.findMany({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: userId,
          del: null,
        },
        createdAt: date
          ? {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
            }
          : undefined,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        picturePath: true,
        checkIn: true,
        checkOut: true,
      },
    });

    const total = await this.prismaService.absent.count({
      where: {
        user: {
          id: userId,
          del: null,
        },
        createdAt: date
          ? {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
            }
          : undefined,
      },
    });

    let signedUrls: (string | null)[] = [];
    if (resData.length > 0) {
      const pictUrls = resData
        .map((item) => item.picturePath)
        .filter(Boolean) as string[];
      signedUrls = await this.getSignedUrl(pictUrls);
    }

    const response: GetUserAbsentDtoResponse = {
      statusCode: HttpStatus.OK,
      message: 'Absen retrieved successfully',
      data: resData
        ? resData.map((item, index) => ({
            id: item.id,
            picturePath: signedUrls[index] || null,
            date: new Date(item.checkIn).toLocaleDateString('id-ID'),
            checkIn: new Date(item.checkIn).toLocaleTimeString('id-ID'),
            checkOut: item.checkOut
              ? new Date(item.checkOut).toLocaleTimeString('id-ID')
              : null,
          }))
        : [],
      total,
      name: name,
    };

    await this.cacheService.set(cacheKey, response);
    return response;
  }

  private async supaBaseUpload(file: Express.Multer.File): Promise<string> {
    const supabase = await this.supabaseService.connect();
    const { data, error } = await supabase.storage
      .from('dexa-absent-picture')
      .upload(this.generateUniqueFileName(file.originalname), file.buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype,
      });
    if (error) {
      console.error('Error uploading file to Supabase:', error);
      throw new InternalServerErrorException(error.message);
    }
    return data.path;
  }

  private generateUniqueFileName(originalName: string): string {
    const uuid = uuidv4();
    const extension = originalName.split('.').pop();
    return `${uuid}.${extension}`;
  }

  private async getSignedUrl(filePaths: string[]): Promise<(string | null)[]> {
    const supabase = await this.supabaseService.connect();
    const { data, error } = await supabase.storage
      .from('dexa-absent-picture')
      .createSignedUrls(filePaths, 60);
    if (error) {
      console.error('Error creating signed URLs:', error);
      throw new InternalServerErrorException(error.message);
    }
    const response = data ? data.map((item) => item.signedUrl) : [];
    return response;
  }

  async isAlreadtyAbsentToday(userId: number): Promise<boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const absentToday = await this.prismaService.absent.findFirst({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    return !!absentToday;
  }
}
