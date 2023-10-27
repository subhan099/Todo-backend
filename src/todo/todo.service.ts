import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoStatus } from './entities/todo.entity';
import { TodoRepository } from './repo/todo.repository';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    private userSevice: UserService,
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.date = new Date().toLocaleString();
    todo.status = createTodoDto.status;
    todo.user = await this.userSevice.findUserByID(userId);
    const create = this.todoRepository.save(todo);
    return {
      message: '',
      status: 'success',
      data: create,
    };
  }
  findAll() {
    return this.todoRepository.find();
    // return `This action returns all todos`;
  }
  async findTodo(userId: number, status: TodoStatus) {
    const todos = await this.todoRepository.find({
      relations: ['user'],
      where: { user: { id: userId }, status: status },
    });
    if (todos.length === 0) {
      return {
        message: 'no data received',
        status: 'success',
        data: [],
      };
    } else {
      return {
        message: '',
        status: 'success',
        data: todos,
      };
    }
  }

  async findTodoFK(userId: number) {
    const todos = await this.todoRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });
    if (todos.length === 0) {
      return {
        message: 'no data received',
        status: 'success',
        data: [],
      };
    } else {
      return {
        message: '',
        status: 'success',
        data: todos,
      };
    }
  }

  async updateTodo(todoId: number, status: TodoStatus, userId: number) {
    if (!Object.values(TodoStatus).includes(status)) {
      return { message: 'invalid status', status: 'failure' };
    }

    const check = await this.todoRepository.findOne({
      relations: ['user'],
      where: {
        id: todoId,
        user: { id: userId },
      },
    });
    if (check) {
      // console.log('===========', check);
      return {
        message: '',
        status: 'success',
        data: this.todoRepository.update(todoId, { status: status }),
      };
    } else {
      return { message: "don't have access", status: 'failure' };
    }
  }

  async remove(todoId: number) {
    const found = await this.todoRepository.findOne({ where: { id: todoId } });
    if (found) {
      const del = this.todoRepository.delete(todoId);
      return { message: '', status: 'success', data: del };
    } else {
      return { message: 'no row found', status: 'failure', data: [] };
    }
  }
}
