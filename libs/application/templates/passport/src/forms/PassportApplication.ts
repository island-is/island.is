import {
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const PassportApplication: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  name: m.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'personalInfo',
      name: m.personalInfoSection,
      children: [
        buildMultiField({
          id: 'personalInfo',
          name: m.personalInfoTitle,
          children: [
            buildTextField({
              id: 'student.name',
              name: m.personalInfoName,
              disabled: false,
            }),
          ],
        }),
      ],
    }),
  ],
})
