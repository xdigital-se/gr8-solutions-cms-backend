import { Controller, Get, Post, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiParam, ApiTags, ApiHeader } from '@nestjs/swagger';
import { resolve } from 'path';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@ApiTags('Storage')
@Controller('storage')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiParam({
    name: 'folder',
    description:
      'name of the storage folder. "blogs" for blog cover image, "avatars" for user avatar.',
  })
  @ApiParam({
    name: 'name',
    description: 'name of the file',
  })
  @Get(':folder/:name')
  async getImage(
    @Param('folder') folder: string,
    @Param('name') name: string,
    @Res() res: Response,
  ) {
    res.sendFile(name, { root: resolve(`storage/${folder}`) });
  }
}
