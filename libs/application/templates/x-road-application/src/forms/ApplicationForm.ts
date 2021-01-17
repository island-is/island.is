import {
  ApplicationTypes,
  buildCustomField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildCheckboxField,
  buildRepeater,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/core'
import { m } from './messages'

export const ApplicationForm: Form = buildForm({
  id: ApplicationTypes.X_ROAD,
  name: 'Sækja um aðild að straumnum',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'general',
      name: m.generalInfo,
      children: [
        buildSubSection({
          id: 'general.institution',
          name: m.institutionInfo,
          children: [
            buildMultiField({
              id: 'general.institution.fields',
              name: m.institutionInfo,
              description: m.institutionDescription,
              children: [
                buildTextField({
                  id: 'institution.institutionName',
                  name: m.institutionName,
                  width: 'full',
                }),
                buildTextField({
                  id: 'institution.institutionSSN',
                  name: m.institutionSSN,
                  width: 'full',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'general.applicant',
          name: m.applicantInfo,
          children: [
            buildMultiField({
              id: 'general.applicant.fields',
              name: m.applicantInfo,
              description: m.applicantDescription,
              children: [
                buildTextField({
                  id: 'applicant.contact',
                  name: m.applicantName,
                  width: 'full',
                }),
                buildTextField({
                  id: 'applicant.ssn',
                  name: m.applicantSsn,
                  width: 'full',
                  format: '######-####',
                  placeholder: '000000-0000',
                }),
                buildTextField({
                  id: 'applicant.email',
                  name: m.applicantEmail,
                  width: 'full',
                  variant: 'email',
                }),
                buildTextField({
                  id: 'applicant.phone',
                  name: m.applicantPhone,
                  width: 'full',
                  variant: 'tel',
                }),
                buildCheckboxField({
                  id: 'applicant.isValidApplicant',
                  name: '',
                  width: 'full',
                  options: [
                    {
                      value: 'isValidApplicant',
                      label: m.isValidApplicant,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      name: m.information,
      children: [
        buildTextField({
          id: 'information.ipAddress',
          name: m.ipAddress,
          width: 'full',
        }),
        buildTextField({
          id: 'information.domainName',
          name: m.domainName,
          width: 'full',
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: m.confirmation,
      children: [
        buildMultiField({
          id: 'confirmation.fields',
          name: m.confirmationInfo,
          description: (application) => ({
            ...m.acceptTermsIntro,
          }),
          children: [
            buildCheckboxField({
              id: 'confirmation.isTermsAccepted',
              name: '',
              width: 'full',
              options: [
                {
                  value: 'isTermsAccepted',
                  label: m.acceptTerms,
                },
              ],
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: m.submit,
              actions: [{ event: 'SUBMIT', name: m.submit, type: 'primary' }],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'final',
      name: m.final,
      children: [
        buildIntroductionField({
          id: 'final.intro',
          name: 'Takk fyrir',
          introduction: 'Umsókn þín hefur verið send',
        }),
      ],
    }),
  ],
})
