import { logger } from '@island.is/logging'
import { Inject } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { RecyclingPartnerModel } from './model/recycling.partner.model'
import { RecyclingPartnerService } from './recycling.partner.service'

@Resolver(() => RecyclingPartnerModel)
export class RecyclingPartnerResolver {
  constructor(
    @Inject(RecyclingPartnerService)
    private recyclingPartnerService: RecyclingPartnerService,
  ) {}

  @Query(() => [RecyclingPartnerModel])
  async getAllRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return await this.recyclingPartnerService.findAll()
  }

  @Query(() => [RecyclingPartnerModel])
  async getAllActiveRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return await this.recyclingPartnerService.findActive()
  }

  @Mutation((returns) => Boolean)
  async setRecyclingPartner(
    @Args('companyId') nationalId: string,
    @Args('companyName') companyName: string,
    @Args('address') address: string,
    @Args('postnumber') postnumber: string,
    @Args('city') city: string,
    @Args('website') website: string,
    @Args('phone') phone: string,
    @Args('active') active: boolean,
  ) {
    const rp = new RecyclingPartnerModel()
    rp.companyId = nationalId
    rp.companyName = companyName
    rp.address = address
    rp.postnumber = postnumber
    rp.city = city
    rp.website = website
    rp.phone = phone
    rp.active = active
    logger.debug('create new recyclingPartner...' + JSON.stringify(rp, null, 2))
    await this.recyclingPartnerService.createRecyclingPartner(rp)
    return true
  }
}
