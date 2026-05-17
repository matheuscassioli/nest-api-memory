import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // Mudamos para any[] para o TypeScript aceitar os objetos
  private users: any[] = [];

  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: Math.floor(Math.random() * 1000),
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find(u => u.id === Number(id));
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
 
  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) throw new NotFoundException('Usuário não encontrado');

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
    };

    return this.users[userIndex];
  }

  remove(id: number) {
    this.users = this.users.filter(u => u.id !== Number(id));
    return { message: 'Removido com sucesso' };
  }
}