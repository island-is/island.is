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
          title: 'Akstursmat',
          dataProviders: [
            buildDataProviderItem({
              id: 'teachingRights',
              type: 'TeachingRightsProvider',
              title: 'Staðfesting á réttindum',
              subTitle:
                'Við munum sækja skráningu þína úr ökuskírteinaskrá til að athuga hvort þú ' +
                'hafir sannarlega ökukennararéttindi',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'student',
      title: 'Nemandi',
      children: [
        buildMultiField({
          id: 'info',
          title: 'Upplýsingar umsækjanda',
          description: 'Sláðu inn kennitölu og netfang umsækjanda',
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
          ]
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
              id: 'studentLookup',
              title: 'Uppfletting nemanda',
              component: 'StudentLookupField',
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Kennitala umsækjanda',
              width: 'half',
              value: ({ answers }) => formatKennitala(get(answers, 'student.nationalId', '') as string),
            }),
            buildKeyValueField({
              label: 'Tölvupóstfang umsækjanda',
              width: 'half',
              value: ({ answers }) => get(answers, 'student.email', '') as string,
            }),
            buildCheckboxField({
              title: '',
              id: 'drivingAssessmentConfirmationCheck',
              options: [
                {
                  label: 'Ég staðfesti að umsækjandi hafi staðist akstursmat',
                  value: 'confirmed'
                },
              ],
            })
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Akstursmat móttekið',
          description: (application) => {
            const sendApplicationActionResult =
              application.externalData[ApiActions.submitAssessmentConfirmation]

            const success = get(sendApplicationActionResult, 'success', false)

            return success ? m.outroMessage : m.errorMessage
          },
        }),
      ],
    }),
  ],
})
