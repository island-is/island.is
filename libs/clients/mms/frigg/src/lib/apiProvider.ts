import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, FriggApi, MnarSurApi } from '../../gen/fetch'
import { ConfigFactory } from './configFactory'
import { FriggClientConfig } from './friggClient.config'

export const apiProvider = [FriggApi, MnarSurApi].map((apiRecord) => ({
  provide: apiRecord,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FriggClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    // Only the key-info endpoints need the student.* scopes; FriggApi keeps the
    // bare nemendagrunnur token the application-system's client is granted.
    const scope =
      apiRecord === MnarSurApi ? config.keyInfoScope : config.scope

    return new apiRecord(
      new Configuration(
        ConfigFactory(xRoadConfig, config, idsClientConfig, scope),
      ),
    )
  },
  inject: [XRoadConfig.KEY, FriggClientConfig.KEY, IdsClientConfig.KEY],
}))
