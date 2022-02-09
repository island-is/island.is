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
import { ActiveBookIdInput } from './dto/activeBookId.input'
import { ActiveBookIdResponse } from './models/activeBookId.response'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DrivinLicenseBookResolver {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  @Query(() => StudentListResponse)
  drivingBookStudentList(@Args('input') input: StudentListInput) {
    return this.drivingLicenseBookService.getStudentList(input)
  }

  @Query(() => StudentListTeacherSsnResponse)
  drivingBookStudentListByTeacherSsn(@CurrentUser() user: User) {
    return this.drivingLicenseBookService.getStudentListTeacherSsn(user)
  }

  @Query(() => StudentOverViewResponse)
  drivingBookStudent(@Args('input') input: StudentInput) {
    return this.drivingLicenseBookService.getStudent(input)
  }

  @Query(() => ActiveBookIdResponse)
  drivingBookActiveBookId(@Args('input') input: ActiveBookIdInput) {
    return this.drivingLicenseBookService.getActiveBookId(input)
  }

  @Query(() => DigitalBookResponse)
  drivingBookDigitalBook(@Args('input') input: LicenseBookIdInput) {
    return this.drivingLicenseBookService.getLicenseBookId(input)
  }

  @Query(() => PracticalDrivingLessonsResponse)
  drivingBookPracticalDrivingLessons(@Args('input') input: PracticalDrivingLessonsInput) {
    return this.drivingLicenseBookService.getPracticalDrivingLessonsBookId(
      input,
    )
  }

  @Mutation(() => CreatePracticalDrivingLessonResponse)
  drivingBookCreatePracticalDrivingLesson(
    @Args('input') input: CreatePracticalDrivingLessonInput,
  ) {
    return this.drivingLicenseBookService.createPracticalDrivingLesson(input)
  }

  @Mutation(() => SuccessResponse)
  drivingBookUpdatePracticalDrivingLesson(
    @Args('input') input: UpdatePracticalDrivingLessonInput,
  ) {
    return this.drivingLicenseBookService.updatePracticalDrivingLesson(input)
  }

  @Mutation(() => SuccessResponse)
  drivingBookDeletePracticalDrivingLesson(
    @Args('input') input: DeletePracticalDrivingLessonInput,
  ) {
    return this.drivingLicenseBookService.deletePracticalDrivingLesson(input)
  }
}
