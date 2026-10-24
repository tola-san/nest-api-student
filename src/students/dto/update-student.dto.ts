import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @IsOptional()
  @IsString()
  image_url?: string;
}
