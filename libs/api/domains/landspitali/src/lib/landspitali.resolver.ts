import { Resolver, Args, Mutation } from '@nestjs/graphql'

import { LandspitaliService } from './landspitali.service'
import { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'
import { CreateMemorialCardPaymentUrlResponse } from './dto/createMemorialCardPaymentUrl.response'

@Resolver()
export class LandspitaliResolver {
  constructor(private landspitaliService: LandspitaliService) {}

  @Mutation(() => CreateMemorialCardPaymentUrlResponse, {
    name: 'webLandspitaliMemorialCardPaymentUrl',
  })
  async createMemorialCardPaymentUrl(
    @Args('input') input: CreateMemorialCardPaymentUrlInput,
  ): Promise<CreateMemorialCardPaymentUrlResponse> {
    return this.landspitaliService.createMemorialCardPaymentUrl(input)
  }
}
