import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';


//  
describe('Students CRUD (e2e)', () => {
  let app: INestApplication;

  //  create objet for testing mockup 
  const mockStudents = [
    {
      id: 1,
      name: 'Tola San',
      email: 'tolasan@gmail.com',
      age: 23,
      image_url: "https://static.vecteezy.com/system/resources/thumbnails/024/295/121/small/school-boy-with-books-illustration-ai-generative-free-photo.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    {
      id:2,
      name:'Ryan Yuma',
      email:'Ryanyuma12@gmail.com',
      age:23,
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5u9fQk4H0nIGEwogeuFx8lf9Y2EzK43fXOMPSMxhU9cOf9eiv3G-e3Kmo&s=10",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
     
  ];

  //  servie object 
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
        name: 'Heng sok',
        email: 'hengsok@gmail.com',
        age: 21,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual(2);
        expect(res.body.name).toEqual('Heng sok');
        expect(res.body.email).toEqual('hengsok@gmail.com');
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

  it('GET /students — exspected get all students', () => {

    return request(app.getHttpServer())
      .get('/students')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].email).toEqual('tolasan@gmail.com');
      });
  });

  it('GET /students/1 — should return student with ID 1', () => {
    return request(app.getHttpServer())
      .get('/students/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(1);
        expect(res.body.name).toEqual('Tola San');
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
        name: 'Bondit',
        email: 'bondit@email.com'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual('Bondit');
        expect(res.body.email).toEqual('bondit@email.com');
        
      });
  });

  it('DELETE /students/1 — should delete a student', () => {
    return request(app.getHttpServer())
      .delete('/students/1')
      .expect(200);
  });
});
