import {
  buildTextField,
  buildForm,
  buildMultiField,
  buildSection,
  buildCustomField,
  buildSubmitField,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildDateField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const PetitionApplicationForm: Form = buildForm({
  id: 'PetitionApplicationForm',
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
      id: 'information',
      title: m.information.titleSidebar,
      children: [
        buildMultiField({
          id: 'list',
          title: m.information.title,
          children: [
            buildTextField({
              id: 'listName',
              title: m.information.listName,
              backgroundColor: 'white',
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
            buildSubmitField({
              id: 'submit',
              title: '',
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Submit',
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
      title: m.listSubmitted.title,
      component: 'ListSubmitted',
    }),
  ],
})
