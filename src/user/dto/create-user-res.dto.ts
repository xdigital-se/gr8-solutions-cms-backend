import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export enum userRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserResDto {
  @IsOptional()
  @ApiPropertyOptional()
  avatar?: string;

  @IsOptional()
  @ApiPropertyOptional()
  first_name?: string;

  @IsOptional()
  @ApiPropertyOptional()
  last_name?: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  role: Role

  @IsOptional()
  @ApiPropertyOptional()
  phone_number?: string;

  @IsOptional()
  @ApiPropertyOptional()
  address?: string;

//   @IsOptional()
//   @ApiProperty()
//   is_two_factor?: boolean;

  @IsOptional()
  @ApiProperty()
  categoryId?: number;

  @IsOptional()
  @ApiPropertyOptional()
  job_title?: string;

  @IsOptional()
  @ApiPropertyOptional()
  bio?: string;
}
