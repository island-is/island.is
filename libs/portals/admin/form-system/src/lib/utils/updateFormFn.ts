/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { UpdateFormResponse } from '@island.is/form-system/shared'
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
            daysUntilApplicationPrune: newForm.daysUntilApplicationPrune,
            allowProceedOnValidationFail: newForm.allowProceedOnValidationFail,
            hasPayment: newForm.hasPayment,
            zendeskInternal: newForm.zendeskInternal,
            submissionServiceUrl: newForm.submissionServiceUrl,
            hasSummaryScreen: newForm.hasSummaryScreen,
            completedSectionInfo: {
              title: {
                is: newForm.completedSectionInfo?.title?.is ?? '',
                en: newForm.completedSectionInfo?.title?.en ?? '',
              },
              confirmationHeader: {
                is: newForm.completedSectionInfo?.confirmationHeader?.is ?? '',
                en: newForm.completedSectionInfo?.confirmationHeader?.en ?? '',
              },
              confirmationText: {
                is: newForm.completedSectionInfo?.confirmationText?.is ?? '',
                en: newForm.completedSectionInfo?.confirmationText?.en ?? '',
              },
              additionalInfo:
                newForm.completedSectionInfo?.additionalInfo?.map((info) => ({
                  is: info?.is ?? '',
                  en: info?.en ?? '',
                })) ?? [],
            },
            dependencies: newForm.dependencies ?? [],
          },
        },
      },
    })
    return response.data.updateFormSystemForm as UpdateFormResponse
  } catch (err) {
    console.error('Error updating form:', err.message)
    throw err
  }
}
