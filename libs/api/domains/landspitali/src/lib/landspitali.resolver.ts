import { Query, Resolver, Args } from '@nestjs/graphql'

import { LandspitaliService } from './landspitali.service'
import { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'
import { CreateMemorialCardPaymentUrlResponse } from './dto/createMemorialCardPaymentUrl.response'

@Resolver()
export class LandspitaliResolver {
  constructor(private landspitaliService: LandspitaliService) {}

  @Query(() => CreateMemorialCardPaymentUrlResponse, {
    name: 'webLandspitaliMemorialCardPaymentUrl',
  })
  async createMemorialCardPaymentUrl(
    @Args('input') input: CreateMemorialCardPaymentUrlInput,
  ): Promise<CreateMemorialCardPaymentUrlResponse> {
    return this.landspitaliService.createMemorialCardPaymentUrl(input)
  }
}
