import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum TodoStatus {
  Backlog = 'backlog',
  InProgress = 'in progress',
  Done = 'done',
}
@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  date: string;

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.Backlog,
  })
  status: TodoStatus;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
