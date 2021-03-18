import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
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
import { partyLetterIds } from '../fields/PartyLetter'

export const LetterApplicationForm: Form = buildForm({
  id: 'LetterApplicationDraft',
  title: 'Listabókstafur',
  mode: FormModes.APPLYING,
  children: [
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
              id: 'dmr',
              type: undefined,
              title: m.externalDataSection.dmrTitle,
              subTitle: m.externalDataSection.dmrSubtitle,
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.externalDataSection.nationalRegistryTitle,
              subTitle: m.externalDataSection.nationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              id: 'userCompanies',
              type: 'CurrentUserCompaniesProvider',
              title: m.externalDataSection.islandTitle,
              subTitle: m.externalDataSection.islandSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'companySelection',
      title: m.selectSSD.title,
      children: [
        buildRadioField({
          id: 'partyNationalId',
          title: m.selectSSD.title,
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
                subLabel: application.applicant,
                value: application.applicant,
              },
              ...companies.map((company) => ({
                label: company.name,
                subLabel: company.nationalId,
                value: company.nationalId,
              })),
            ]
          },
        }),
      ],
    }),
    buildSection({
      id: 'partyLetter',
      title: m.selectPartyLetter.sectionTitle,
      children: [
        buildCustomField({
          id: 'partyLetter',
          childInputIds: partyLetterIds,
          title: m.selectPartyLetter.title,
          component: 'PartyLetter',
        }),
      ],
    }),

    buildSection({
      id: 'partyName',
      title: m.overview.title,
      children: [
        buildMultiField({
          title: m.overview.title,
          description: m.overview.subtitle,
          children: [
            buildSubmitField({
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
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: m.overview.finalTitle,
          description: m.overview.finalSubtitle,
        }),
      ],
    }),
  ],
})
