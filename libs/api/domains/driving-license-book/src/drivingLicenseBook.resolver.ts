import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
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


@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Resolver()
export class DrivinLicenseBookResolver {
    constructor( private readonly drivingLicenseBookService: DrivingLicenseBookService){}

    @Query(() => StudentListResponse)
    studentList(@CurrentUser() user: User, @Args('input') input: StudentListInput) {
        console.log(user)
        return this.drivingLicenseBookService.getAllStudents(user, input)
    }
}
