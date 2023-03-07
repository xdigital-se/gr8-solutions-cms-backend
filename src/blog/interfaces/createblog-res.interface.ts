import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Tag, User } from '@prisma/client';
import { CreateTagDto } from '../../tag/dto/create-tag.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateBlogRes {
  @IsOptional()
  @ApiProperty()
  cover_image?: string;

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  published?: boolean = true;

  @IsOptional()
  @ApiProperty({ type: CreateUserDto })
  author?: User;

  @IsOptional()
  @ApiProperty({ type: [CreateTagDto] })
  tags?: Tag[];
}
