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
  Organization,
  SchoolType,
  DrivingLicenseBookStudentOverview,
} from './drivingLicenceBook.type'
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
    this.logger.debug(`driving-license-book: Create practical driving lesson`)
    return await this.drivingLicenseBookClientApiFactory.createPracticalDrivingLesson(
      input,
      user,
    )
  }

  async updatePracticalDrivingLesson(
    input: UpdatePracticalDrivingLessonInput,
    user: User,
  ): Promise<{ success: boolean }> {
    this.logger.debug(`driving-license-book: Update practical driving lesson`)
    return await this.drivingLicenseBookClientApiFactory.updatePracticalDrivingLesson(
      input,
      user,
    )
  }

  async deletePracticalDrivingLesson(
    { bookId, id, reason }: DeletePracticalDrivingLessonInput,
    user: User,
  ) {
    this.logger.debug(`driving-license-book: Delete practical driving lesson`)
    return await this.drivingLicenseBookClientApiFactory.deletePracticalDrivingLesson(
      { bookId, id, reason },
      user,
    )
  }

  async getPracticalDrivingLessons(
    input: PracticalDrivingLessonsInput,
  ): Promise<PracticalDrivingLesson[]> {
    this.logger.debug(`driving-license-book: Get practical driving lessons`)
    return await this.drivingLicenseBookClientApiFactory.getPracticalDrivingLessons(
      input,
    )
  }

  async findStudent(
    input: DrivingLicenseBookStudentsInput,
  ): Promise<DrivingLicenseBookStudent[]> {
    this.logger.debug(
      `driving-license-book: Finding student with key ${input.key}`,
    )
    return await this.drivingLicenseBookClientApiFactory.findStudent(input)
  }

  async getStudent({
    nationalId,
  }: DrivingLicenseBookStudentInput): Promise<DrivingLicenseBookStudentOverview> {
    this.logger.debug(`driving-license-book: Get student with id ${nationalId}`)
    return await this.drivingLicenseBookClientApiFactory.getStudent({
      nationalId,
    })
  }

  async getStudentsForTeacher(
    user: User,
  ): Promise<DrivingLicenseBookStudentForTeacher[]> {
    this.logger.debug(
      `driving-license-book: Getting student for teacher ${user}`,
    )
    return await this.drivingLicenseBookClientApiFactory.getStudentsForTeacher(
      user,
    )
  }

  async getMostRecentStudentBook({
    nationalId,
  }: DrivingLicenseBookStudentInput): Promise<DrivingLicenseBookStudentOverview | null> {
    this.logger.debug(`driving-license-book: Get most recent student book`)
    return await this.drivingLicenseBookClientApiFactory.getMostRecentStudentBook(
      {
        nationalId,
      },
    )
  }

  async getSchoolForSchoolStaff(user: User): Promise<Organization> {
    this.logger.debug(
      `driving-license-book: Get available driving schools for staff`,
    )
    return await this.drivingLicenseBookClientApiFactory.getSchoolForSchoolStaff(
      user,
    )
  }

  async isSchoolStaff(user: User): Promise<boolean> {
    this.logger.debug(
      `driving-license-book: Confirm user is staff at driving school`,
    )
    return await this.drivingLicenseBookClientApiFactory.isSchoolStaff(user)
  }

  async createDrivingSchoolTestResult(
    input: CreateDrivingSchoolTestResultInput,
  ): Promise<{ id: string } | null> {
    this.logger.debug(
      `driving-license-book: Create test result for driving school`,
    )
    return await this.drivingLicenseBookClientApiFactory.createDrivingSchoolTestResult(
      input,
    )
  }

  async getSchoolTypes(): Promise<SchoolType[] | null> {
    this.logger.debug(`driving-license-book: Get types for driving schools`)
    return await this.drivingLicenseBookClientApiFactory.getSchoolTypes()
  }

  async allowPracticeDriving(
    user: User,
    student: DrivingLicenseBookStudentInput,
  ) {
    this.logger.debug(`driving-license-book: Allow practice driving`)
    return await this.drivingLicenseBookClientApiFactory.allowPracticeDriving({
      teacherNationalId: user.nationalId,
      studentNationalId: student.nationalId,
    })
  }
}
