import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildStaticTableField,
  buildDividerField,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { EstateExternalData } from '../../types'

export const signingForm: Form = buildForm({
  id: 'signingForm',
  title: m.signingTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'signatoryStatus',
      title: m.signingTitle,
      children: [
        buildMultiField({
          id: 'signatoryStatusMultiField',
          title: m.signingTitle,
          description: m.signingDescription,
          children: [
            buildStaticTableField({
              title: m.signingTableTitle,
              marginTop: 3,
              header: [
                m.inReviewNameLabel,
                m.inReviewNationalIdLabel,
                m.signingStatusLabel,
              ],
              rows: (application) => {
                const externalData =
                  application.externalData as EstateExternalData
                const signatories =
                  externalData?.getSignatories?.data?.signatories || []

                return signatories.map((signatory) => [
                  signatory.name || '',
                  formatNationalId(signatory.nationalId || ''),
                  signatory.signed
                    ? m.signingStatusSigned.defaultMessage
                    : m.signingStatusPending.defaultMessage,
                ])
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'signatoryStatus.info',
              title: m.signingActionsInfoTitle,
              description: m.signingActionsInfoDescription,
              titleVariant: 'h3',
              space: 6,
              marginTop: 7,
            }),
            buildSubmitField({
              id: 'signingActions.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.signingComplete.defaultMessage,
                  type: 'primary',
                  condition: (answers, externalData) => {
                    const typedExternalData =
                      externalData as EstateExternalData
                    const signatories =
                      typedExternalData?.getSignatories?.data?.signatories || []
                    return (
                      signatories.length > 0 &&
                      signatories.every((s) => s.signed)
                    )
                  },
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
