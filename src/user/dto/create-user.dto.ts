import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export enum userRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
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
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiPropertyOptional()
  phone_number?: string;

  @IsOptional()
  @ApiPropertyOptional()
  address?: string;

  @IsOptional()
  @ApiProperty()
  is_two_factor?: boolean;

  @IsOptional()
  @ApiProperty()
  categoryId?: number;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiPropertyOptional()
  job_title?: string;

  @IsOptional()
  @ApiPropertyOptional()
  bio?: string;
}
