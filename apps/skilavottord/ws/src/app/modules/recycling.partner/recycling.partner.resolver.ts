import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { RecyclingPartnerModel } from './model/recycling.partner.model'
import { RecyclingPartnerService } from './recycling.partner.service'
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
