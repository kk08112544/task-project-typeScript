import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
   ){}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hashSync(createUserDto.password, 10);
    createUserDto.password = hashPassword; 
    
    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.insert(user);
    
    // Generate JWT token for the user
    const accessToken = this.jwtService.sign({ userId: user.id });

    // Return user and accessToken
    return  {user, accessToken} ;
  }

  
  // async findAll() {
  //   const find = this.userRepository.find();
  //   return find
  // }

  findAll() {
    return this.userRepository.find({
        select: ["id","name","lastname","username"], // ระบุฟิลด์ที่ต้องการดึงเฉพาะ (ไม่รวม coverimage)
    });
  }

  findOne(username: string) {
    return this.userRepository.findOneBy({username:username});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOneBy({id:id})
    // console.log(attraction.id)
    user = {
      ...user,
      ...updateUserDto
    }
    const toUpDate = await this.userRepository.save(user)
    return toUpDate;
  }

  async remove(id: number) {
    const toDelete = await this.userRepository.delete(id);
    return toDelete;
  }
}
