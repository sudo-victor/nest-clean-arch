import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
  abstract create(student: Student): Promise<Student>
  abstract findByEmail(slug: string): Promise<Student | null>
}
