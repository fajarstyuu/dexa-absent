import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  GetAllUsersDtoData,
  GetAllUsersDtoRequest,
  GetAllUsersDtoResponse,
} from './dto/getAllUsers.dto';
import { CreateUserDto, CreateUserDtoResponse } from './dto/createUser.dto';
import { BcryptService } from 'src/common/bcrypt/bcypt.service';
import { FindOneByEmailDto } from './dto/findOneByEmail.dto';
import {
  GetUserByIdDtoResponse,
  GetUserByIdDtoResponseData,
} from './dto/getUserById.dto';
import { UpdateUserDtoRequest } from './dto/updateUser.dto';
import { DeleteUserDtoResponse } from './dto/deleteUser.dto';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
    private cacheService: CacheService,
  ) {}

  async createUser(request: CreateUserDto): Promise<CreateUserDtoResponse> {
    const { name, email, password, roleId } = request;
    const userExist = await this.prisma.user.findUnique({
      where: { email, del: null },
    });
    if (userExist) {
      throw new BadRequestException('Email sudah digunakan');
    }
    const roleExist = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!roleExist) {
      throw new BadRequestException('Role tidak ditemukan');
    }
    const hashedPassword = await this.bcrypt.hashPassword(password);
    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
      },
    });
    await this.cacheService.deleteWithPattern('users:getAll:*');
    const res: CreateUserDtoResponse = {
      statusCode: HttpStatus.CREATED,
      message: 'User berhasil dibuat',
    };
    return res;
  }

  async getAll(query: GetAllUsersDtoRequest): Promise<GetAllUsersDtoResponse> {
    const { page, limit, sortBy, sortOrder, search } = query;
    const key = `users:getAll:${page}:${limit}:${sortBy}:${sortOrder}:${search || ''}`;

    const cachedData = await this.cacheService.get(key) as GetAllUsersDtoResponse;
    if (cachedData) {
      return cachedData;
    }
    const offset = (page - 1) * limit;
    const res = await this.prisma.user.findMany({
      take: limit,
      skip: offset,
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
        del: null,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    const total = await this.prisma.user.count({
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
        del: null,
      },
    });
    const data: GetAllUsersDtoData[] = res.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    }));

    const response: GetAllUsersDtoResponse = {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: data,
      total: total,
    };
    await this.cacheService.set(key, response);
    return response;
  }

  async findOneByEmail(email: string): Promise<FindOneByEmailDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, del: null },
      select: {
        id: true,
        name: true,
        password: true,
        roleId: true,
      },
    });
    const userData: FindOneByEmailDto | null = user
      ? {
          id: user.id,
          name: user.name,
          roleId: user.roleId,
          password: user.password,
        }
      : null;
    return userData;
  }

  async getUserById(id: number) {
    const cacheKey = `users:getById:${id}`;
    const cachedData = await this.cacheService.get(cacheKey) as GetUserByIdDtoResponse;
    if (cachedData) {
      return cachedData;
    }

    const res = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!res) {
      throw new NotFoundException('User tidak ditemukan');
    }
    const data: GetUserByIdDtoResponseData | null = res
      ? {
          id: res.id,
          name: res.name,
          email: res.email,
          roleId: res.role.id,
        }
      : null;
    const response: GetUserByIdDtoResponse = {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data,
    };
    await this.cacheService.set(cacheKey, response);
    return response;
  }

  async updateUser(id: number, request: UpdateUserDtoRequest) {
    const { name, email, roleId } = request;
    const user = await this.prisma.user.findUnique({
      where: { id, del: null },
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    await this.prisma.user.update({
      where: { id, del: null },
      data: {
        name: name ?? user.name,
        email: email ?? user.email,
        roleId: roleId ?? user.roleId,
      },
    });

    await this.cacheService.delete(`users:getById:${id}`);
    await this.cacheService.deleteWithPattern('users:getAll:*');

    return {
      statusCode: HttpStatus.OK,
      message: 'User berhasil diperbarui',
    };
  }

  async deleteUser(id: number): Promise<DeleteUserDtoResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id), del: null },
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    await this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        del: 1,
      },
    });

    await this.cacheService.delete(`users:getById:${id}`);
    await this.cacheService.deleteWithPattern('users:getAll:*');

    return {
      statusCode: HttpStatus.OK,
      message: 'User berhasil dihapus',
    };
  }
}
