import { Resolver, Query, Args } from '@nestjs/graphql'
import { BucketService } from './bucket.service'

@Resolver()
export class TestResolver {
  constructor(private readonly bucketService: BucketService) {}

  /* TEST */
  @Query(() => String, {
    name: 'healthInsuranceBucketTest',
  })
  async healthInsuranceBtest(
    @Args('filename', { nullable: true }) filename: string,
  ): Promise<string> {
    if (filename) {
      return await this.bucketService.getFileContentAsBase64(filename)
    } else {
      return await this.bucketService.getFileContentAsBase64('tux.png')
    }
  }
}
