import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { userRole } from '../../user/dto/create-user.dto';

export class SignupDto {
  @IsOptional()
  @ApiPropertyOptional()
  avatar?: string;

  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: userRole })
  role?: userRole;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  password_confirmation: string;

  @IsOptional()
  @ApiPropertyOptional()
  phone_number?: string;

  @IsOptional()
  @ApiPropertyOptional()
  address?: string;

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
