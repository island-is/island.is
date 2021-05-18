import { Resolver } from '@nestjs/graphql'
import { NationalRegistryXRoadService } from './national-registry-x-road.service'

@Resolver()
export class NationalRegistryXRoadResolver {
  constructor(
    private nationalRegistryXRoadService: NationalRegistryXRoadService,
  ) {}
}
