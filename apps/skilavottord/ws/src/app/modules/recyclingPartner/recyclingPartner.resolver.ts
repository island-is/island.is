import { Query, Resolver, Args } from '@nestjs/graphql'
import { RecyclingPartner } from './models'
import { RecyclingPartnerService } from './models/recyclingPartner.service'

//TODO: remove
@Resolver(() => RecyclingPartner)
export class RecyclingPartnerResolver {
  RecyclingPartnerService: RecyclingPartnerService

  constructor() {
    this.RecyclingPartnerService = new RecyclingPartnerService()
  }

  @Query(() => RecyclingPartner)
  getRecyclingPartner(@Args('id') nid: number): RecyclingPartner {
    return this.RecyclingPartnerService.getRecyclingPartner(nid)
  }
}
