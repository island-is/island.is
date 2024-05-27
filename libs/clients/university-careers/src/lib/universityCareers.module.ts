import { Module } from '@nestjs/common'
import { AgriculturalUniversityOfIcelandCareerClientProvider } from './clients/agricultural-university-of-iceland/agriculturalUniversityOfIcelandCareerClient.provider'
import { BifrostUniversityCareerClientProvider } from './clients/bifrost-university/bifrostUniversityCareerClient.provider'
import { HolarUniversityCareerClientProvider } from './clients/holar-university/holarUniversityCareerClient.provider'
import { UniversityOfAkureyriCareerClientProvider } from './clients/university-of-akureyri/universityOfAkureyriCareerClient.provider'
import { UniversityCareersClientService } from './universityCareers.service'
import { UniversityOfIcelandCareerClientProvider } from './clients/university-of-iceland/universityOfIcelandCareerClient.provider'
import { IcelandUniversityOfTheArtsCareerClientProvider } from './clients/iceland-university-of-the-arts/icelandUniversityOfTheArtsCareerClient.provider'

@Module({
  providers: [
    AgriculturalUniversityOfIcelandCareerClientProvider,
    BifrostUniversityCareerClientProvider,
    HolarUniversityCareerClientProvider,
    UniversityOfAkureyriCareerClientProvider,
    UniversityOfIcelandCareerClientProvider,
    IcelandUniversityOfTheArtsCareerClientProvider,
    UniversityCareersClientService,
  ],
  exports: [UniversityCareersClientService],
})
export class UniversityCareersClientModule {}
