import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { BcryptService } from 'src/common/bcrypt/bcypt.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MeResponseDto } from './dto/me.dto';

export type AuthUserPayload = {
  id: number;
  email: string;
  name: string;
  roleId: number;
};

@Injectable()
export class AuthService {
  constructor(
    private bcrypt: BcryptService,
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(request: LoginRequestDto): Promise<string> {
    const { email, password } = request;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Kredensial tidak ditemukan');
    }
    const isPasswordValid = await this.bcrypt.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Kredensial tidak valid');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, email, name: user.name, roleId: user.roleId },
      { secret: jwtSecret, expiresIn: '1h' },
    );
    return accessToken;
  }

  async logout(userId: number): Promise<void> {
    const isUserExist = await this.usersService.getUserById(userId);
    if (!isUserExist) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return;
  }

  async me(user: AuthUserPayload): Promise<MeResponseDto> {
    return {
      statusCode: HttpStatus.OK,
      message: 'User authenticated',
      data: user,
    };
  }
}
