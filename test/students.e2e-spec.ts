import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Students CRUD (e2e)', () => {
  let app: INestApplication;

  const mockStudents = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 22,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockPrismaService = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    student: {
      findMany: jest.fn().mockResolvedValue(mockStudents),
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        const student = mockStudents.find((s) => s.id === id);
        return Promise.resolve(student || null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        const newStudent = { id: 2, ...data, createdAt: new Date(), updatedAt: new Date() };
        return Promise.resolve(newStudent);
      }),
      update: jest.fn().mockImplementation(({ where: { id }, data }) => {
        const student = mockStudents.find((s) => s.id === id);
        return Promise.resolve({ ...student, ...data });
      }),
      delete: jest.fn().mockImplementation(({ where: { id } }) => {
        const student = mockStudents.find((s) => s.id === id);
        return Promise.resolve(student);
      }),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /students — should create a new student', () => {
    return request(app.getHttpServer())
      .post('/students')
      .send({
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 21,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual(2);
        expect(res.body.name).toEqual('Jane Smith');
        expect(res.body.email).toEqual('jane@example.com');
      });
  });

  it('POST /students — should return 400 when validation fails', () => {
    return request(app.getHttpServer())
      .post('/students')
      .send({
        name: '',
        email: 'not-an-email',
      })
      .expect(400);
  });

  it('GET /students — should list all students', () => {
    return request(app.getHttpServer())
      .get('/students')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].email).toEqual('john@example.com');
      });
  });

  it('GET /students/1 — should return student with ID 1', () => {
    return request(app.getHttpServer())
      .get('/students/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(1);
        expect(res.body.name).toEqual('John Doe');
      });
  });

  it('GET /students/999 — should return 404 for non-existent student', () => {
    return request(app.getHttpServer())
      .get('/students/999')
      .expect(404);
  });

  it('PATCH /students/1 — should update an existing student', () => {
    return request(app.getHttpServer())
      .patch('/students/1')
      .send({
        name: 'John Updated',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual('John Updated');
      });
  });

  it('DELETE /students/1 — should delete a student', () => {
    return request(app.getHttpServer())
      .delete('/students/1')
      .expect(200);
  });
});
