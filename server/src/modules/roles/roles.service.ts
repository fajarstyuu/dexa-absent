import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  GetAllRolesDtoData,
  GetAllRolesDtoRequest,
  GetAllRolesDtoResponse,
} from './dto/getAllRoles.dto';
import { CreateRoleDto, CreateRoleDtoResponse } from './dto/createRole.dto';
import {
  GetRoleByIdDtoResponse,
  GetRoleByIdDtoResponseData,
} from './dto/getRoleById.dto';
import { UpdateRoleDtoRequest } from './dto/updateRole.dto';
import { DeleteRoleDtoResponse } from './dto/deleteRole.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(request: CreateRoleDto): Promise<CreateRoleDtoResponse> {
    const { name } = request;
    const roleExist = await this.prisma.role.findFirst({
      where: { name, del: null },
    });
    if (roleExist) {
      throw new BadRequestException('Role sudah ada');
    }
    await this.prisma.role.create({
      data: { name },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Role berhasil dibuat',
    };
  }

  async getAll(query: GetAllRolesDtoRequest): Promise<GetAllRolesDtoResponse> {
    const { page, limit, sortBy, sortOrder, search } = query;
    const offset = (page - 1) * limit;
    const res = await this.prisma.role.findMany({
      take: limit,
      skip: offset,
      where: {
        name: { contains: search },
        del: null,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
      },
    });
    const total = await this.prisma.role.count({
      where: {
        name: { contains: search },
        del: null,
      },
    });
    const data: GetAllRolesDtoData[] = res.map((role) => ({
      id: role.id,
      name: role.name,
    }));
    return {
      statusCode: HttpStatus.OK,
      message: 'Roles retrieved successfully',
      data,
      total,
    };
  }

  async getRoleById(id: number): Promise<GetRoleByIdDtoResponse> {
    const res = await this.prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    if (!res) {
      throw new NotFoundException('Role tidak ditemukan');
    }
    const data: GetRoleByIdDtoResponseData | null = res
      ? { id: res.id, name: res.name }
      : null;
    return {
      statusCode: HttpStatus.OK,
      message: 'Role retrieved successfully',
      data,
    };
  }

  async updateRole(id: number, request: UpdateRoleDtoRequest) {
    const { name } = request;
    const role = await this.prisma.role.findFirst({
      where: { id, del: null },
    });
    if (!role) {
      throw new NotFoundException('Role tidak ditemukan');
    }
    await this.prisma.role.update({
      where: { id },
      data: {
        name: name ?? role.name,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Role berhasil diperbarui',
    };
  }

  async deleteRole(id: number): Promise<DeleteRoleDtoResponse> {
    const role = await this.prisma.role.findFirst({
      where: { id: Number(id), del: null },
    });
    if (!role) {
      throw new NotFoundException('Role tidak ditemukan');
    }
    await this.prisma.role.update({
      where: { id: Number(id) },
      data: { del: 1 },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Role berhasil dihapus',
    };
  }
}
