import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const managedBy = [
  buildDescriptionField({
    id: 'certificateForSicknessAndRehabilitation.managedBy',
    title:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.managedBy,
    titleVariant: 'h3',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label: socialInsuranceAdministrationMessage.confirm.name,
    value: 'Teitur Stefán Jónsson',
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.managedByJobTitle,
    value: 'Heimilislæknir',
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.managedByLocation,
    value: 'Heilsugæslan Kirkjusandi',
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage
        .certificateForSicknessAndRehabilitation.managedByAddress,
    value: 'Kirkjusandur, 105 Reykjavík',
    width: 'half',
    marginBottom: 3,
  }),
  buildDividerField({}),
]
