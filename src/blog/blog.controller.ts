import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, Blog } from '@prisma/client';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { blogStorage } from '../common/diskStorage/disk-storage';
import { CreateBlogRes } from './interfaces/createblog-res.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Blogs')
@ApiBearerAuth()
@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiBody({ type: CreateBlogDto })
  @ApiCreatedResponse({
    type: CreateBlogRes,
    status: 201,
    description: 'crates a blog, send formdata and cover_image as jpg/png',
  })
  @UseInterceptors(FileInterceptor('cover_image', { storage: blogStorage }))
  create(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.create(createBlogDto, user.userId, file);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'use the response to handle pagination',
  })
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    description: 'you can search in blog titles',
  })
  @ApiResponse({
    schema: {
      example: {
        data: ['10 blogs'],
        meta: {
          total: 'total number of blogs',
          page: 'the page youre on',
          last_page: 'last page number',
        },
      },
    },
    status: 200,
  })
  @HttpCode(200)
  findAll(
    @Query('page') page: number = 1,
    @Query('search') searchString?: string,
  ) {
    return this.blogService.findAll(+page, searchString);
  }

  @Get('homepage')
  @ApiResponse({
    type: [CreateBlogDto],
    status: 200,
    description: 'gives you back the latest 3 blogs',
  })
  @HttpCode(200)
  homePage() {
    return this.blogService.latestBlogs();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'put id of a blog in params' })
  @ApiResponse({ type: CreateBlogRes, status: 200 })
  @HttpCode(200)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'id of blog to update' })
  @ApiBody({
    type: CreateBlogDto,
    description:
      'gets all properties of create blog but as optional, Remember to send previously added tags when updating and not a empty array',
  })
  @ApiResponse({ type: CreateBlogDto, status: 200 })
  @UseInterceptors(FileInterceptor('cover_image', { storage: blogStorage }))
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogService.update(+id, updateBlogDto, file);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'id of the blog that gets deleted' })
  @ApiResponse({ type: CreateBlogDto, status: 200 })
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
