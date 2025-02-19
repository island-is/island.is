import {
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { ESTATE_INHERITANCE, PREPAID_INHERITANCE } from '../lib/constants'
import { m } from '../lib/messages'

export const getForm = ({
  allowEstateApplication = false,
  allowPrepaidApplication = false,
}): Form =>
  buildForm({
    id: 'PrerequisitesDraft',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'selectApplicationFor',
        title: '',
        children: [
          buildMultiField({
            title: m.preDataCollectionApplicationFor,
            description: m.preDataCollectionApplicationFoDescription,
            children: [
              buildRadioField({
                id: 'applicationFor',
                largeButtons: true,
                backgroundColor: 'blue',
                required: true,
                options: [
                  {
                    value: ESTATE_INHERITANCE,
                    label: m.preDataCollectionApplicationForDefault,
                    disabled: !allowEstateApplication,
                  },
                  {
                    value: PREPAID_INHERITANCE,
                    label: m.preDataCollectionApplicationForPrepaid,
                    disabled: !allowPrepaidApplication,
                  },
                ],
              }),
              buildSubmitField({
                id: 'inheritance.submit',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: m.confirmButton,
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
