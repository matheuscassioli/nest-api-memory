import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O e-mail digitado é inválido' })  
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })       
  email: string;

  @IsString({ message: 'A senha deve ser um texto válido' })  
  @IsNotEmpty({ message: 'A senha é obrigatória' })          
  password: string;
}