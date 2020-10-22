import { Args, Resolver, Query } from '@nestjs/graphql'
import { GetMyInfoInput } from './dto/getMyInfoInput'
import { FamilyMember } from './familyMember.model'
import { MyInfo } from './myInfo.model'
import { NationalRegistryService } from './national-registry.service'

@Resolver()
export class NationalRegistryResolver {
  constructor(private nationalRegistryService: NationalRegistryService) {}

  @Query(() => MyInfo, { nullable: true })
  getMyInfo(
    /*TODO replace with authentication */
    @Args('input') input: GetMyInfoInput,
  ): Promise<MyInfo | null> {
    return this.nationalRegistryService.GetMyinfo(input.nationalId)
  }

  @Query(() => [FamilyMember], { nullable: true })
  getMyFamily(
    /*TODO replace with authentication */
    @Args('input') input: GetMyInfoInput,
  ): Promise<FamilyMember[] | null> {
    return this.nationalRegistryService.GetMyFamily(input.nationalId)
  }
}
