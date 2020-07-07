import {
  buildForm,
  buildSubSection,
  buildMultiField,
  buildSection,
} from '../lib/schema-builders'
import {
  buildCheckboxField,
  buildRadioField,
  buildIntroductionField,
  buildTextField,
} from '../lib/field-builders'
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
      introduction: 'Þessi umsókn snýr að atvinnuleysisbótum',
    }),
    AboutYouMultiField,
  ],
})

const CareerSection: Section = buildSection({
  id: 'career',
  name: 'Starfsferill',
  children: [
    buildSubSection({
      id: 'history',
      name: 'Hvar hefur þú unnið áður?',
      children: [
        buildRadioField({
          id: 'any',
          name: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
          required: true,
          options: [
            { value: 'yes', label: 'Já' },
            { value: 'no', label: 'Nei' },
          ],
        }),
        buildCheckboxField({
          id: 'those',
          name: 'Hefurðu unnið fyrir eftirfarandi aðila?',
          required: false,
          options: [
            { value: 'government', label: 'Ríkið' },
            { value: 'aranja', label: 'Aranja' },
            { value: 'advania', label: 'Advania' },
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'future',
      name: 'Hvar langar þig að vinna?',
      children: [
        buildTextField({
          id: 'where',
          name: 'Einhver draumavinnustaður?',
          required: false,
        }),
      ],
    }),
  ],
})

export const ExampleSchema: Form = buildForm({
  id: 'example',
  ownerId: 'DOL',
  name: 'Atvinnuleysisbætur',
  children: [IntroSection, CareerSection],
})
