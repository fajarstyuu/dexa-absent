import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, CreateRoleDtoResponse } from './dto/createRole.dto';
import { GetAllRolesDtoRequest } from './dto/getAllRoles.dto';
import {
  UpdateRoleDtoRequest,
  UpdateRoleDtoResponse,
} from './dto/updateRole.dto';
import { DeleteRoleDtoResponse } from './dto/deleteRole.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('roles')
@UseGuards(AuthGuard, RolesGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @Roles(Role.HR)
  createRole(@Body() request: CreateRoleDto): Promise<CreateRoleDtoResponse> {
    return this.rolesService.createRole(request);
  }

  @Get()
  @Roles(Role.HR)
  getAllRoles(@Query() query: GetAllRolesDtoRequest) {
    return this.rolesService.getAll(query);
  }

  @Get(':id')
  @Roles(Role.HR)
  getRoleById(@Param('id') id: number) {
    return this.rolesService.getRoleById(id);
  }

  @Patch(':id')
  @Roles(Role.HR)
  async updateRole(
    @Param('id') id: number,
    @Body() request: UpdateRoleDtoRequest,
    @Res() res,
  ) {
    const responseData = await this.rolesService.updateRole(id, request);
    var response: UpdateRoleDtoResponse;
    try {
      response = {
        statusCode: HttpStatus.OK,
        message: responseData.message,
      };
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      response = {
        statusCode: responseData.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          responseData.message || 'Terjadi kesalahan saat memperbarui role',
      };
      return res
        .status(responseData.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(response);
    }
  }

  @Delete(':id')
  @Roles(Role.HR)
  deleteRole(@Param('id') id: number): Promise<DeleteRoleDtoResponse> {
    return this.rolesService.deleteRole(id);
  }
}
