import {
  buildTextField,
  buildForm,
  buildMultiField,
  buildSection,
  buildCustomField,
  buildSubmitField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildDateField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const form: Form = buildForm({
  id: 'GeneralPetitionForm',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'termsAndConditions',
      title: m.externalDataSectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveTermsAndConditions',
          title: m.externalDataSectionTitle,
          subTitle: m.externalDataSectionSubtitle,
          description: m.externalDataSectionTermsAndConditions,
          checkboxLabel: m.externalDataSectionCheckbox,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: m.listInformationTitle,
      children: [
        buildMultiField({
          id: 'list',
          title: m.listInformationTitle,
          children: [
            buildTextField({
              id: 'listName',
              title: m.listName,
              backgroundColor: 'white',
              defaultValue: () => '',
            }),
            buildTextField({
              id: 'aboutList',
              title: m.aboutList,
              placeholder: m.aboutListPlaceholder,
              variant: 'textarea',
              rows: 5,
              backgroundColor: 'white',
              defaultValue: () => '',
            }),
            buildDateField({
              id: 'dates.dateFrom',
              title: m.dateTitle,
              placeholder: m.dateFromPlaceholder,
              width: 'half',
              backgroundColor: 'white',
            }),
            buildDateField({
              id: 'dates.dateTil',
              title: m.dateTitle,
              placeholder: m.dateToPlaceholder,
              width: 'half',
              backgroundColor: 'white',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'reviewApplication',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewTitle,
          description: m.overviewSubtitle,
          children: [
            buildCustomField({
              id: 'applicantInfoOverview',
              title: '',
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'submit',
              title: '',
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: '',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildCustomField({
      id: 'listSubmitted',
      title: m.listSubmittedTitle,
      component: 'ListSubmitted',
    }),
  ],
})
