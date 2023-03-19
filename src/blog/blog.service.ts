import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Blog } from '@prisma/client';
import { PaginatedBlog } from './interfaces/paginated-blog.interface';
import { Express } from 'express';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBlogDto: CreateBlogDto,
    userId: number,
    file: Express.Multer.File,
  ): Promise<Blog> {
    try {
      const { tags, ...blog } = createBlogDto;

      const foundTag = [];

      for (const tag of tags) {
        let existTag: unknown;

        existTag = await this.prisma.tag.findFirst({
          where: {
            name: tag.name,
          },
        });

        if (!existTag)
          existTag = await this.prisma.tag.create({
            data: { ...tag },
          });

        foundTag.push(existTag);
      }

      console.log(foundTag);

      const tagIds = foundTag?.map((item) => {
        return {
          id: parseInt(`${item.id}`),
        };
      });

      const fullPath = file.path.replace(/storage/g, '').replace(/\\/g, '/');

      return await this.prisma.blog.create({
        data: {
          ...blog,
          authorId: userId,
          cover_image: `${fullPath}`,
          tags: {
            connect: [...(tagIds || [])],
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `something went wrong creating blog`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    page?: number,
    searchString?: string,
  ): Promise<PaginatedBlog<Blog[]>> {
    try {
      const take = 10;

      const total = await this.prisma.blog.count();
      const blogs = await this.prisma.blog.findMany({
        take,
        skip: (page - 1) * take,
        where: {
          OR: [
            {
              title: {
                contains: searchString || '',
              },
            },
          ],
        },
        include: {
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        data: blogs,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async latestBlogs(): Promise<Blog[]> {
    return await this.prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      take: 3,
    });
  }

  async findOne(id: number): Promise<{
    blog: Blog;
    relatedBlogs: Blog[];
  }> {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    const relatedTag = blog.tags[0].name || null;

    const relatedBlogs = await this.prisma.blog.findMany({
      where: {
        tags: {
          some: {
            name: {
              contains: relatedTag,
            },
          },
        },
      },
      take: 3,
    });

    return {
      blog,
      relatedBlogs,
    };
  }

  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    cover_image: Express.Multer.File,
  ): Promise<Blog> {
    const { tags, ...blog } = updateBlogDto;

    const tagIds = tags?.map((item) => {
      return {
        id: parseInt(`${item.id}`),
      };
    });

    const fullPath = cover_image.path
      .replace(/storage/g, '')
      .replace(/\\/g, '/');

    return await this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        ...blog,
        cover_image: `${fullPath}`,
        tags: {
          connect: [...(tagIds || [])],
        },
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.blog.delete({
      where: {
        id,
      },
    });
  }
}
