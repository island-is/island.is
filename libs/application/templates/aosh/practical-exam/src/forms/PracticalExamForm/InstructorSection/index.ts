import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import { instructor, shared } from '../../../lib/messages'
import { submitInstructor } from '../../../utils/submitInstructor'
import { TrueOrFalse } from '../../../utils/enums'
import { InstructorType } from '../../../lib/dataSchema'
import { FormValue } from '@island.is/application/types'

export const instructorSection = buildSection({
  id: 'instructorSection',
  title: instructor.general.sectionTitle,
  children: [
    buildMultiField({
      title: instructor.general.pageTitle,
      id: 'instructorsMultiField',
      description: instructor.general.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'instructors',
          addItemButtonText: instructor.tableRepeater.addInstructorButton,
          fields: {
            nationalId: {
              component: 'nationalIdWithName',
              label: shared.labels.ssn,
              required: true,
            },
            email: {
              component: 'input',
              label: shared.labels.email,
              width: 'half',
              type: 'email',
              required: true,
            },
            phone: {
              component: 'input',
              label: shared.labels.phone,
              type: 'tel',
              format: '###-####',
              placeholder: '000-0000',
              width: 'half',
              required: true,
            },
          },
          table: {
            format: {
              phone: (value) => `${value.slice(0, 3)}-${value.slice(3)}`,
            },
          },
          onSubmitLoad: async ({ apolloClient, application, tableItems }) => {
            const validationPaths = await submitInstructor(
              apolloClient,
              application,
              tableItems,
            )

            return { dictionaryOfItems: validationPaths }
          },
        }),
        buildAlertMessageField({
          id: 'instructorsValidityError',
          alertType: 'warning',
          condition: (formValue: FormValue, _) => {
            const instructors = getValueViaPath<InstructorType>(
              formValue,
              'instructors',
            )
            const hasDisabled = instructors?.some(
              (instructor) => instructor.disabled === TrueOrFalse.true,
            )

            return hasDisabled || false
          },
          title: instructor.tableRepeater.instructorValidityErrorTitle,
          message: instructor.tableRepeater.instructorValidityError,
        }),
        buildAlertMessageField({
          id: 'instructorsGraphQLError',
          alertType: 'error',
          condition: (formValue: FormValue, _) => {
            const hasError = getValueViaPath<string>(
              formValue,
              'instructorsGraphQLError',
              'false',
            )

            return hasError === 'true'
          },
          title: instructor.tableRepeater.instructorsGraphQLErrorTitle,
          message: instructor.tableRepeater.instructorsGraphQLError,
        }),
        buildCustomField({
          id: 'instructor.validation',
          doesNotRequireAnswer: true,
          component: 'InstructorValidation',
        }),
      ],
    }),
  ],
})
