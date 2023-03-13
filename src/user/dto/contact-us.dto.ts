import { IsEmail, IsNotEmpty } from 'class-validator';

export class ContactUsDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  message: string;
}
