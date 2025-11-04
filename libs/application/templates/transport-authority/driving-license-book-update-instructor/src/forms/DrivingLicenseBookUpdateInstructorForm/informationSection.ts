import { Application, TeacherV4 } from '@island.is/api/schema'
import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../lib/messages'
import kennitala from 'kennitala'
import { DefaultEvents } from '@island.is/application/types'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'instructorMultiField',
      title: information.labels.instructor.title,
      children: [
        buildDescriptionField({
          id: 'oldInstructor.subtitle',
          title: information.labels.oldInstructor.subtitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'oldInstructor.name',
          title: information.labels.oldInstructor.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.currentInstructor?.data?.name,
        }),
        buildTextField({
          id: 'oldInstructor.nationalId',
          title: information.labels.oldInstructor.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.currentInstructor?.data?.nationalId,
        }),
        buildDescriptionField({
          id: 'newInstructor.subtitle',
          title: information.labels.newInstructor.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildSelectField({
          id: 'newInstructor.nationalId',
          title: information.labels.newInstructor.selectSubLabel,
          disabled: false,
          required: true,
          options: (application) => {
            const teachers = getValueViaPath(
              application.externalData,
              'teachers.data',
              [],
            ) as TeacherV4[]

            const currentInstructorNationalId = getValueViaPath(
              application.externalData,
              'currentInstructor.data.nationalId',
              undefined,
            ) as string | undefined | null

            return teachers
              .filter(
                ({ nationalId }) => nationalId !== currentInstructorNationalId,
              )
              .map(({ name, nationalId }) => ({
                value: nationalId,
                label: `${name} (${kennitala.format(nationalId)})`,
              }))
          },
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: information.confirmation.confirm,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: information.confirmation.confirm,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
