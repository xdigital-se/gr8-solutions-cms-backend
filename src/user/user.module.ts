import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import { extname, resolve } from 'path';
import { v4 as uuid4 } from 'uuid';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: `smtps://${configService.get<string>(
          'MAILER_USERNAME',
        )}:${configService.get<string>(
          'MAILER_PASSWORD',
        )}@${configService.get<string>('MAILER_HOST')}`,
      }),
      inject: [ConfigService],
    }),
  ], 
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
