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
    buildTextField({ id: 'name', name: 'Nafn', isRequired: true }),
    buildTextField({
      id: 'nationalId',
      name: 'Kennitala',
      isRequired: true,
    }),
    buildTextField({
      id: 'phoneNumber',
      name: 'Símanúmer',
      isRequired: false,
    }),
    buildTextField({ id: 'email', name: 'Netfang', isRequired: false }),
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
          isRequired: true,
          options: [
            { value: 'yes', label: 'Já' },
            { value: 'no', label: 'Nei' },
          ],
        }),
        buildCheckboxField({
          id: 'those',
          name: 'Hefurðu unnið fyrir eftirfarandi aðila?',
          isRequired: false,
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
          isRequired: false,
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
