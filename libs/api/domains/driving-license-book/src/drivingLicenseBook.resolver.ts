import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { DrivingLicenseBookService } from './drivingLicenseBook.service'
import { StudentListInput } from './dto/studentList.input'
import { DrivingBookStudent } from './models/drivingBookStudent.response'
import { PracticalDrivingLessonsInput } from './dto/getPracticalDrivingLessons.input'
import { PracticalDrivingLesson } from './models/practicalDrivingLesson.response'
import { StudentInput } from './dto/student.input'
import { DrivingBookStudentOverview } from './models/drivingBookStudentOverview.response'
import { CreatePracticalDrivingLessonInput } from './dto/createPracticalDrivingLesson.input'
import { SuccessResponse } from './models/success.response'
import { UpdatePracticalDrivingLessonInput } from './dto/updatePracticalDrivingLesson.input'
import { DeletePracticalDrivingLessonInput } from './dto/deletePracticalDrivingLesson.input'
import { Student } from './models/studentsTeacherNationalId.response'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DrivinLicenseBookResolver {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  @Query(() => [DrivingBookStudent], { nullable: true })
  drivingBookStudentList(@Args('input') input: StudentListInput) {
    return this.drivingLicenseBookService.getStudentList(input)
  }

  @Query(() => [Student])
  drivingBookStudentListByTeacherNationalId(@CurrentUser() user: User) {
    return this.drivingLicenseBookService.getStudentListTeacherNationalId(user)
  }

  @Query(() => DrivingBookStudentOverview)
  drivingBookStudent(@Args('input') input: StudentInput) {
    return this.drivingLicenseBookService.getStudent(input)
  }

  @Query(() => [PracticalDrivingLesson])
  drivingBookPracticalDrivingLessons(
    @Args('input') input: PracticalDrivingLessonsInput,
  ) {
    return this.drivingLicenseBookService.getPracticalDrivingLessons(input)
  }

  @Mutation(() => PracticalDrivingLesson, { nullable: true })
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
