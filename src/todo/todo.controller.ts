import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { TodoStatus } from './entities/todo.entity';
// import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('create')
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto, +createTodoDto.userId);
  }

  @Get('/findfk/:id')
  findFK(@Param('id') id: string) {
    return this.todoService.findTodoFK(+id);
  }

  @Get('/find')
  findAll(@Body() requestBody: { userId: number; status: TodoStatus }) {
    const userId = requestBody.userId;
    const status = requestBody.status;
    return this.todoService.findTodo(+userId, status);
  }
  @Get()
  // @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  find(@Req() req) {
    console.log(req.user);
    return this.todoService.findAll();
  }

  @Patch('/update')
  UpdateAll(
    @Body() requestBody: { todoId: number; status: TodoStatus },
    @Req() req,
  ) {
    const todoId = requestBody.todoId;
    const status = requestBody.status;
    const userId = req.user.userId;
    // console.log('+++++++++++++', userId);

    return this.todoService.updateTodo(+todoId, status, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.todoService.remove(+id);
    console.log(result.status);
    if (result.status === 'failure') {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  }
}
