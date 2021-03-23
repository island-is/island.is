import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  buildCheckboxField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildExternalDataProvider,
  buildDataProviderItem,
  Form,
  FormModes,
  Application,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const ReviewApplication: Form = buildForm({
  id: 'Collect signatures',
  title: m.collectSignatures.applicationTitle,
  mode: FormModes.REVIEW,
  children: [
    /* todo: see if external data can be provided for signaturee
     buildSection({
      id: 'termsAndConditions',
      title: m.externalDataSection.title,
      children: [
        buildExternalDataProvider({
          id: 'approveTermsAndConditions',
          title: m.externalDataSection.title,
          subTitle: m.externalDataSection.subTitle,
          dataProviders: [
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: 'm.userProfileInformationTitle',
              subTitle: 'm.userProfileInformationSubTitle',
            }),
          ],
        }),
      ],
    }),*/
    buildSection({
      id: 'intro',
      title: m.collectSignatures.stepTitle,
      children: [
        buildMultiField({
          id: 'about',
          title: m.collectSignatures.sectionTitle,
          children: [
            buildCustomField({
              id: 'disclaimer',
              title: '',
              component: 'SignatureDisclaimer',
            }),
            buildTextField({
              id: 'signature',
              title: m.collectSignatures.nameInput,
              variant: 'text',
              placeholder: m.collectSignatures.nameInput,
              backgroundColor: 'blue',
              width: 'half',
              // todo: default should be name of signaturee
            }),
            buildDescriptionField({
              id: 'firstDescription',
              title: '',
              space: 5,
              description: m.collectSignatures.descriptionPt1,
            }),
            buildDescriptionField({
              id: 'secondDescription',
              title: '',
              space: 4,
              description: m.collectSignatures.descriptionPt2,
            }),
            buildCheckboxField({
              id: 'terms',
              title: '',
              options: [
                { value: 'agree', label: m.collectSignatures.agreeTermsLabel },
              ],
              large: true,
              backgroundColor: 'blue',
              defaultValue: '',
            }),

            buildSubmitField({
              id: 'sign',
              placement: 'footer',
              title: m.collectSignatures.submitButton,
              actions: [
                {
                  event: 'APPROVE',
                  name: m.collectSignatures.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Umsókn móttekin',
          description: 'Umsókn hefur verið mótekin',
        }),
      ],
    }),
  ],
})
