import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common/enums';
import * as bcrypt from 'bcrypt';
import { Express } from 'express';
import { join, resolve } from 'path';
import { checkStorage } from '../common/diskStorage/disk-storage';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    avatar: Express.Multer.File,
  ): Promise<User> {
    try {
      // await checkStorage();

      let hashedPassword;
      const { password: plainPass } = createUserDto;

      if (plainPass) hashedPassword = await bcrypt.hash(plainPass, 10);

      const avatarPath = avatar.path
        .replace(/storage/g, '')
        .replace(/\\/g, '/');

      delete createUserDto['password_confirmation'];

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword ? hashedPassword : '',
          avatar: avatarPath,
          categoryId: createUserDto.categoryId,
        },
      });

      delete user['password'];
      delete user['is_two_factor'];
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('something went wrong creating user', 500);
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    for (const user of users) delete user['password'];
    return users;
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          Category: true,
        },
      });
    } catch (error) {
      throw new HttpException(`user wasn't found`, 404);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new HttpException(`user wasn't found`, 404);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    try {
      const {
        password,
        new_password,
        confirm_new_password,
        categoryId,
        ...data
      } = updateUserDto;

      const avatarPath = avatar?.path
        ?.replace(/storage/g, '')
        ?.replace(/\\/g, '/');

      let user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (
        new_password &&
        confirm_new_password &&
        new_password === confirm_new_password &&
        (await bcrypt.compare(user.password, password))
      ) {
        user = await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            ...data,
            avatar: avatarPath ? avatarPath : user.avatar,
            password: await bcrypt.hash(new_password, 10),
            categoryId: categoryId ? +categoryId : user.categoryId,
          },
        });
        delete user['password'];
        return user;
      } else {
        user = await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            ...data,
            avatar: avatar?.path ? avatar.path : user.avatar,
            categoryId: +categoryId,
          },
        });
        delete user['password'];
        return user;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'something went wrong updating user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException('something went wrong removing user', 500);
    }
  }
}
