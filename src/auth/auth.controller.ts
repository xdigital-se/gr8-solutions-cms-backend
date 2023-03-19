import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards, Req } from '@nestjs/common/decorators';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Response, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common/pipes';
import { avatarStorage } from '../common/diskStorage/disk-storage';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Get } from '@nestjs/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @ApiBody({
    type: SignupDto,
    description:
      '!!!! request should be in formdata and avatar is a jpg/png file !!!!',
  })
  @ApiResponse({
    type: CreateUserDto,
    status: 201,
  })
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage }))
  async signup(
    @Body() signupDto: SignupDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    const { password, password_confirmation } = signupDto;

    if (password === password_confirmation)
      return this.userService.create(signupDto, avatar);
    else
      throw new HttpException(`password doesn't match`, HttpStatus.BAD_REQUEST);
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
    description: 'set the access_token to auth header of requests',
  })
  @ApiResponse({
    schema: { example: { access_token: 'token' } },
  })
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user, res);
  }

  // @Post('verify')
  // @ApiBody({
  //   type: VerifyDto,
  //   description: 'user will type a code sent to his email',
  // })
  // @ApiHeader({
  //   name: 'Authorization',
  //   description:
  //     'put the Jwt token in the auth header like this "bearer ${token}"',
  // })
  // @ApiResponse({ schema: { example: { success: true } } })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // async verify(@CurrentUser() user: any, @Body('code') code: string) {
  //   return this.authService.verify(user.userId, code);
  // }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    schema: { example: { logout: true } },
    description:
      'delete the authorization header token when user clicks logout',
  })
  logout() {
    return { logout: true };
  }
}
