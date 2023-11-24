import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { VehiclesService } from './api-domains-vehicles.service'
import { VehicleMileageDetail } from '../models/getVehicleMileage.model'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
import { LOGGER_PROVIDER } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehiclesDetail)
@Audit({ namespace: '@island.is/api/vehicles' })
export class VehiclesSharedResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @ResolveField('lastMileage', () => VehicleMileageDetail, {
    nullable: true,
  })
  async resolveLastMileage(
    @Context('req') { user }: { user: User },
    @Parent() overview: VehiclesDetail,
  ): Promise<VehicleMileageDetail | null> {
    const res = await this.vehiclesService.getVehicleMileage(user, {
      permno: overview.basicInfo?.permno ?? '',
    })

    this.logger.debug('resolveLastMileage data', res?.data)
    if (res?.data && res?.data.length > 0) {
      return res?.data[0]
    }

    return null
  }
}
