import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { CreateTagDto } from '../../tag/dto/create-tag.dto';

export class CreateBlogDto {
  @IsOptional()
  @ApiProperty()
  cover_image?: string;

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsBoolean()
  @IsOptional()
  @ApiHideProperty()
  published?: boolean = true

  @IsOptional()
  @ApiHideProperty()
  authorId?: number;

  @IsOptional()
  @ApiProperty({ type: [CreateTagDto] })
  tags?: Tag[];
}
