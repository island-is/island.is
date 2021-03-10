import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
  buildCustomField,
  buildExternalDataProvider,
  buildDataProviderItem,
  Application,
} from '@island.is/application/core'
import { User } from '@island.is/api/domains/national-registry'
import { UserCompany } from '../dataProviders/CurrentUserCompanies'
import { m } from '../lib/messages'

export const LetterApplicationForm: Form = buildForm({
  id: 'LetterApplicationDraft',
  title: 'Listabókstafur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'termsAndConditions',
      title: 'Skilmálar',
      children: [
        buildExternalDataProvider({
          id: 'approveTermsAndConditions',
          title: 'Samþykkja skilmála',
          subTitle: 'Eftirfarandi reglur og skilmálar gilda um meðmælendalista',
          dataProviders: [
            buildDataProviderItem({
              id: 'dmr',
              type: undefined,
              title: 'Dómsmálaráðuneyti',
              subTitle: 'Skilmálar og reglugerðir',
            }),
            buildDataProviderItem({
              id: 'family',
              type: undefined,
              title: 'Yfirkjörstjórn',
              subTitle:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: 'Persónupplýsingar úr þjóðskrá',
              subTitle: 'Frekar skýring hér',
            }),
            buildDataProviderItem({
              id: 'userCompanies',
              type: 'CurrentUserCompaniesProvider',
              title: 'Ísland.is',
              subTitle:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'recommendations',
      title: 'Safna meðmælum',
      children: [
        buildCustomField({
          id: 'gatherRecommendations',
          title: 'Safna meðmælum',
          component: 'Recommendations',
        }),
      ],
    }),
    buildSection({
      id: 'companySelection',
      title: m.companySelection.defaultMessage,
      children: [
        buildRadioField({
          id: 'selectKennitala',
          title: m.companySelection.defaultMessage,
          largeButtons: true,
          width: 'half',
          options: (application: Application) => {
            const companies = application.externalData.userCompanies
              .data as UserCompany[]
            const nationalRegistry = application.externalData.nationalRegistry
              .data as User

            return [
              {
                label: nationalRegistry.fullName,
                subLabel: nationalRegistry.nationalId,
                value: nationalRegistry.nationalId,
              },
              ...companies.map((company) => ({
                label: company.Nafn,
                subLabel: company.Kennitala,
                value: company.Kennitala,
              })),
            ]
          },
        }),
      ],
    }),
    buildSection({
      id: 'partyLetter',
      title: m.partyLetterSelection,
      children: [
        buildCustomField({
          id: 'partyLetter',
          title: m.partyLetterSelection,
          component: 'PartyLetter',
        }),
      ],
    }),
    buildSection({
      id: 'partyName',
      title: 'Nafn flokks',
      children: [
        buildMultiField({
          id: 'partyName',
          title: m.partyName,
          children: [
            buildTextField({
              id: 'partyNameInput',
              title: 'Nafn',
              width: 'half',
              placeholder: m.partyName,
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'partyName',
      title: 'Yfirlit',
      children: [
        buildMultiField({
          title: '',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Hefja söfnun',
              actions: [
                { event: 'SUBMIT', name: 'Hefja söfnun', type: 'primary' },
              ],
            }),
            buildTextField({
              id: 'partyName',
              title: m.partyName,
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
