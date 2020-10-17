import { Inject } from '@nestjs/common'
import { Query, Resolver, Float, Args } from '@nestjs/graphql'
import { RecyclingPartnerService } from './recycling.partner.service'
import { RecyclingPartnerModel } from '../models'
// import { GdprService } from './models'

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
}
