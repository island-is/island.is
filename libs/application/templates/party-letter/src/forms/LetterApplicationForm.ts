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
import Logo from '../assets/Logo'

export enum IDS {
  PartySSD = 'ssd',
  PartyLetter = 'party.letter',
  PartyName = 'party.name',
  Endorsements = 'endorsements',
  Warnings = 'warnings',
  Documents = 'documents',
}

export const LetterApplicationForm: Form = buildForm({
  id: 'LetterApplicationDraft',
  title: 'Listabókstafur',
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
      title: m.selectNationalId.title,
      children: [
        buildRadioField({
          id: IDS.PartySSD,
          title: m.selectNationalId.title,
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
              id: IDS.PartyLetter,
              title: m.selectPartyLetter.partyLetterLabel,
              placeholder: m.selectPartyLetter.partyLetterPlaceholder,
              width: 'half',
              defaultValue: (application: Application) =>
                (getValueViaPath(
                  application.answers,
                  IDS.PartyLetter,
                ) as string) ?? '',
            }),
            buildTextField({
              id: IDS.PartyName,
              title: m.selectPartyLetter.partyNameLabel,
              placeholder: m.selectPartyLetter.partyNamePlaceholder,
              width: 'half',
              defaultValue: (application: Application) =>
                (getValueViaPath(
                  application.answers,
                  IDS.PartyName,
                ) as string) ?? '',
            }),
            buildCustomField({
              id: 'partyLetter',
              title: m.selectPartyLetter.title,
              component: 'PartyLetter',
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
          id: 'confirmation',
          title: m.overview.title,
          description: m.overview.subtitle,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              title: '',
              component: 'PartyLetterApplicationReview',
            }),
            buildTextField({
              id: 'email',
              title: m.overview.email,
              placeholder: m.overview.email,
              variant: 'email',
              backgroundColor: 'blue',
              width: 'half',
              defaultValue: () => '',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.overview.title,
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Hefja söfnun',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'endorsement',
          title: m.collectEndorsements.title,
          component: 'EndorsementList',
        }),
      ],
    }),
  ],
})
