import { PartialType } from '@nestjs/mapped-types';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @ApiPropertyOptional()
  phone_number?: string;

  @IsOptional()
  @ApiPropertyOptional()
  address?: string;

  @IsOptional()
  @ApiProperty()
  is_two_factor?: boolean;

  @IsNotEmpty()
  @IsEmail()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @ApiPropertyOptional()
  job_title?: string;

  @IsOptional()
  @ApiPropertyOptional()
  categoryId?: number = null;

  @IsOptional()
  @ApiPropertyOptional()
  bio?: string;

  @IsOptional()
  @ApiProperty()
  new_password?: string;

  @IsOptional()
  @ApiProperty()
  confirm_new_password?: string;

  @IsOptional()
  @ApiHideProperty()
  two_factor_code?: string;
}
