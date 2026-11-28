import { Module } from '@nestjs/common'
import { SpeechTherapyClientModule } from '@island.is/clients/icelandic-health-insurance/speech-therapy'
import { NationalRegistryV3Module } from '../../../shared/api/national-registry-v3/national-registry-v3.module'
import { SpeechTherapyWaitingListRegistrationService } from './speech-therapy-waiting-list-registration.service'

@Module({
  imports: [NationalRegistryV3Module, SpeechTherapyClientModule],
  providers: [SpeechTherapyWaitingListRegistrationService],
  exports: [SpeechTherapyWaitingListRegistrationService],
})
export class SpeechTherapyWaitingListRegistrationModule {}
