import {
  buildCheckboxField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  buildFileUploadField,
  buildRedirectToServicePortalField,
  buildSelectField,
  buildPhoneField,
} from '@island.is/application/core'
import {
  Comparators,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import { ApiActions } from '../shared'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const ExampleForm: Form = buildForm({
  id: 'ExampleFormDraft',
  title: 'Atvinnuleysisbætur',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'conditions',
      title: m.conditionsSection,
      children: [],
    }),
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildDescriptionField({
          id: 'field',
          title: m.introField,
          description: (application) => ({
            ...m.introIntroduction,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            values: { name: application.answers.name },
          }),
        }),
        buildMultiField({
          id: 'about',
          title: m.about,
          children: [
            buildTextField({
              id: 'person.name',
              title: m.name,
            }),
            buildTextField({
              id: 'person.nationalId',
              title: m.nationalId,
              width: 'half',
            }),
            buildTextField({
              id: 'person.age',
              title: m.age,
              width: 'half',
            }),
            buildTextField({
              id: 'person.email',
              title: m.email,
              width: 'half',
            }),
            buildPhoneField({
              id: 'person.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
              condition: {
                questionId: 'person.age',
                isMultiCheck: false,
                comparator: Comparators.GTE,
                value: '18',
              },
            }),
          ],
        }),
        buildFileUploadField({
          id: 'attachments',
          title: 'Viðhengi',
          introduction: 'Hér getur þú bætt við viðhengjum við umsóknina þína.',
          uploadMultiple: true,
        }),
      ],
    }),
    buildSection({
      id: 'career',
      title: m.career,
      children: [
        buildSubSection({
          id: 'history',
          title: m.history,
          children: [
            buildSelectField({
              id: 'careerIndustry',
              title: m.careerIndustry,
              description: m.careerIndustryDescription,
              required: true,
              options: [
                { label: 'Hugbúnaður', value: 'software' },
                { label: 'Fjármál', value: 'finance' },
                { label: 'Efnahagsráðgjöf', value: 'consulting' },
                { label: 'Önnur', value: 'other' },
              ],
            }),
            buildRadioField({
              id: 'careerHistory',
              title: m.careerHistory,
              options: [
                { value: 'yes', label: m.yesOptionLabel },
                { value: 'no', label: m.noOptionLabel },
              ],
              condition: (formValue: FormValue) => {
                return (
                  (formValue as { person: { age: string } })?.person?.age >=
                  '18'
                )
              },
            }),
            buildMultiField({
              id: 'careerHistoryDetails',
              title: '',
              children: [
                buildCheckboxField({
                  id: 'careerHistoryDetails.careerHistoryCompanies',
                  title: m.careerHistoryCompanies,
                  options: [
                    { value: 'government', label: m.governmentOptionLabel },
                    { value: 'aranja', label: 'Aranja' },
                    { value: 'advania', label: 'Advania' },
                    { value: 'other', label: 'Annað' },
                  ],
                }),
                buildTextField({
                  id: 'careerHistoryDetails.careerHistoryOther',
                  title: m.careerHistoryOther,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'future',
          title: m.future,
          children: [
            buildTextField({
              id: 'dreamJob',
              title: m.dreamJob,
            }),
          ],
        }),
        buildSubSection({
          id: 'assignee',
          title: m.assigneeTitle,
          children: [
            buildTextField({
              id: 'assigneeEmail',
              title: m.assignee,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [
        buildMultiField({
          title: '',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Senda inn umsókn',
              actions: [
                { event: 'SUBMIT', name: 'Senda inn umsókn', type: 'primary' },
              ],
            }),
            buildDescriptionField({
              id: 'overview',
              title: 'Takk fyrir að sækja um',
              description:
                'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
            }),
          ],
        }),
        buildRedirectToServicePortalField({
          id: 'redirect',
          title: '',
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: (application) => {
            const sendApplicationActionResult =
              application.externalData[ApiActions.createApplication]

            let id = 'unknown'
            if (sendApplicationActionResult) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              id = sendApplicationActionResult.data.id
            }

            return {
              ...m.outroMessage,
              values: {
                id,
              },
            }
          },
        }),
      ],
    }),
  ],
})
