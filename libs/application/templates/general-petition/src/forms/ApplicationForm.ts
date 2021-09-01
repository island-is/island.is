import {
  buildTextField,
  buildForm,
  buildMultiField,
  buildSection,
  buildRadioField,
  buildDescriptionField,
  buildCustomField,
  buildSubmitField,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  Application,
  buildDateField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'
import { User } from '@island.is/api/domains/national-registry'
import { format } from 'kennitala'

export const LetterApplicationForm: Form = buildForm({
  id: 'LetterApplicationDraft',
  title: 'Undirskriftarlistar',
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'termsAndConditions',
      title: m.externalDataSection.title,
      children: [
        buildExternalDataProvider({
          id: 'approveTermsAndConditions',
          title: m.externalDataSection.title,
          subTitle: m.externalDataSection.subtitle,
          description: m.externalDataSection.dmrSubtitle,
          checkboxLabel: m.externalDataSection.agree,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicant',
      title: m.selectNationalId.title,
      children: [
        buildRadioField({
          id: 'ssn',
          title: m.selectNationalId.title,
          largeButtons: true,
          width: 'half',
          options: (application: Application) => {
            const nationalRegistry = application.externalData.nationalRegistry
              .data as User

            return [
              {
                label: nationalRegistry.fullName,
                subLabel: format(application.applicant),
                value: application.applicant,
              },
            ]
          },
        }),
      ],
    }),
    buildSection({
      id: 'email',
      title: m.email.titleSidebar,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: m.email.title,
          children: [
            buildTextField({
              id: 'email',
              title: m.email.email,
              placeholder: m.email.email,
              variant: 'email',
              backgroundColor: 'white',
              width: 'half',
              defaultValue: () => '',
            }),
            buildTextField({
              id: 'emailCopy',
              title: m.email.emailRepeated,
              placeholder: m.email.email,
              variant: 'email',
              backgroundColor: 'white',
              width: 'half',
              defaultValue: () => '',
            }),
            buildDescriptionField({
              id: 'confirmationCodeDescription',
              title: ' ',
              space: 'containerGutter',
              titleVariant: 'h5',
              description: m.email.confirmationCodeDescription,
            }),
            buildTextField({
              id: 'confirmationCode',
              title: m.email.confirmationCode,
              backgroundColor: 'white',
              width: 'half',
              defaultValue: () => '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: m.information.titleSidebar,
      children: [
        buildMultiField({
          id: 'party',
          title: m.information.title,
          children: [
            buildTextField({
              id: 'listName',
              title: m.information.listName,
              width: 'half',
              backgroundColor: 'white',
              required: true,
              defaultValue: () => '',
            }),
            buildTextField({
              id: 'slogan',
              title: m.information.slogan,
              width: 'half',
              backgroundColor: 'white',
              required: true,
              defaultValue: () => '',
            }),
            buildTextField({
              id: 'aboutList',
              title: m.information.aboutList,
              placeholder: m.information.aboutListPlaceholder,
              variant: 'textarea',
              rows: 5,
              backgroundColor: 'white',
              defaultValue: () => '',
            }),
            buildDateField({
              id: 'dateFrom',
              title: m.information.dateTitle,
              placeholder: m.information.dateFromPlaceholder,
              width: 'half',
              backgroundColor: 'white',
            }),
            buildDateField({
              id: 'dateTil',
              title: m.information.dateTitle,
              placeholder: m.information.dateToPlaceholder,
              width: 'half',
              backgroundColor: 'white',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'participants',
      title: m.participants.titleSidebar,
      children: [
        buildMultiField({
          id: 'party',
          title: m.participants.title,
          children: [
            buildDescriptionField({
              id: 'participantsInfo',
              title: 'TODO!',
              space: 'containerGutter',
              titleVariant: 'h3',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'reviewApplication',
      title: m.overview.title,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overview.title,
          description: m.overview.subtitle,
          children: [
            buildCustomField({
              id: 'applicantInfoOverview',
              title: '',
              component: 'Overview',
            }),
            /*buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.overview.title,
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.overview.submitButton,
                  type: 'primary',
                },
              ],
            }),*/
          ],
        }),
      ],
    }),
    buildSection({
      id: 'reviewApplication',
      title: '',
      children: [
        buildCustomField({
          id: 'listSubmitted',
          title: m.listSubmitted.title,
          component: 'ListSubmitted',
        }),
      ],
    }),
  ],
})
