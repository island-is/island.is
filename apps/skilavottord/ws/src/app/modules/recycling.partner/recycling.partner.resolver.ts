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
  async skilavottordAllRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return await this.recyclingPartnerService.findAll()
  }

  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllActiveRecyclingPartners(): Promise<
    RecyclingPartnerModel[]
  > {
    return await this.recyclingPartnerService.findActive()
  }

  @Mutation((returns) => Boolean)
  async createSkilavottordRecyclingPartner(
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
    logger.info('create new recyclingPartner...' + JSON.stringify(rp, null, 2))
    await this.recyclingPartnerService.createRecyclingPartner(rp)
    return true
  }

  @Mutation((returns) => String)
  async skilavottordDeactivateRecycllingPartner(
    @Args('companyId') nationalId: string,
  ) {
    logger.info('deactivate recycling-partner:' + nationalId)
    RecyclingPartnerModel.findOne({ where: { companyId: nationalId } }).then(
      (rp) => {
        rp.active = false
        return rp.save()
      },
    )
    return nationalId
  }

  @Mutation((returns) => String)
  async skilavottordActivateRecycllingPartner(
    @Args('companyId') nationalId: string,
  ) {
    logger.info('activate recycling-partner:' + nationalId)
    RecyclingPartnerModel.findOne({ where: { companyId: nationalId } }).then(
      (rp) => {
        rp.active = true
        return rp.save()
      },
    )
    return nationalId
  }
}
