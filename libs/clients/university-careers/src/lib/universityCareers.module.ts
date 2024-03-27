import { Module } from '@nestjs/common'
import { AgriculturalUniversityOfIcelandCareerClientProvider } from './clients/agricultural-university-of-iceland/agriculturalUniversityOfIcelandCareerClient.provider'
import { BifrostUniversityCareerClientProvider } from './clients/bifrost-university/bifrostUniversityCareerClient.provider'
import { HolarUniversityCareerClientProvider } from './clients/holar-university/holarUniversityCareerClient.provider'
import { UniversityOfAkureyriCareerClientProvider } from './clients/university-of-akureyri/universityOfAkureyriCareerClient.provider'
import { UniversityCareersClientService } from './universityCareers.service'
import { UniversityOfIcelandCareerClientProvider } from './clients/university-of-iceland/universityOfIcelandCareerClient.provider'

@Module({
  providers: [
    AgriculturalUniversityOfIcelandCareerClientProvider,
    BifrostUniversityCareerClientProvider,
    HolarUniversityCareerClientProvider,
    UniversityOfAkureyriCareerClientProvider,
    UniversityOfIcelandCareerClientProvider,
    UniversityCareersClientService,
  ],
  exports: [UniversityCareersClientService],
})
export class UniversityCareersClientModule {}
