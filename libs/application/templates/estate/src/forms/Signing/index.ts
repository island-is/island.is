import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildCustomField,
  buildDividerField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { InheritanceSignatory } from '@island.is/clients/syslumenn'

const allSignatoriesSigned = (
  externalData: Record<string, unknown>,
): boolean => {
  // Only show the finish button once signatories have been fetched
  // successfully. A successful fetch with no signatories (types that require
  // no co-signing at syslumenn) is a valid completion case (every() is
  // vacuously true); a failed fetch keeps the read-only status view.
  const fetchSucceeded = getValueViaPath<boolean>(
    externalData,
    'getSignatories.data.success',
  )
  if (!fetchSucceeded) {
    return false
  }
  const signatories =
    getValueViaPath<InheritanceSignatory[]>(
      externalData,
      'getSignatories.data.signatories',
    ) ?? []
  return signatories.every((s) => s.signed)
}

export const signingForm: Form = buildForm({
  id: 'signingForm',
  title: '',
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
            buildCustomField({
              id: 'signatoryStatusField',
              title: m.signingTableTitle,
              component: 'SignatoryStatus',
              doesNotRequireAnswer: true,
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
            // Read-only signature-status view: the finish button only appears
            // once all parties have signed at syslumenn, finalizing the
            // application on the applicant's next visit.
            buildSubmitField({
              id: 'signingActions.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              condition: (_answers, externalData) =>
                allSignatoriesSigned(externalData),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.signingComplete.defaultMessage,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
