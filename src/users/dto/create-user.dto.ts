import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'O nome deve ser um texto válido' })
    @IsNotEmpty({ message: 'O nome não pode ser vazio' })
    name: string;

    @IsEmail({}, { message: 'O e-mail digitado é inválido' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;
}