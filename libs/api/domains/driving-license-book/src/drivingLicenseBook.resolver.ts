import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import {
  BypassAuth,
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { DrivingLicenseBookService } from './drivingLicenseBook.service'
import { StudentListInput } from './dto/studentList.input'
import { StudentListResponse } from './models/studentList.response'
import { LicenseBookIdInput } from './dto/licenseBookId.input'
import { DigitalBookResponse } from './models/digitalBook.response'
import { PracticalDrivingLessonsInput } from './dto/getPracticalDrivingLessons.input'
import { PracticalDrivingLessonsResponse } from './models/practicalDrivingLessons.response'
import { StudentInput } from './dto/student.input'
import { StudentOverViewResponse } from './models/student.response'
import { CreatePracticalDrivingLessonResponse } from './models/createPracticalDrivingLicense.response'
import { CreatePracticalDrivingLessonInput } from './dto/createPracticalDrivingLesson.input'
import { SuccessResponse } from './models/success.response'
import { UpdatePracticalDrivingLessonInput } from './dto/updatePracticalDrivingLesson.input'
import { DeletePracticalDrivingLessonInput } from './dto/deletePracticalDrivingLesson.input'
import { StudentListTeacherSsnResponse } from './models/studentsTeacherSsn.response'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DrivinLicenseBookResolver {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  @Query(() => StudentListResponse)
  studentList(@Args('input') input: StudentListInput) {
    return this.drivingLicenseBookService.getStudentList(input)
  }

  @Query(() => StudentListTeacherSsnResponse)
  studentListTeacherSsn(@CurrentUser() user: User) {
    return this.drivingLicenseBookService.getStudentListTeacherSsn(user)
  }

  @Query(() => StudentOverViewResponse)
  student(@Args('input') input: StudentInput) {
    return this.drivingLicenseBookService.getStudent(input)
  }

  @Query(() => DigitalBookResponse)
  licenseBook(@Args('input') input: LicenseBookIdInput) {
    return this.drivingLicenseBookService.getLicenseBookId(input)
  }

  @Query(() => PracticalDrivingLessonsResponse)
  practicalDrivingLessons(@Args('input') input: PracticalDrivingLessonsInput) {
    return this.drivingLicenseBookService.getPracticalDrivingLessonsBookId(
      input,
    )
  }

  @Mutation(() => CreatePracticalDrivingLessonResponse)
  createPracticalDrivingLesson(
    @Args('input') input: CreatePracticalDrivingLessonInput,
  ) {
    return this.drivingLicenseBookService.createPracticalDrivingLesson(input)
  }

  @Mutation(() => SuccessResponse)
  updatePracticalDrivingLesson(
    @Args('input') input: UpdatePracticalDrivingLessonInput,
  ) {
    return this.drivingLicenseBookService.updatePracticalDrivingLesson(input)
  }

  @Mutation(() => SuccessResponse)
  deletePracticalDrivingLesson(
    @Args('input') input: DeletePracticalDrivingLessonInput,
  ) {
    return this.drivingLicenseBookService.deletePracticalDrivingLesson(input)
  }
}
