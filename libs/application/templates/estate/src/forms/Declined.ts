import {
  buildForm,
  buildKeyValueField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { EstateTypes } from '../lib/constants'

export const declined: Form = buildForm({
  id: 'declined',
  title: m.applicationDenied,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'declined',
      title: '',
      children: [
        buildKeyValueField({
          label: m.settlementValidationFailureTitle,
          value: (application) => {
            const availableSettlements = (
              application.externalData.syslumennOnEntry.data as {
                estate: { availableSettlements: Record<string, string> }
              }
            ).estate.availableSettlements
            const selectedEstate = application.answers.selectedEstate.toString()
            const selectedEstateKey = Object.keys(EstateTypes).find(
              (key) =>
                EstateTypes[key as keyof typeof EstateTypes] === selectedEstate,
            )
            return availableSettlements[
              selectedEstateKey as keyof typeof availableSettlements
            ].toString()
          },
        }),
      ],
    }),
  ],
})
