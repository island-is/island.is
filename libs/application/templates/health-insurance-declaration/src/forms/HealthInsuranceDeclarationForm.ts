import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDateField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'
import Logo from '../assets/Logo'
import { getChildrenAsOptions } from '../utils'

export const HealthInsuranceDeclarationForm: Form = buildForm({
  id: 'HealthInsuranceDeclarationDraft',
  title: m.application.general.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'studentOrTravellerSection',
      title: m.application.studentOrTraveller.sectionTitle,
      children: [
        buildMultiField({
          id: 'studentOrTravellerMultiField',
          title: m.application.studentOrTraveller.sectionDescription,
          children: [
            buildRadioField({
              id: 'studentOrTravellerRadioFieldTraveller',
              title: '',
              required: true,
              options: [
                {
                  label:
                    m.application.studentOrTraveller.travellerRadioFieldText,
                  value: 'traveller',
                },
                {
                  label: m.application.studentOrTraveller.studentRadioFieldText,
                  value: 'student',
                },
              ],
            }),
            buildAlertMessageField({
              id: 'studentOrTravellerAlertMessage',
              alertType: 'warning',
              title: 'Athugið',
              message:
                m.application.studentOrTraveller
                  .studentOrTravellerAlertMessageText,
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'registerPersonsSection',
      title: m.application.registerPersons.sectionTitle,
      children: [
        buildMultiField({
          id: 'registerPersonsMultiFiled',
          title: m.application.registerPersons.sectionDescription,
          children: [
            buildCheckboxField({
              id: 'registerPersonsSpouseCheckboxField',
              title: m.application.registerPersons.spousetitle,
              options: [
                {
                  value: '1201345850',
                  label: 'Lísa Jónsdóttir',
                  subLabel: 'Kennitala 120134-5850',
                },
              ],
            }),
            buildCheckboxField({
              id: 'registerPersonsChildrenCheckboxField',
              title: m.application.registerPersons.childrenTitle,
              options: ({ externalData }) => getChildrenAsOptions(externalData),
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'residencySection',
      title: m.application.residency.sectionTitle,
      children: [
        buildMultiField({
          id: 'residencyMultiField',
          title: m.application.residency.sectionDescription,
          children: [
            buildRadioField({
              id: 'residencyTravellerRadioField',
              title: '',
              options: [
                { label: 'Evrópa', value: 'Evrópa' },
                { label: 'Norður Ameríka', value: 'Norður Ameríka' },
                { label: 'Suður Ameríka', value: 'Suður Ameríka' },
                { label: 'Asía', value: 'Asía' },
                { label: 'Afríka', value: 'Afríka' },
                { label: 'Ástralía', value: 'Ástralía' },
                { label: 'Sðurskautslandið', value: 'Sðurskautslandið' },
              ],
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'dateSection',
      title: m.application.date.sectionTitle,
      children: [
        buildMultiField({
          id: 'dateMultifield',
          title: m.application.date.sectionDescription,
          children: [
            buildDateField({
              id: 'datefieldFrom',
              title: m.application.date.dateFromTitle,
              placeholder: m.application.date.datePlaceholderText,
              width: 'half',
            }),
            buildDateField({
              id: 'datefieldTo',
              title: m.application.date.dateToTitle,
              placeholder: m.application.date.datePlaceholderText,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
  ],
})
