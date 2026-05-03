import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService, type AuthUserPayload } from './auth.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { type Request, type Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { MeResponseDto } from './dto/me.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(
    @Body() request: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const loginResult = await this.authService.login(request);
    res.cookie('accessToken', loginResult, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Login berhasil',
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Req() req: Request & { user?: AuthUserPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user!.id);
    res.clearCookie('accessToken');
    return {
      statusCode: HttpStatus.OK,
      message: 'Logout berhasil',
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(
    @Req() req: Request & { user?: AuthUserPayload },
  ): Promise<MeResponseDto> {
    return this.authService.me(req.user as AuthUserPayload);
  }
}
