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
import { DrivingLicenseBookSchool } from './models/drivingSchool.response'
import { CreateDrivingSchoolTestResultInput } from './dto/createDrivingSchoolTestResult.input'
import { DrivingLicenceTestResultId } from './models/drivingLicenseTestResult.response'
import { DrivingSchoolType } from './models/drivingLicenseBookSchoolType.response'
import { DrivingSchoolEmployeeGuard } from './guards/drivingSchoolEmployee.guard'
import { DrivingInstructorOrEmployeeGuard } from './guards/drivingInstructorOrEmployee.guard'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DrivingLicenseBookResolver {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  @UseGuards(DrivingInstructorOrEmployeeGuard)
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

  @UseGuards(DrivingInstructorOrEmployeeGuard)
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
  @UseGuards(DrivingSchoolEmployeeGuard)
  @Query(() => DrivingLicenseBookSchool)
  drivingLicenseBookSchoolForEmployee(@CurrentUser() user: User) {
    return this.drivingLicenseBookService.getSchoolForSchoolStaff(user)
  }

  @Query(() => [DrivingSchoolType])
  drivingLicenseBookSchoolTypes() {
    return this.drivingLicenseBookService.getSchoolTypes()
  }

  @UseGuards(DrivingSchoolEmployeeGuard)
  @Mutation(() => DrivingLicenceTestResultId)
  drivingLicenseBookCreateDrivingSchoolTestResult(
    @Args('input') input: CreateDrivingSchoolTestResultInput,
  ) {
    return this.drivingLicenseBookService.createDrivingSchoolTestResult(input)
  }
}
