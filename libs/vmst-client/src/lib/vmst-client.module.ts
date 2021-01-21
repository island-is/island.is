import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import {
  Configuration,
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
} from '../../gen/fetch'

// TODO
const XROAD_BASE_PATH = process.env.XROAD_BASE_PATH ?? ''
const XROAD_CLIENT = process.env.XROAD_CLIENT_ID ?? ''
const VMST_API_KEY = process.env.VMST_API_KEY ?? ''

const headers = {
  'api-key': VMST_API_KEY,
  'X-Road-Client': XROAD_CLIENT,
}

@Module({
  controllers: [],
  providers: [
    {
      provide: ParentalLeaveApi,
      useFactory: () =>
        new ParentalLeaveApi(
          new Configuration({
            fetchApi: fetch,
            basePath: XROAD_BASE_PATH,
            headers,
          }),
        ),
    },
    {
      provide: PensionApi,
      useFactory: () =>
        new PensionApi(
          new Configuration({
            fetchApi: fetch,
            basePath: XROAD_BASE_PATH,
            headers,
          }),
        ),
    },
    {
      provide: PregnancyApi,
      useFactory: () =>
        new PregnancyApi(
          new Configuration({
            fetchApi: fetch,
            basePath: XROAD_BASE_PATH,
            headers,
          }),
        ),
    },
    {
      provide: UnionApi,
      useFactory: () =>
        new UnionApi(
          new Configuration({
            fetchApi: fetch,
            basePath: XROAD_BASE_PATH,
            headers,
          }),
        ),
    },
  ],
  exports: [ParentalLeaveApi, PensionApi, PregnancyApi, UnionApi],
})
export class VMSTClientModule {}
