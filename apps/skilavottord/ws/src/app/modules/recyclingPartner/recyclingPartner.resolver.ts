import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorize } from '../auth'
import { logger } from '@island.is/logging'

import { RecyclingPartnerModel } from './recyclingPartner.model'
import { RecyclingPartnerService } from './recyclingPartner.service'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => RecyclingPartnerModel)
export class RecyclingPartnerResolver {
  constructor(private recyclingPartnerService: RecyclingPartnerService) {}

  /*
    All recycling companies
  */
  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllRecyclingPartners(): Promise<RecyclingPartnerModel[]> {
    return await this.recyclingPartnerService.findAll()
  }

  /*
    Recycling company
  */
  @Query(() => [RecyclingPartnerModel])
  async skilavottordAllActiveRecyclingPartners(): Promise<
    RecyclingPartnerModel[]
  > {
    return await this.recyclingPartnerService.findActive()
  }

  /*
    Add recycling company to database
  */
  @Authorize({ roles: ['developer', 'recyclingFund'] })
  @Mutation((_) => Boolean)
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
  /*
    Deactivate recycling company to database
  */
  @Authorize({ roles: ['developer', 'recyclingFund'] })
  @Mutation((_) => String)
  async skilavottordDeactivateRecycllingPartner(
    @Args('companyId') nationalId: string,
  ) {
    logger.info('deactivate recyclingPartner:' + nationalId)
    RecyclingPartnerModel.findOne({ where: { companyId: nationalId } }).then(
      (rp) => {
        rp.active = false
        return rp.save()
      },
    )
    return nationalId
  }
  /*
    Activate recycling company to database
  */
  @Authorize({ roles: ['developer', 'recyclingFund'] })
  @Mutation((_) => String)
  async skilavottordActivateRecycllingPartner(
    @Args('companyId') nationalId: string,
  ) {
    logger.info('activate recyclingPartner:' + nationalId)
    RecyclingPartnerModel.findOne({ where: { companyId: nationalId } }).then(
      (rp) => {
        rp.active = true
        return rp.save()
      },
    )
    return nationalId
  }
}
