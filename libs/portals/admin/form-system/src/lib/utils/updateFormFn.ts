/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OperationVariables,
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
} from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { ControlState } from '../../hooks/controlReducer'
import { UpdateFormResponse } from '@island.is/form-system/shared'

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
): Promise<UpdateFormResponse> => {
  const newForm = updatedForm ? updatedForm : control.form
  try {
    const response = await updateForm({
      variables: {
        input: {
          id: control.form.id,
          updateFormDto: {
            organizationId: newForm.organizationId,
            name: newForm.name,
            organizationDisplayName: {
              is: newForm.organizationDisplayName?.is ?? '',
              en: newForm.organizationDisplayName?.en ?? '',
            },
            slug: newForm.slug,
            invalidationDate:
              newForm.invalidationDate === null
                ? undefined
                : newForm.invalidationDate,
            isTranslated: newForm.isTranslated,
            applicationDaysToRemove: newForm.applicationDaysToRemove,
            allowProceedOnValidationFail: newForm.allowProceedOnValidationFail,
            hasPayment: newForm.hasPayment,
            hasSummaryScreen: newForm.hasSummaryScreen,
            completedMessage: newForm.completedMessage,
            dependencies: newForm.dependencies ?? [],
          },
        },
      },
    })
    return response.data.formSystemUpdateForm as UpdateFormResponse
  } catch (err) {
    console.error('Error updating form:', err.message)
    throw err
  }
}
