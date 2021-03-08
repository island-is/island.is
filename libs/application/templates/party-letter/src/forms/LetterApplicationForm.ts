import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  buildDataProviderItem,
  buildExternalDataProvider,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../lib/messages'

const partyLetters = ['A', 'B', 'C', 'X', 'H', 'I', 'O', 'P', 'Q', 'T', 'R']
export const LetterApplicationForm: Form = buildForm({
  id: 'LetterApplicationDraft',
  title: 'Listabókstafur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'companySelection',
      title: m.companySelection.defaultMessage,
      children: [
        buildRadioField({
          id: 'selectKennitala',
          title: m.companySelection.defaultMessage,
          largeButtons: true,
          width: 'half',
          options: [
            {
              label: 'Demókrataflokkurinn',
              subLabel: '000000-0000',
              value: '000000-0000',
            },
            {
              label: 'Verzlunin Kaffi',
              subLabel: '101010-0000',
              value: '101010-0000',
            },
            {
              label: 'Jón Jónsson',
              subLabel: '111111-0000',
              value: '111111-0000',
            },
          ],
        }),
      ],
    }),
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
              type: 'DmrProvider',
              title: 'Dómsmálaráðuneyti',
              subTitle: 'Skilmálar og reglugerðir',
            }),
            buildDataProviderItem({
              id: 'family',
              type: 'FamilyInformationProvider',
              title: 'Yfirkjörstjórn',
              subTitle:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            }),
            buildDataProviderItem({
              id: 'pregnancyStatus',
              type: 'PregnancyStatus',
              title: 'Ísland.is',
              subTitle:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'partyLetter',
      title: 'Velja listabókstaf',
      children: [
        buildRadioField({
          id: 'partyLetter',
          title: m.partyLetterSelection,
          width: 'half',
          options: partyLetters.map((letter) => ({
            value: letter,
            label: letter,
          })),
        }),
      ],
    }),
    buildSection({
      id: 'partyName',
      title: 'Nafn flokks',
      children: [
        buildTextField({
          id: 'partyName',
          title: m.partyName,
          format: 'text',
        }),
      ],
    }),

    buildSection({
      id: 'partyName',
      title: 'Safna meðmælum',
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
