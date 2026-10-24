import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto';
import { console } from 'inspector';


@Injectable()
export class StudentsService {

  // create logger object 
  private readonly logger = new Logger(StudentsService.name)

  // dependency injection of prisma service
  constructor(private readonly prisma: PrismaService) { }

  async create(createStudentDto: CreateStudentDto) {


    try {
      return await this.prisma.student.create({
        data: createStudentDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Student with email "${createStudentDto.email}" already exists`,
        );
      }
      throw error;
    }
  }


  // -----------------------------------------------------------------------------------------
  // handling http method get all students 
  // -----------------------------------------------------------------------------------------
  async findAll() {
    const students = await this.prisma.student.findMany({
      // sorting  from as to ds 
      orderBy: { id: 'asc' },
    });

    //  logging all the students 
    this.logger.log("The all students :", students);

    return students;
  }

  async findOne(id: number) {
    this.logger.log(`Student log: ${JSON.stringify(id)}`);

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    // Verify student exists first
    await this.findOne(id);

    try {
      return await this.prisma.student.update({
        where: { id },
        data: updateStudentDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Student with email "${updateStudentDto.email}" already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Verify student exists first
    await this.findOne(id);

    return this.prisma.student.delete({
      where: { id },
    });
  }
}
