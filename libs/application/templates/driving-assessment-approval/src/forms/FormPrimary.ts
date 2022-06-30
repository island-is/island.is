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
  buildDividerField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const FormPrimary: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: m.prereqTitle,
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
      title: m.studentInformation,
      children: [
        buildMultiField({
          id: 'info',
          title: m.infoTitle,
          description: m.infoDescription,
          children: [
            buildTextField({
              id: 'student.nationalId',
              title: m.studentNationalId,
              width: 'half',
              backgroundColor: 'blue',
            }),
            buildTextField({
              id: 'student.email',
              title: m.studentEmail,
              width: 'half',
              backgroundColor: 'blue',
              variant: 'email',
            }),
            buildDividerField({
              title: 'nemandi',
              color: 'transparent',
            }),
            buildCustomField({
              id: 'studentLookup',
              title: m.studentLookup,
              component: 'StudentLookupField',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approval',
      title: m.approvalAssessment,
      children: [
        buildMultiField({
          id: 'drivingAssessmentConfirmation',
          title: m.drivingAssessmentConfirmation,
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.submitConfirmation,
              refetchApplicationAfterSubmit: true,
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
            }),
            buildCustomField({
              id: 'studentLookupToShow',
              title: m.studentLookupToShow,
              component: 'StudentLookupField',
              width: 'half',
            }),
            buildKeyValueField({
              label: m.studentNationalId,
              width: 'half',
              value: ({ answers }) =>
                formatKennitala(
                  get(answers, 'student.nationalId', '') as string,
                ),
            }),
            buildKeyValueField({
              label: m.studentEmail,
              width: 'half',
              value: ({ answers }) =>
                get(answers, 'student.email', '') as string,
            }),
            buildDividerField({
              // if you don't include a title, there's a line that shows up
              title: '-',
              color: 'transparent',
            }),
            buildCheckboxField({
              title: '',
              id: 'drivingAssessmentConfirmationCheck',
              large: true,
              backgroundColor: 'blue',
              options: [
                {
                  label: m.drivingAssessmentConfirmationCheck,
                  value: 'confirmed',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
