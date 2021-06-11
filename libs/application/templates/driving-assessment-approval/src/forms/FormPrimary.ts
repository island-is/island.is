import get from 'lodash/get'
import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildCheckboxField,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildKeyValueField,
  buildTextField,
  buildDataProviderItem,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { ApiActions } from '../shared'
import { format as formatKennitala } from 'kennitala'

export const FormPrimary: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: 'Akstursmat',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: m.conditionsSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.externalDataTitle,
          subTitle: m.externalDataSubtitle,
          checkboxLabel: m.externalDataAgreement,
          dataProviders: [
            buildDataProviderItem({
              id: 'teachingRights',
              type: 'TeachingRightsProvider',
              title: m.externalDataTeachingRightsTitle,
              subTitle: m.externalDataTeachingRightsSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'student',
      title: 'Upplýsingar um nemanda',
      children: [
        buildMultiField({
          id: 'info',
          title: 'Upplýsingar um nemanda',
          description: 'Sláðu inn kennitölu og netfang nemanda',
          children: [
            buildTextField({
              id: 'student.nationalId',
              title: 'Kennitala nemanda',
              width: 'half',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'student.email',
              title: 'Tölvupóstfang nemanda',
              width: 'half',
              backgroundColor: 'blue',
              variant: 'email',
            }),
            buildCustomField({
              id: 'studentLookup',
              title: 'Uppfletting nemanda',
              component: 'StudentLookupField',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approval',
      title: 'Akstursmat',
      children: [
        buildMultiField({
          id: 'drivingAssessmentConfirmation',
          title: 'Staðfesting akstursmats',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Staðfesting',
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
            }),
            buildCustomField({
              id: 'studentLookupToShow',
              title: 'Uppfletting nemanda',
              component: 'StudentLookupField',
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Kennitala nemanda',
              width: 'half',
              value: ({ answers }) =>
                formatKennitala(
                  get(answers, 'student.nationalId', '') as string,
                ),
            }),
            buildKeyValueField({
              label: 'Tölvupóstfang nemanda',
              width: 'half',
              value: ({ answers }) =>
                get(answers, 'student.email', '') as string,
            }),
            buildCheckboxField({
              title: '',
              id: 'drivingAssessmentConfirmationCheck',
              options: [
                {
                  label: 'Ég staðfesti að nemandi hafi staðist akstursmat',
                  value: 'confirmed',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Akstursmat móttekið',
          description: (application) => {
            const sendApplicationActionResult =
              application.externalData[ApiActions.submitAssessmentConfirmation]

            const success = get(sendApplicationActionResult, 'success', false)

            return success ? m.outroMessage : m.error
          },
        }),
      ],
    }),
  ],
})
