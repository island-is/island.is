import { Application, TeacherV4 } from '@island.is/api/schema'
import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildAsyncSelectField,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
  coreErrorMessages,
} from '@island.is/application/core'
import { information } from '../../lib/messages'
import kennitala from 'kennitala'
import { DefaultEvents } from '@island.is/application/types'
import { GET_DRIVING_LICENSE_TEACHERS } from '../../graphql/teachersQuery'

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
        buildAsyncSelectField({
          id: 'newInstructor.nationalId',
          title: information.labels.newInstructor.selectSubLabel,
          loadingError: coreErrorMessages.failedDataProvider,
          isSearchable: true,
          required: true,
          // Fetch the instructor list live so a newly-registered instructor
          // shows up (and de-licensed ones drop off) without the user having
          // to start a new application. The list used to be read from the
          // snapshot frozen into external data when the application was created.
          loadOptions: async ({ application, apolloClient }) => {
            const currentInstructorNationalId = getValueViaPath(
              application.externalData,
              'currentInstructor.data.nationalId',
              undefined,
            ) as string | undefined | null

            const { data } = await apolloClient.query<{
              drivingLicenseTeachersV4: TeacherV4[]
            }>({
              query: GET_DRIVING_LICENSE_TEACHERS,
              fetchPolicy: 'network-only',
            })

            return (data?.drivingLicenseTeachersV4 ?? [])
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
