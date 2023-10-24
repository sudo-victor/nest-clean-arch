import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(student: Student): Promise<Student> {
    const data = PrismaStudentMapper.toPersistence(student)
    const studentPersisted = await this.prisma.user.create({
      data,
    })

    return PrismaStudentMapper.toDomain(studentPersisted)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }
}
