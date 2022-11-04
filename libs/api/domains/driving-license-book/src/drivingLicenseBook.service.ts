import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DrivingLicenseBookClientApiFactory } from '@island.is/clients/driving-license-book'
import { DrivingLicenseBookStudentsInput } from './dto/students.input'
import { User } from '@island.is/auth-nest-tools'
import { DrivingLicenseBookStudentInput } from './dto/student.input'
import { CreatePracticalDrivingLessonInput } from './dto/createPracticalDrivingLesson.input'
import { UpdatePracticalDrivingLessonInput } from './dto/updatePracticalDrivingLesson.input'
import { DeletePracticalDrivingLessonInput } from './dto/deletePracticalDrivingLesson.input'
import { PracticalDrivingLessonsInput } from './dto/getPracticalDrivingLessons.input'
import {
  DrivingLicenseBookStudentForTeacher,
  DrivingLicenseBookStudent,
  PracticalDrivingLesson,
  DrivingLicenseBookStudentOverview,
  Organization,
  SchoolType,
} from './drivinLicenceBook.type'
import { CreateDrivingSchoolTestResultInput } from './dto/createDrivingSchoolTestResult.input'

@Injectable()
export class DrivingLicenseBookService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DrivingLicenseBookClientApiFactory)
    private drivingLicenseBookClientApiFactory: DrivingLicenseBookClientApiFactory,
  ) {}

  async apiWithAuth() {
    return await this.drivingLicenseBookClientApiFactory.create()
  }

  async createPracticalDrivingLesson(
    input: CreatePracticalDrivingLessonInput,
    user: User,
  ): Promise<Partial<Pick<PracticalDrivingLesson, 'id'>> | null> {
    return await this.drivingLicenseBookClientApiFactory.createPracticalDrivingLesson(
      input,
      user,
    )
  }

  async updatePracticalDrivingLesson(
    input: UpdatePracticalDrivingLessonInput,
    user: User,
  ): Promise<{ success: boolean }> {
    return await this.drivingLicenseBookClientApiFactory.updatePracticalDrivingLesson(
      input,
      user,
    )
  }

  async deletePracticalDrivingLesson(
    { bookId, id, reason }: DeletePracticalDrivingLessonInput,
    user: User,
  ) {
    return await this.drivingLicenseBookClientApiFactory.deletePracticalDrivingLesson(
      { bookId, id, reason },
      user,
    )
  }

  async findStudent(
    input: DrivingLicenseBookStudentsInput,
  ): Promise<DrivingLicenseBookStudent[]> {
    return await this.drivingLicenseBookClientApiFactory.findStudent(input)
  }

  async getStudentsForTeacher(
    user: User,
  ): Promise<DrivingLicenseBookStudentForTeacher[]> {
    return await this.drivingLicenseBookClientApiFactory.getStudentsForTeacher(
      user,
    )
  }

  async getStudent({
    nationalId,
  }: DrivingLicenseBookStudentInput): Promise<DrivingLicenseBookStudentOverview> {
    return await this.drivingLicenseBookClientApiFactory.getStudent({
      nationalId,
    })
  }

  async getMostRecentStudentBook({
    nationalId,
  }: DrivingLicenseBookStudentInput): Promise<DrivingLicenseBookStudentOverview | null> {
    return await this.drivingLicenseBookClientApiFactory.getMostRecentStudentBook(
      {
        nationalId,
      },
    )
  }

  async getPracticalDrivingLessons(
    input: PracticalDrivingLessonsInput,
  ): Promise<PracticalDrivingLesson[]> {
    return await this.drivingLicenseBookClientApiFactory.getPracticalDrivingLessons(
      input,
    )
  }

  async getSchoolForSchoolStaff(user: User): Promise<Organization> {
    return await this.drivingLicenseBookClientApiFactory.getSchoolForSchoolStaff(
      user,
    )
  }

  async isSchoolStaff(user: User): Promise<boolean> {
    return await this.drivingLicenseBookClientApiFactory.isSchoolStaff(user)
  }

  async createDrivingSchoolTestResult(
    input: CreateDrivingSchoolTestResultInput,
  ): Promise<{ id: string } | null> {
    return await this.drivingLicenseBookClientApiFactory.createDrivingSchoolTestResult(
      input,
    )
  }

  async getSchoolTypes(): Promise<SchoolType[] | null> {
    return await this.drivingLicenseBookClientApiFactory.getSchoolTypes()
  }
}
