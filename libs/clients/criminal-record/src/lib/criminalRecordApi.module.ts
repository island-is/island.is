import { Module } from '@nestjs/common'
import { CriminalRecordApi } from './criminalRecordApi.service'
import { Configuration, CrimeCertificateApi } from '../../gen/fetch'
import { ApiConfiguration } from './apiConfiguration'

@Module({
  providers: [
    ApiConfiguration,
    {
      provide: CriminalRecordApi,
      useFactory: (configuration: Configuration) => {
        return new CriminalRecordApi(new CrimeCertificateApi(configuration))
      },
      inject: [ApiConfiguration.provide],
    },
  ],
  exports: [CriminalRecordApi],
})
export class CriminalRecordApiModule {}
