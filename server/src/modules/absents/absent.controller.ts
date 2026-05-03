import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AbsentsService } from './absent.service';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { GetAllAbsentDto } from './dto/getAllAbsent.dto';
import { GetUserAbsentDto } from './dto/getUserAbsent.dto';

@Controller('absents')
@UseGuards(AuthGuard, RolesGuard)
export class AbsentsController {
  constructor(private absentsService: AbsentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  createAbsent(@UploadedFile() file: Express.Multer.File, @Req() req) {
    try {
      return this.absentsService.createAbsent(file, req.user.id);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }
  }

  @Get()
  @Roles(Role.HR)
  getAllAbsent(@Query() query: GetAllAbsentDto) {
    return this.absentsService.getAllAbsent(query);
  }

  @Get('user/:userId')
  getUserAbsent(
    @Param('userId') userId: number,
    @Req() req,
    @Query() query: GetUserAbsentDto,
  ) {
    return this.absentsService.getUserAbsent(userId, req, query);
  }

  @Patch('checkout')
  checkoutAbsent(@Req() req) {
    return this.absentsService.absentCheckOut(req.user.id);
  }

  @Get('me')
  getMyAbsent(@Req() req, @Query() query: GetUserAbsentDto) {
    return this.absentsService.getMyAbsent(req.user.id, req.user.name, query);
  }

  @Get('already')
  async isAlreadyAbsentToday(@Req() req) {
    const res = await this.absentsService.isAlreadtyAbsentToday(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Check absent today',
      data: res,
    };
  }
}
