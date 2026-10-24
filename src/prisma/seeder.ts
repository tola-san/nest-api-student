import { PrismaClient, Prisma } from '@prisma/client';

// 1. Create an instance of Prisma Client
const prisma = new PrismaClient();

// 2. Define the shape of the object (or use Prisma.StudentCreateInput)
interface StudentInfo {
    name: string;
    email: string;
    age: number;
    image_url?: string;
}

// 3. Array of student data objects
const mockStudents: StudentInfo[] = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 22,
        image_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        age: 25,
        image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        age: 20,
        image_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'San Tola',
        email: 'san.tola@example.com',
        age: 23,
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Ryan Yuma',
        email: 'ryan.yuma@example.com',
        age: 23,
        image_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Rathana Sok',
        email: 'rathana.sok@example.com',
        age: 23,
        image_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Sok Piseth',
        email: 'sok.piseth@example.com',
        age: 23,
        image_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    },
];

// 4. (Optional OOP pattern) Seeder Class
export class StudentSeeder {
    constructor(private readonly prismaClient: PrismaClient) { }

    async seed() {
        console.log('🌱 Starting database seeding...');

        for (const student of mockStudents) {
            // Using upsert prevents "Unique constraint failed" errors if run multiple times
            const result = await this.prismaClient.student.upsert({
                where: { email: student.email },
                update: {
                    name: student.name,
                    age: student.age,
                    image_url: student.image_url,
                },
                create: {
                    name: student.name,
                    email: student.email,
                    age: student.age,
                    image_url: student.image_url,
                },
            });

            console.log(`  ✔ Seeded student: ${result.name} (${result.email})`);
        }

        console.log('✅ All students seeded successfully!');
    }
}

// 5. Main async function to execute the seeder
export async function main() {
    const seeder = new StudentSeeder(prisma);
    await seeder.seed();
}

// Run main and handle disconnect / errors properly
main()
    .catch((error) => {
        console.error('❌ Error seeding students:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
