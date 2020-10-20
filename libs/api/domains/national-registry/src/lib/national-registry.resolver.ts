import { Args, Resolver, Mutation, Query } from '@nestjs/graphql'
import { GetMyinfoInput } from './dto/getMyInfoInput'
import { MyInfo } from './myInfo.model'
import { NationalRegistryService } from './national-registry.service'

@Resolver()
export class NationalRegistryResolver {
  constructor(private nationalRegistryService: NationalRegistryService) { }

  @Query(() => MyInfo, { nullable: true })
  getMyInfo(
    /*TODO replace with proper authentication */
    @Args('input') input: GetMyinfoInput
  ): Promise<MyInfo | null> {
    console.log('get reslover');

    return this.nationalRegistryService.GetMyinfo(input.nationalId)
  }
}
