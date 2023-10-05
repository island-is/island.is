import { Configuration, MachinesApi } from '../../gen/fetch';
import { Provider } from '@nestjs/common'
import {
    ConfigType,
    XRoadConfig,
    LazyDuringDevScope,
    IdsClientConfig,
  } from '@island.is/nest/config'
import { AosahClientConfig } from './aosahClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const AosahApiProvider: Provider<MachinesApi> = {
    provide: MachinesApi,
    scope: LazyDuringDevScope,
    useFactory: (
        xRoadConfig: ConfigType<typeof XRoadConfig>,
        config: ConfigType<typeof AosahClientConfig>,
        idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) =>
        new MachinesApi(
            new Configuration({
                fetchApi: createEnhancedFetch({
                    name: 'clients-aosah',
                    timeout: config.fetch.timeout,
                    autoAuth: idsClientConfig.isConfigured
                        ? {
                            mode: 'tokenExchange',
                            issuer: idsClientConfig.issuer,
                            clientId: idsClientConfig.clientId,
                            clientSecret: idsClientConfig.clientSecret,
                            scope: config.scope,
                        }
                        : undefined,
                }),

                basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
                headers: {
                    'X-Road-Client': xRoadConfig.xRoadClient,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }),
        ),
    inject: [XRoadConfig.KEY, AosahClientConfig.KEY, IdsClientConfig.KEY],
}