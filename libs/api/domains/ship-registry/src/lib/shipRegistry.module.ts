import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ShipRegistryResolver } from './resolvers/shipRegistry.resolver'
import { UserShipsResolver } from './resolvers/userShips.resolver'
import { UserShipsService } from './services/userShips.service'
import { ShipRegistryClientModule } from '@island.is/clients/ship-registry'
import { ShipRegistryClientV2Module } from '@island.is/clients/ship-registry-v2'

@Module({
  imports: [
    FeatureFlagModule,
    ShipRegistryClientModule,
    ShipRegistryClientV2Module,
  ],
  providers: [ShipRegistryResolver, UserShipsResolver, UserShipsService],
})
export class ShipRegistryModule {}
