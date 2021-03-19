import {
  buildTextField,
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
  getValueViaPath,
} from '@island.is/application/core'
import { User } from '@island.is/api/domains/national-registry'
import { UserCompany } from '../dataProviders/CurrentUserCompanies'
import { m } from '../lib/messages'
import { format } from 'kennitala'

export type IDS =
  | 'ssd'
  | 'party.letter'
  | 'party.name'
  | 'signatures'
  | 'warnings'

export const PARTY_SSD: IDS = 'ssd'
export const PARTYLETTER_ID: IDS = 'party.letter'
export const PARTYNAME_ID: IDS = 'party.name'

const partyLetterIds = [PARTYLETTER_ID, PARTYNAME_ID]
export const SSDS = []

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
      id: 'company',
      title: m.selectSSD.title,
      children: [
        buildRadioField({
          id: PARTY_SSD,
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
                subLabel: format(application.applicant),
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
      id: 'party',
      title: m.selectPartyLetter.sectionTitle,
      children: [
        buildMultiField({
          id: 'party',
          title: m.selectPartyLetter.sectionTitle,
          children: [
            buildTextField({
              id: PARTYLETTER_ID,
              title: m.selectPartyLetter.partyLetterLabel,
              placeholder: m.selectPartyLetter.partyLetterPlaceholder,
              width: 'half',
              defaultValue: (application: Application) =>
                (getValueViaPath(
                  application.answers,
                  PARTYLETTER_ID,
                ) as string) ?? '',
            }),
            buildTextField({
              id: PARTYNAME_ID,
              title: m.selectPartyLetter.partyNameLabel,
              placeholder: m.selectPartyLetter.partyNamePlaceholder,
              width: 'half',
              defaultValue: (application: Application) =>
                (getValueViaPath(
                  application.answers,
                  PARTYNAME_ID,
                ) as string) ?? '',
            }),
            buildCustomField({
              id: 'partyLetter',
              childInputIds: partyLetterIds,
              title: m.selectPartyLetter.title,
              component: 'PartyLetter',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'recommendations',
      title: m.recommendations.title,
      children: [
        buildCustomField({
          id: 'gatherRecommendations',
          title: m.recommendations.title,
          component: 'Recommendations',
        }),
      ],
    }),

    buildSection({
      id: 'reviewApplication',
      title: m.overview.title,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: m.overview.title,
          description: m.overview.subtitle,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              title: '',
              component: 'Review',
            }),
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
        buildCustomField({
          id: 'thankYou',
          title: m.overview.finalTitle,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
