import {
  buildForm,
  buildMultiField,
  buildSection,
} from '../lib/schema-builders'
import { buildIntroductionField, buildTextField } from '../lib/field-builders'
import { Form, MultiField, Section } from '../types/form'

const AboutYouMultiField: MultiField = buildMultiField({
  id: 'about',
  name: 'Um þig',
  children: [
    buildTextField({ id: 'name', name: 'Nafn', required: true }),
    buildTextField({
      id: 'nationalId',
      name: 'Kennitala',
      required: true,
    }),
    buildTextField({
      id: 'phoneNumber',
      name: 'Símanúmer',
      required: false,
    }),
    buildTextField({ id: 'email', name: 'Netfang', required: false }),
  ],
})

const IntroSection: Section = buildSection({
  id: 'intro',
  name: 'Upplýsingar',
  children: [
    buildIntroductionField({
      id: 'field',
      name: 'Velkomin(n)',
      introduction: 'Þessi umsókn snýr að fæðingarorlofi',
    }),
    AboutYouMultiField,
  ],
})

export const ExampleSchema2: Form = buildForm({
  id: 'example2',
  ownerId: 'FOS',
  name: 'Fæðingarorlofssjóður',
  children: [IntroSection],
})
