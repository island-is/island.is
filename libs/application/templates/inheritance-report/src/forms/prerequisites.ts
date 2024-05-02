import {
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { INHERITANCE, PREPAID_INHERITANCE } from '../lib/constants'
import { m } from '../lib/messages'

export const getForm = (): Form =>
  buildForm({
    id: 'PrerequisitesDraft',
    title: '',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'selectApplicationFor',
        title: '',
        children: [
          buildMultiField({
            title: '',
            children: [
              buildRadioField({
                id: 'applicationFor',
                title: m.preDataCollectionApplicationFor,
                largeButtons: true,
                backgroundColor: 'white',
                options: [
                  {
                    value: INHERITANCE,
                    label: m.preDataCollectionApplicationForDefault,
                  },
                  {
                    value: PREPAID_INHERITANCE,
                    label: m.preDataCollectionApplicationForPrepaid,
                  },
                ],
              }),
              buildSubmitField({
                id: 'inheritance.submit',
                title: '',
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
