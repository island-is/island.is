import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { DrivingLicenseBookService } from './drivingLicenseBook.service'
import { DrivingLicenseBookStudentsInput } from './dto/students.input'
import { DrivingLicenseBookStudent } from './models/drivingLicenseBookStudent.response'
import { PracticalDrivingLessonsInput } from './dto/getPracticalDrivingLessons.input'
import { PracticalDrivingLesson } from './models/practicalDrivingLesson.response'
import { DrivingLicenseBookStudentInput } from './dto/student.input'
import { DrivingBookStudentOverview } from './models/drivingBookStudentOverview.response'
import { CreatePracticalDrivingLessonInput } from './dto/createPracticalDrivingLesson.input'
import { Success } from './models/success.response'
import { UpdatePracticalDrivingLessonInput } from './dto/updatePracticalDrivingLesson.input'
import { DeletePracticalDrivingLessonInput } from './dto/deletePracticalDrivingLesson.input'
import { DrivingLicenseBookStudentForTeacher } from './models/studentsTeacherNationalId.response'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DrivinLicenseBookResolver {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  @Query(() => [DrivingLicenseBookStudent])
  drivingLicneseBookFindStudent(@Args('input') input: DrivingLicenseBookStudentsInput) {
    return this.drivingLicenseBookService.findStudent(input)
  }

  @Query(() => [DrivingLicenseBookStudentForTeacher])
  drivingLicenseBookStudentListByTeacherNationalId(@CurrentUser() user: User) {
    return this.drivingLicenseBookService.getStudentsForTeacher(user)
  }

  @Query(() => DrivingBookStudentOverview)
  drivingLicenseBookStudent(@Args('input') input: DrivingLicenseBookStudentInput) {
    return this.drivingLicenseBookService.getStudent(input)
  }

  @Query(() => [PracticalDrivingLesson])
  drivingLicenseBookPracticalDrivingLessons(
    @Args('input') input: PracticalDrivingLessonsInput,
  ) {
    return this.drivingLicenseBookService.getPracticalDrivingLessons(input)
  }

  @Mutation(() => PracticalDrivingLesson, { nullable: true })
  drivingLicenseBookCreatePracticalDrivingLesson(
    @Args('input') input: CreatePracticalDrivingLessonInput,
  ) {
    return this.drivingLicenseBookService.createPracticalDrivingLesson(input)
  }

  @Mutation(() => Success)
  drivingLicenseBookUpdatePracticalDrivingLesson(
    @Args('input') input: UpdatePracticalDrivingLessonInput,
    @CurrentUser() user: User
  ) {
    return this.drivingLicenseBookService.updatePracticalDrivingLesson(input, user)
  }

  @Mutation(() => Success)
  drivingLicenseBookDeletePracticalDrivingLesson(
    @Args('input') input: DeletePracticalDrivingLessonInput,
    @CurrentUser() user: User
  ) {
    return this.drivingLicenseBookService.deletePracticalDrivingLesson(input, user)
  }
}
