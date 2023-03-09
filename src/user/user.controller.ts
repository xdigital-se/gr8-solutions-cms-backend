import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Express } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common/pipes';
import { avatarStorage } from '../common/diskStorage/disk-storage';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common/enums';
import {
  ApiTags,
  ApiHeader,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    type: CreateUserDto,
    description: 'send as form data and avatar as jpg/png',
  })
  @ApiResponse({ type: CreateUserDto, status: 201 })
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage }))
  @HttpCode(201)
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
        fileIsRequired: false,
      }),
    )
    avatar?: Express.Multer.File,
  ) {
    const user = await this.userService.findOneByEmail(createUserDto.email);

    if (user)
      throw new HttpException('email already exists', HttpStatus.BAD_REQUEST);

    return this.userService.create(createUserDto, avatar);
  }

  @Get()
  @ApiResponse({ type: [CreateUserDto], status: 200 })
  @HttpCode(200)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: CreateUserDto, status: 200 })
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get()
  findOneByEmail(@Body('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage }))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
        fileIsRequired: false,
      }),
    )
    avatar?: Express.Multer.File,
  ) {
    return this.userService.update(+id, updateUserDto, avatar);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
} 
