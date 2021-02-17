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
} from '@island.is/application/core'
import { m } from './messages'

const partyLetters = ['A', 'B', 'C', 'X', 'H', 'I', 'O', 'P', 'Q', 'T', 'R']
export const LetterApplicationForm: Form = buildForm({
  id: 'LetterApplicationDraft',
  title: 'Framboðsstafur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'company',
      title: m.companySection,
      children: [
        buildRadioField({
          id: 'companyNationalId',
          title: m.companySelection,
          options: [
            { value: '0000000000', label: 'Sjálfstæðisflokkurinn' },
            { value: '1111111111', label: 'Bæjar bakarí' },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'partyLetter',
      title: 'Stafur',
      children: [
        buildRadioField({
          id: 'partyLetter',
          title: m.partyLetterSelection,
          options: partyLetters.map((letter) => ({
            value: letter,
            label: letter,
          })),
        }),
      ],
    }),
    buildSection({
      id: 'partyName',
      title: 'Nafn',
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
