import {
  buildForm,
  buildMultiField,
  buildSection,
} from '../../../lib/formBuilders'
import {
  buildDividerField,
  buildRadioField,
  buildReviewField,
  buildSelectField,
  buildTextField,
} from '../../../lib/fieldBuilders'
import { Form } from '../../../types/Form'
import { ApplicationTypes } from '../../../types/ApplicationTypes'

const yesOption = { value: 'yes', label: 'Já' }
const noOption = { value: 'no', label: 'Nei' }

//TODO change this
export const ReviewApplication: Form = buildForm({
  id: ApplicationTypes.DRIVING_LESSONS,
  ownerId: 'TODO?',
  name: 'Úrvinnsla umsóknar um ökunám',
  formMode: 'review',
  children: [
    buildSection({
      id: 'student',
      name: 'Nemandi',
      children: [
        buildMultiField({
          id: 'overview',
          name: 'Umsókn um ökunám innihélt eftirfarandi upplýsingar:',
          children: [
            buildDividerField({ name: 'Umsækjandi' }),
            buildTextField({
              id: 'student.name',
              name: 'Nafn nemandi',
              disabled: true,
            }),
            buildTextField({
              id: 'student.parentEmail',
              name: 'Netfang forráðamans',
              disabled: true,
            }),
            buildTextField({
              id: 'student.nationalId',
              name: 'Kennitala nemanda',
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'student.phoneNumber',
              name: 'Símanúmer',
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'student.address',
              name: 'Heimilisfang',
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'student.zipCode',
              name: 'Póstnúmer og staður',
              disabled: true,
              width: 'half',
            }),
            buildDividerField({ name: 'Ökunámið sjálft' }),
            buildTextField({
              id: 'type',
              name: 'Tegund ökunáms',
              disabled: true,
            }),
            buildSelectField({
              id: 'teacher',
              name: 'Ökukennari',
              placeholder: 'Veldu ökukennara',
              options: [
                {
                  label: 'Ingólfur Jónsson (101)',
                  value: '1',
                },
                {
                  label: 'Hallveig Traustadóttir (105)',
                  value: '2',
                },
                {
                  label: 'Björn Egilsson (107)',
                  value: '3',
                },
                {
                  label: 'Auður Egilsdóttir (170)',
                  value: '4',
                },
              ],
              disabled: true,
              width: 'half',
            }),
            buildSelectField({
              id: 'school',
              name: 'Ökuskóli',
              placeholder: 'Veldu ökuskóla',
              options: [
                {
                  label: 'Harvard',
                  value: '1',
                },
                {
                  label: 'Oxford',
                  value: '2',
                },
              ],
              disabled: true,
              width: 'half',
            }),
            buildDividerField({ name: 'Heilbrigðisupplýsingar' }),
            buildRadioField({
              id: 'useGlasses',
              name: 'Notar þú gleraugu eða snertilinsur?',
              options: [yesOption, noOption],
              disabled: true,
              width: 'half',
            }),
            buildRadioField({
              id: 'damagedEyeSight',
              name: 'Hefur þú skerta sjón á öðru auga eða báðum?',
              options: [yesOption, noOption],
              disabled: true,
              width: 'half',
            }),
            buildRadioField({
              id: 'limitedFieldOfView',
              name: 'Hefur þú skert sjónsvið til annarrar hliðar eða beggja?',
              options: [yesOption, noOption],
              disabled: true,
              width: 'half',
            }),
            buildReviewField({
              id: 'approveApplication',
              name: 'Samþykkirðu þessa umsókn?',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
