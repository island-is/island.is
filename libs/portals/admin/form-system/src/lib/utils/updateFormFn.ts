/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OperationVariables,
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
} from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { ControlState } from '../../hooks/controlReducer'

export const updateFormFn = async (
  control: ControlState,
  updateForm: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined,
  ) => Promise<any>,
  updatedForm?: FormSystemForm,
) => {
  const newForm = updatedForm ? updatedForm : control.form
  try {
    const response = await updateForm({
      variables: {
        input: {
          id: control.form.id,
          updateFormDto: {
            organizationId: newForm.organizationId,
            name: newForm.name,
            slug: newForm.slug,
            invalidationDate:
              newForm.invalidationDate === null
                ? undefined
                : newForm.invalidationDate,
            isTranslated: newForm.isTranslated,
            applicationDaysToRemove: newForm.applicationDaysToRemove,
            stopProgressOnValidatingScreen:
              newForm.stopProgressOnValidatingScreen,
            completedMessage: newForm.completedMessage,
            dependencies: newForm.dependencies ?? [],
          },
        },
      },
    })
    console.log('Form updated successfully:', response.data)
  } catch (err) {
    console.error('Error updating form:', err.message)
  }
}
