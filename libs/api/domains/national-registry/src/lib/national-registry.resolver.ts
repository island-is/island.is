import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import { FamilyMember } from './familyMember.model'
import { MyInfo } from './myInfo.model'
import { NationalRegistryService } from './national-registry.service'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-api-lib'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class NationalRegistryResolver {
  constructor(private nationalRegistryService: NationalRegistryService) {}

  @Query(() => MyInfo, { nullable: true })
  getMyInfo(@CurrentUser() user: User): Promise<MyInfo | null> {
    return this.nationalRegistryService.GetMyinfo(user.nationalId)
  }

  @Query(() => [FamilyMember], { nullable: true })
  getMyFamily(@CurrentUser() user: User): Promise<FamilyMember[] | null> {
    return this.nationalRegistryService.GetMyFamily(user.nationalId)
  }
}
