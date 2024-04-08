import {
  buildAlertMessageField,
  buildCheckboxField,
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
          title: 'Ég er einnig að sækja um fyrir:',
          children: [
            buildCheckboxField({
              id: 'registerPersonsSpouseCheckboxField',
              title: 'Maki',
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
              title: 'Börn',
              options: ({ externalData }) => getChildrenAsOptions(externalData),
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'residencySection',
      title: m.application.residency.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'dateSection',
      title: m.application.date.sectionTitle,
      children: [],
    }),
  ],
})
