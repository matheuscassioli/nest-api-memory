import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (emailExists) {
      throw new ConflictException('Este e-mail já está cadastrado!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async findByEmailWithPassword(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  }
  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`Usuário com ID ${id} não foi encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: any) {
    await this.findOne(id);
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
    return {
      message: 'Usuário removido com sucesso!',
      status: 'success',
      ok: true
    };
  }
}