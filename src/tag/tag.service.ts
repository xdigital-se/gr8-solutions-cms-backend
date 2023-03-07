import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    return await this.prisma.tag.create({
      data: createTagDto,
    });
  }

  async findAll(): Promise<Tag[]> {
    return await this.prisma.tag.findMany();
  }

  async findOne(id: number): Promise<Tag> {
    return await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    return await this.prisma.tag.update({
      where: {
        id,
      },
      data: updateTagDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.tag.delete({
      where: {
        id,
      },
    });
  }
}
