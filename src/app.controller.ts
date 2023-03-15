import { Controller, Get, Post, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiParam, ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { resolve } from 'path';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import * as svgCaptcha from 'svg-captcha';

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
    res.sendFile(name, { root: resolve(`${process.cwd()}/storage/${folder}`) });
  }

  @ApiResponse({
    schema: {
      example: { picture: 'svg captcha pic', code: 'code in the pic' },
    },
    description: 'check if the code written by user is the same as code in the pic for Contact Us Form',
    status: 201,
  })
  @Get('captcha')
  async captcha(@Res({ passthrough: true }) res: Response) {
    const bgColor = '#' + (((1 << 24) * Math.random()) | 0).toString(16);
    const option = {
      size: 5,
      noise: 2,
      color: true,
      background: bgColor,
    };
    const captcha = svgCaptcha.create(option);

    res.type('svg');

    res.status(200).send({
      picture: captcha.data,
      code: captcha.text.toLowerCase(),
    });
  }
}
