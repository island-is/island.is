import {
  buildAlertMessageField,
  buildDescriptionField,
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { PersonsOnComputers } from '@island.is/application/assets/graphics'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { Application, FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'

export const rejectedForm = buildForm({
  id: 'rejectedForm',
  mode: FormModes.REJECTED,
  logo: HmsLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'rejectedSection',
      tabTitle: m.institutionMessages.rejectedTitle,
      children: [
        buildMultiField({
          id: 'rejectedMultiField',
          title: m.institutionMessages.rejectedTitle,
          children: [
            buildAlertMessageField({
              id: 'rejectedSummaryAlert',
              title: m.institutionMessages.rejectedTitle,
              message: m.institutionMessages.rejectedMessage,
              alertType: 'error',
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'rejectedReasonHeading',
              title: m.institutionMessages.rejectionReasonLabel,
              titleVariant: 'h4',
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'rejectedReasonBody',
              description: (application: Application) => {
                const reason = getValueViaPath<string>(
                  application.answers,
                  'approveOrRejectReason',
                )?.trim()
                return reason?.length
                  ? reason
                  : m.institutionMessages.rejectedReasonEmpty
              },
              marginBottom: 5,
            }),
            buildImageField({
              id: 'rejectedIllustration',
              image: PersonsOnComputers,
              doesNotRequireAnswer: true,
              imagePosition: 'center',
              imageWidth: 'full',
            }),
          ],
        }),
      ],
    }),
  ],
})
