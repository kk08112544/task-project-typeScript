import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TaskService {
  constructor(
   @InjectRepository(Task)
   private taskRepository: Repository<Task>,
  ){}



  async create(createTaskDto: CreateTaskDto) {
    const task = await this.taskRepository.create(createTaskDto);
    const toCreate = await this.taskRepository.insert(task)
    const data = {
      id: task.id,
      title: task.title,
      description: task.description,
      created: task.created
    }
    return data;
  }
  


  async findAll() {
    const find = this.taskRepository.find();
    return find
  }

  async findOne(id: number) {
    return this.taskRepository.findOneBy({id:id});
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
  
    let task = await this.taskRepository.findOneBy({id:id})
    // console.log(attraction.id)
    task = {
      ...task,
      ...updateTaskDto
    }
    const toUpDate = await this.taskRepository.save(task)
    return toUpDate;
   
  }

  async remove(id: number) {
    const toDelete = await this.taskRepository.delete(id);
    return toDelete;
  }
}
 