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
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoResponse } from './dto/createUser.dto';
import { GetAllUsersDtoRequest } from './dto/getAllUsers.dto';
import {
  UpdateUserDtoRequest,
  UpdateUserDtoResponse,
} from './dto/updateUser.dto';
import { DeleteUserDtoResponse } from './dto/deleteUser.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  @Roles(Role.HR)
  createUser(@Body() request: CreateUserDto): Promise<CreateUserDtoResponse> {
    return this.usersService.createUser(request);
  }

  @Get()
  @Roles(Role.HR)
  getAllUsers(@Query() query: GetAllUsersDtoRequest) {
    return this.usersService.getAll(query);
  }

  @Get(':id')
  @Roles(Role.HR)
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @Roles(Role.HR)
  async updateUser(
    @Param('id') id: number,
    @Body() request: UpdateUserDtoRequest,
    @Res() res,
  ) {
    const responseData = await this.usersService.updateUser(id, request);
    var response: UpdateUserDtoResponse;
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
          responseData.message || 'Terjadi kesalahan saat memperbarui user',
      };
      return res
        .status(responseData.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(response);
    }
  }

  @Delete(':id')
  @Roles(Role.HR)
  deleteUser(@Param('id') id: number): Promise<DeleteUserDtoResponse> {
    return this.usersService.deleteUser(id);
  }
}
