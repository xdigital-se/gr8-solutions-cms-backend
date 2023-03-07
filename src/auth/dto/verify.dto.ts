import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}
