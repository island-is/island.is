import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import { FamilyMember } from './familyMember.model'
import { MyInfo } from './myInfo.model'
import { NationalRegistryService } from './national-registry.service'
import { IdsAuthGuard, ScopesGuard, CurrentUser } from '@island.is/auth-api-lib'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class NationalRegistryResolver {
  constructor(private nationalRegistryService: NationalRegistryService) { }

  @Query(() => MyInfo, { nullable: true })
  getMyInfo(@CurrentUser() user: any): Promise<MyInfo | null> {
    return this.nationalRegistryService.GetMyinfo(user.natreg)
  }

  @Query(() => [FamilyMember], { nullable: true })
  getMyFamily(@CurrentUser() user: any): Promise<FamilyMember[] | null> {
    return this.nationalRegistryService.GetMyFamily(user.natreg)
  }
}
