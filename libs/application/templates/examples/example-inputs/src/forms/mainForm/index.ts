import {
  buildForm,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { simpleInputsSection } from './simpleInputsSection'
import { compositeFieldsSection } from './compositeFieldsSection'
import { tablesAndRepeatersSection } from './tablesAndRepeatersSection'
import { customSection } from './customSection/customSection'
import { overviewSection } from './overviewSection/overviewSection'
import { introSection } from './introSection/introSection'

export const MainForm: Form = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'section1',
      title: 'Section 1',
      children: [
        buildMultiField({
          id: 'multiField',
          title: 'Multi field',
          children: [
            buildNationalIdWithNameField({
              id: 'nationalIdWithNameField',
              title: 'Nafn og kt. númer',
              showEmailField: true,
              showPhoneField: true,
            }),
            buildTableRepeaterField({
              id: 'tableRepeaterField',
              title: 'Table repeater field',
              fields: {
                nat1: {
                  component: 'nationalIdWithName',
                  showEmailField: true,
                  showPhoneField: true,
                },
                inputX: {
                  component: 'input',
                  label: 'Regular input',
                  width: 'half',
                  required: true,
                  type: 'text',
                },
                inputY: {
                  component: 'input',
                  label: 'Regular input',
                  width: 'half',
                  required: true,
                  type: 'text',
                },
                inputZ: {
                  component: 'input',
                  label: 'Regular input',
                  width: 'half',
                  required: true,
                  type: 'text',
                },
                nat2: {
                  component: 'nationalIdWithName',
                  showEmailField: true,
                  showPhoneField: true,
                },
                input: {
                  component: 'input',
                  label: 'Regular input',
                  width: 'half',
                  required: true,
                  type: 'text',
                },
                input2: {
                  component: 'input',
                  label: 'Regular input 2',
                  width: 'half',
                  required: true,
                  type: 'text',
                  condition: (_application) => {
                    return false
                  },
                },
                inputDate: {
                  component: 'date',
                  label: 'Regular input 2',
                  width: 'half',
                  condition: (_application) => {
                    return false
                  },
                },

                input3: {
                  component: 'input',
                  label: 'Regular input 3',
                  width: 'half',
                  required: true,
                  type: 'text',
                },
              },
            }),
          ],
        }),
      ],
    }),
    introSection,
    simpleInputsSection,
    compositeFieldsSection,
    tablesAndRepeatersSection,
    customSection,
    overviewSection,
  ],
})
