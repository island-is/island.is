import {
  buildForm,
  buildDescriptionField,
  buildSection,
  Form,
  FormModes,
  buildRadioField,
  buildTextField,
  buildMultiField,
  buildRepeater,
  buildCustomField,
} from '@island.is/application/core'
import { WalledRadio } from '../fields'
import { NO, YES } from '../shared'
import { m } from './messages'

export const ComplaintForm: Form = buildForm({
  id: 'DataProtectionComplaintForm',
  title: 'Atvinnuleysisbætur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'first',
      title: 'Fyrsta skref',
      children: [
        buildRadioField({
          id: 'theQuestion',
          title: 'Fara í milliskref?',
          options: [
            {
              label: 'Já',
              value: YES,
            },
            {
              label: 'Nei',
              value: NO,
            },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'mediateStep',
      title: 'Milliskref',
      condition: (formValue) => formValue.theQuestion === YES,
      children: [
        buildDescriptionField({
          id: 'field',
          title: 'Velkominn í milliskrefið',
          description: (application) => ({
            id: 'asdf',
            defaultMessage: 'Til hamingju með þennan áfanga',
          }),
        }),
      ],
    }),
    buildSection({
      id: 'second',
      title: 'Annað skref',
      children: [
        buildCustomField({
          component: 'WalledRadio',
          id: 'second.walledRadioQuestion',
          title: 'Walled radio title',
        }),
      ],
    }),
    buildSection({
      id: 'repeaterStep',
      title: 'Repeater skref',
      children: [
        buildRepeater({
          id: 'data',
          title: 'Hvaða gögn þurfa að fylgja umsókninni?',
          component: 'CustomRepeater',
          children: [
            buildMultiField({
              id: 'data.fields',
              title: 'Gögn',
              children: [
                buildTextField({
                  id: 'name',
                  title: 'Nafn',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'last',
      title: 'Búinn skref',
      children: [
        buildDescriptionField({
          id: 'field',
          title: "I guess the journey's never really over",
          description: (application) => ({
            ...m.introIntroduction,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            values: { name: application.answers.name },
          }),
        }),
      ],
    }),
  ],
})
