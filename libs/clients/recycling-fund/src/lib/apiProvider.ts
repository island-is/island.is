import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, XRoadApi } from '../../gen/fetch'
import { ConfigFactory } from './configFactory'
import { RecyclingFundClientConfig } from './recyclingFundClient.config'

export const apiProvider = [XRoadApi].map((apiRecord) => ({
  provide: apiRecord,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof RecyclingFundClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new apiRecord(
      new Configuration(ConfigFactory(xRoadConfig, config, idsClientConfig)),
    )
  },
  inject: [XRoadConfig.KEY, RecyclingFundClientConfig.KEY, IdsClientConfig.KEY],
}))
