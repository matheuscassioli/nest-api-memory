import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 
import { UsersService } from '../users/users.service'; 
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }


    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmailWithPassword(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('E-mail ou senha incorretos!');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('E-mail ou senha incorretos!');
        }   

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}