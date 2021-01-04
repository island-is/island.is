import {
  buildDividerField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'

const yesOption = { value: 'yes', label: 'Já' }
const noOption = { value: 'no', label: 'Nei' }

export const ReviewApplication: Form = buildForm({
  id: 'ReviewDrivingLessonsApplication',
  title: 'Úrvinnsla umsóknar um ökunám',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'student',
      title: 'Nemandi',
      children: [
        buildMultiField({
          id: 'overview',
          title: 'Umsókn um ökunám:',
          children: [
            buildDividerField({ title: 'Umsækjandi' }),
            buildTextField({
              id: 'student.name',
              title: 'Nafn nemandi',
              disabled: true,
            }),
            buildTextField({
              id: 'student.parentEmail',
              title: 'Netfang forráðamans',
              disabled: true,
            }),
            buildTextField({
              id: 'student.nationalId',
              title: 'Kennitala nemanda',
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'student.phoneNumber',
              title: 'Símanúmer',
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'student.address',
              title: 'Heimilisfang',
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'student.zipCode',
              title: 'Póstnúmer og staður',
              disabled: true,
              width: 'half',
            }),
            buildDividerField({ title: 'Ökunámið sjálft' }),
            buildSelectField({
              id: 'type',
              title: 'Tegund ökunáms',
              disabled: true,
              options: [
                {
                  value: 'B',
                  label: 'Fólksbifreið (B)',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'AM',
                  label: 'Léttbifhjól (AM)',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'A',
                  label: 'Bifhjól (A)',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'A1',
                  label: 'Bifhjól (A1)',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'A2',
                  label: 'Bifhjól (A2)',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
                {
                  value: 'T',
                  label: 'Dráttarvél (T)',
                  tooltip:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
              ],
            }),
            buildSelectField({
              id: 'teacher',
              title: 'Ökukennari',
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
              title: 'Ökuskóli',
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
            buildDividerField({ title: 'Heilbrigðisupplýsingar' }),
            buildRadioField({
              id: 'useGlasses',
              title: 'Notar þú gleraugu eða snertilinsur?',
              options: [yesOption, noOption],
              disabled: true,
              width: 'half',
            }),
            buildRadioField({
              id: 'damagedEyeSight',
              title: 'Hefur þú skerta sjón á öðru auga eða báðum?',
              options: [yesOption, noOption],
              disabled: true,
              width: 'half',
            }),
            buildRadioField({
              id: 'limitedFieldOfView',
              title: 'Hefur þú skert sjónsvið til annarrar hliðar eða beggja?',
              options: [yesOption, noOption],
              disabled: true,
              width: 'half',
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              placement: 'screen',
              title: 'Samþykkirðu þessa umsókn?',
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk fyrir',
          description:
            'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
        }),
      ],
    }),
  ],
})
