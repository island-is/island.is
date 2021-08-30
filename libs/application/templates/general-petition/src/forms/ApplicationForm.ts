import {
  buildTextField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  buildCustomField,
  buildExternalDataProvider,
  buildDataProviderItem,
  Application,
  getValueViaPath,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export enum IDS {
  PartySSD = 'ssd',
  PartyLetter = 'partyLetter',
  PartyName = 'partyName',
  Endorsements = 'endorsements',
  Warnings = 'warnings',
  Documents = 'documents',
}

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
          checkboxLabel: m.externalDataSection.agree,
          dataProviders: [
            buildDataProviderItem({
              id: 'dmr',
              type: undefined,
              title: '',
              subTitle: m.externalDataSection.dmrSubtitle,
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.externalDataSection.nationalRegistryTitle,
              subTitle: m.externalDataSection.nationalRegistrySubtitle,
            }),
          ],
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
              refetchApplicationAfterSubmit: true,
              title: m.overview.title,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
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
