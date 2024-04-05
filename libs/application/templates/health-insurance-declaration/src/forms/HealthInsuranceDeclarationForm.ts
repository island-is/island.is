import {
  buildAlertMessageField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'
import Logo from '../assets/Logo'

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
      children: [],
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
