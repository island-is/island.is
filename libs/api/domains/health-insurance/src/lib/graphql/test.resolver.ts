import { Resolver, Query, Args } from '@nestjs/graphql'
import { BucketService } from './bucket.service'

// @Resolver()
export class TestResolver {
  constructor(private readonly bucketService: BucketService) {}

  /* TEST */
  // @Query(() => String)
  async healthInsuranceBtest(): Promise<string> {
    return await this.bucketService.getFileContentAsBase64('tux.png')
  }
}
