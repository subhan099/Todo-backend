import { IsString, IsIn } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsString()
  title: string;

  // @IsString()
  // status: string;

  @IsString()
  @IsIn(Object.values(TodoStatus))
  status: TodoStatus;

  userId: string;
}
