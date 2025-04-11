import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { formatNumber } from 'libphonenumber-js'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const serviceProvider = [
  buildDescriptionField({
    id: 'rehabilitationPlan.serviceProvider',
    title: () => {
      return {
        ...medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
          .serviceProvider,
        values: { serviceProvider: 'Virk' },
      }
    },
    titleVariant: 'h3',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .serviceProviderLocation,
    value: 'Borgartúni 18,105 Reykjavík',
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label: socialInsuranceAdministrationMessage.info.applicantPhonenumber,
    value: formatNumber('+3545551234', 'International'),
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .serviceProviderRehabilitationProvider,
    value: 'Ekki skráð',
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .serviceProviderJobTitle,
    value: 'Ekki skráð',
    width: 'half',
    marginBottom: 3,
  }),
  buildDividerField({}),
]
