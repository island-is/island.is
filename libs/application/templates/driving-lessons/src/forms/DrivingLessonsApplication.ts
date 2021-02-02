import {
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

const yesOption = { value: 'yes', label: m.yesOptionLabel }
const noOption = { value: 'no', label: m.noOptionLabel }

export const DrivingLessonsApplication: Form = buildForm({
  id: 'DrivingLessonsApplicationDraftForm',
  title: m.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'student',
      title: m.studentSection,
      children: [
        buildMultiField({
          id: 'student',
          title: m.studentTitle,
          children: [
            buildTextField({
              id: 'student.name',
              title: m.studentName,
              disabled: false,
            }),
            buildDateField({
              id: 'student.birthDate',
              title: 'Date baby',
              placeholder: 'sick',
            }),
            buildTextField({
              id: 'student.parentEmail',
              title: m.parentEmail,
              disabled: false,
            }),
            buildTextField({
              id: 'student.nationalId',
              title: m.nationalId,
              disabled: false,
              width: 'half',
            }),
            buildTextField({
              id: 'student.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
            }),
            buildTextField({
              id: 'student.address',
              title: m.address,
              width: 'half',
            }),
            buildTextField({
              id: 'student.zipCode',
              title: m.zipCode,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'type',
      title: m.typeSection,
      children: [
        buildSubSection({
          id: 'type',
          title: 'Tegund',
          children: [
            buildRadioField({
              id: 'type',
              title: m.type,
              options: [
                {
                  value: 'B',
                  label: m.typeOption1Label,
                  tooltip: m.typeOption1Tooltip,
                },
                {
                  value: 'AM',
                  label: m.typeOption2Label,
                  tooltip: m.typeOption2Tooltip,
                },
                {
                  value: 'A',
                  label: m.typeOption3Label,
                  tooltip: m.typeOption3Tooltip,
                },
                {
                  value: 'A1',
                  label: m.typeOption4Label,
                  tooltip: m.typeOption4Tooltip,
                },
                {
                  value: 'A2',
                  label: m.typeOption5Label,
                  tooltip: m.typeOption5Tooltip,
                },
                {
                  value: 'T',
                  label: m.typeOption6Label,
                  tooltip: m.typeOption6Tooltip,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'teacher',
          title: 'Kennari',
          children: [
            buildSelectField({
              id: 'teacher',
              title: m.teacher,
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
            }),
          ],
        }),
        buildSubSection({
          id: 'school',
          title: m.school,
          children: [
            buildSelectField({
              id: 'school',
              title: m.school,
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
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'health',
      title: m.healthSection,
      children: [
        buildMultiField({
          id: 'eyeSight',
          title: m.eyeSight,
          children: [
            buildRadioField({
              id: 'useGlasses',
              title: m.useGlasses,
              options: [yesOption, noOption],
            }),
            buildRadioField({
              id: 'damagedEyeSight',
              title: m.damagedEyeSight,
              options: [yesOption, noOption],
            }),
            buildRadioField({
              id: 'limitedFieldOfView',
              title: m.limitedFieldOfView,
              options: [yesOption, noOption],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveExternalData',
      title: m.fetchDataSection,
      children: [
        buildExternalDataProvider({
          title: m.fetchData,
          id: 'fetchData',
          dataProviders: [
            buildDataProviderItem({
              id: 'healthInfo',
              title: m.healthInfoTitle,
              subTitle: m.healthInfoSubtitle,
              type: 'ExampleSucceeds',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmationSection,
      children: [
        buildMultiField({
          id: 'submit',
          title: 'Takk fyrir að sækja um',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'submit',
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Smelltu hér til að senda inn umsókn',
                  type: 'primary',
                },
              ],
            }),
            buildDescriptionField({
              id: 'overview',
              title: '',
              description: m.overviewIntro,
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
