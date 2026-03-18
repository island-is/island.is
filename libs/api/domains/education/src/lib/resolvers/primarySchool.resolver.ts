import { ApiScope } from '@island.is/auth/scopes'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import {
  PrimarySchoolAssessmentSubject,
  PrimarySchoolStudent,
} from '../models/primarySchool'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => PrimarySchoolStudent)
export class PrimarySchoolResolver {
  constructor(
    private readonly primarySchoolService: PrimarySchoolClientService,
  ) {}

  @Query(() => [PrimarySchoolStudent], { nullable: true })
  @Scopes(ApiScope.education)
  async primarySchoolStudents(@CurrentUser() user: User) {
    const students = await this.primarySchoolService.getStudents(user)
    return students
      ?.filter((s) => s.id != null)
      .map((s) => ({ ...s, contactType: s.relationType }))
  }

  @Query(() => PrimarySchoolStudent, { nullable: true })
  @Scopes(ApiScope.education)
  async primarySchoolStudent(
    @CurrentUser() user: User,
    @Args('studentId') studentId: string,
  ) {
    const students = await this.primarySchoolService.getStudents(user)
    const student = students?.find((s) => s.id === studentId)
    if (!student?.id) return null
    return { ...student, contactType: student.relationType }
  }

  @ResolveField(() => [PrimarySchoolAssessmentSubject], { nullable: true })
  @Scopes(ApiScope.education)
  async assessmentSubjects(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
  ) {
    const subjects = await this.primarySchoolService.getAssessmentSubjects(
      user,
      student.id,
    )
    // Filter out subjects without IDs; thread studentId into each assessmentType
    // so PrimarySchoolAssessmentTypeResolver can read it via @Parent()
    return subjects
      ?.filter((s) => s.id != null)
      .map((s) => ({
        ...s,
        assessmentTypes: s.assessmentTypes
          ?.filter((t) => t.id != null)
          .map((t) => ({ ...t, studentId: student.id })),
      }))
  }
}
