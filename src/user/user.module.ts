import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import { extname, resolve } from 'path';
import { v4 as uuid4 } from 'uuid';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
