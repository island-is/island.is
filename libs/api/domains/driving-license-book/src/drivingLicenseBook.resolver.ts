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
import { DrivingLicenseBookStudentOverview } from './models/drivingBookStudentOverview.response'
import { CreatePracticalDrivingLessonInput } from './dto/createPracticalDrivingLesson.input'
import { DrivingLicenseBookSuccess } from './models/success.response'
import { UpdatePracticalDrivingLessonInput } from './dto/updatePracticalDrivingLesson.input'
import { DeletePracticalDrivingLessonInput } from './dto/deletePracticalDrivingLesson.input'
import { DrivingLicenseBookStudentForTeacher } from './models/studentsTeacherNationalId.response'
import { DrivingInstructorGuard } from './guards/drivingInstructor.guard'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DrivingLicenseBookResolver {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  @UseGuards(DrivingInstructorGuard)
  @Query(() => [DrivingLicenseBookStudent])
  drivingLicenseBookFindStudent(
    @Args('input') input: DrivingLicenseBookStudentsInput,
  ) {
    return this.drivingLicenseBookService.findStudent(input)
  }

  @UseGuards(DrivingInstructorGuard)
  @Query(() => [DrivingLicenseBookStudentForTeacher])
  drivingLicenseBookStudentsForTeacher(@CurrentUser() user: User) {
    return this.drivingLicenseBookService.getStudentsForTeacher(user)
  }

  @UseGuards(DrivingInstructorGuard)
  @Query(() => DrivingLicenseBookStudentOverview)
  drivingLicenseBookStudent(
    @Args('input') input: DrivingLicenseBookStudentInput,
  ) {
    return this.drivingLicenseBookService.getStudent(input)
  }

  @UseGuards(DrivingInstructorGuard)
  @Query(() => [PracticalDrivingLesson])
  drivingLicenseBookPracticalDrivingLessons(
    @Args('input') input: PracticalDrivingLessonsInput,
  ) {
    return this.drivingLicenseBookService.getPracticalDrivingLessons(input)
  }

  @UseGuards(DrivingInstructorGuard)
  @Mutation(() => PracticalDrivingLesson)
  drivingLicenseBookCreatePracticalDrivingLesson(
    @Args('input') input: CreatePracticalDrivingLessonInput,
    @CurrentUser() user: User,
  ) {
    return this.drivingLicenseBookService.createPracticalDrivingLesson(
      input,
      user,
    )
  }

  @UseGuards(DrivingInstructorGuard)
  @Mutation(() => DrivingLicenseBookSuccess)
  drivingLicenseBookUpdatePracticalDrivingLesson(
    @Args('input') input: UpdatePracticalDrivingLessonInput,
    @CurrentUser() user: User,
  ) {
    return this.drivingLicenseBookService.updatePracticalDrivingLesson(
      input,
      user,
    )
  }

  @UseGuards(DrivingInstructorGuard)
  @Mutation(() => DrivingLicenseBookSuccess)
  drivingLicenseBookDeletePracticalDrivingLesson(
    @Args('input') input: DeletePracticalDrivingLessonInput,
    @CurrentUser() user: User,
  ) {
    return this.drivingLicenseBookService.deletePracticalDrivingLesson(
      input,
      user,
    )
  }
}
