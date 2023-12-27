import { Module } from '@nestjs/common'
import { IcelandUniversityOfTheArtsApplicationClient } from './icelandUniversityOfTheArtsClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, IcelandUniversityOfTheArtsApplicationClient],
  exports: [IcelandUniversityOfTheArtsApplicationClient],
})
export class IcelandUniversityOfTheArtsApplicationClientModule {}
