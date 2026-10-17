import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  const mockStudent = {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStudentsService = {
    create: jest.fn().mockResolvedValue(mockStudent),
    findAll: jest.fn().mockResolvedValue([mockStudent]),
    findOne: jest.fn().mockResolvedValue(mockStudent),
    update: jest.fn().mockResolvedValue({ ...mockStudent, name: 'Alice Smith' }),
    remove: jest.fn().mockResolvedValue(mockStudent),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const dto: CreateStudentDto = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        age: 20,
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockStudent);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockStudent]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single student by ID', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockStudent);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const dto: UpdateStudentDto = { name: 'Alice Smith' };
      const result = await controller.update(1, dto);
      expect(result.name).toEqual('Alice Smith');
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual(mockStudent);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
