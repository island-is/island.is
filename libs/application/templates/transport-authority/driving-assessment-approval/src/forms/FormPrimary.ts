import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildCheckboxField,
  buildExternalDataProvider,
  buildKeyValueField,
  buildTextField,
  buildDataProviderItem,
  buildCustomField,
  getValueViaPath,
  buildDescriptionField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  HasTeachingRightsApi,
} from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const FormPrimary: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: m.prereqTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: TransportAuthorityLogo,
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
              provider: HasTeachingRightsApi,
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
            buildCustomField({
              id: 'student',
              title: m.studentLookup,
              component: 'StudentLookupField',
            }),
            buildTextField({
              id: 'student.email',
              title: m.studentEmail,
              width: 'half',
              backgroundColor: 'blue',
              variant: 'email',
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
            buildKeyValueField({
              label: m.studentNationalId,
              width: 'half',
              value: ({ answers }) =>
                formatKennitala(
                  getValueViaPath(answers, 'student.nationalId') as string,
                ),
            }),
            buildKeyValueField({
              label: m.studentEmail,
              width: 'half',
              value: ({ answers }) =>
                getValueViaPath(answers, 'student.email') as string,
            }),
            buildDescriptionField({
              id: 'space',
              space: 'containerGutter',
            }),
            buildCheckboxField({
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
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.submitConfirmation,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.submit.defaultMessage,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
