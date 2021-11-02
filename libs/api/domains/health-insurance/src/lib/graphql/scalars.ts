import { registerEnumType } from '@nestjs/graphql'
import {
  HealthInsuranceAccidentNotificationAttachmentTypes,
  HealthInsuranceAccidentNotificationConfirmationTypes,
  HealthInsuranceAccidentNotificationStatusTypes,
} from './../types'

registerEnumType(HealthInsuranceAccidentNotificationConfirmationTypes, {
  name: 'HealthInsuranceAccidentNotificationConfirmationTypes',
})

registerEnumType(HealthInsuranceAccidentNotificationStatusTypes, {
  name: 'HealthInsuranceAccidentNotificationStatusTypes',
})

registerEnumType(HealthInsuranceAccidentNotificationAttachmentTypes, {
  name: 'HealthInsuranceAccidentNotificationAttachmentTypes',
})
