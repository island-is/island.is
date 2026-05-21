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
  userName?: string,
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
            draftDaysToLive: newForm.draftDaysToLive,
            submissionDaysToLive: newForm.submissionDaysToLive,
            allowProceedOnValidationFail: newForm.allowProceedOnValidationFail,
            hasPayment: newForm.hasPayment,
            zendeskInternal: newForm.zendeskInternal,
            useValidate: newForm.useValidate,
            usePopulate: newForm.usePopulate,
            submissionServiceUrl: newForm.submissionServiceUrl,
            hasSummaryScreen: newForm.hasSummaryScreen,
            sectionInfo: {
              title: {
                is: newForm.sectionInfo?.title?.is ?? '',
                en: newForm.sectionInfo?.title?.en ?? '',
              },
              confirmationHeader: {
                is: newForm.sectionInfo?.confirmationHeader?.is ?? '',
                en: newForm.sectionInfo?.confirmationHeader?.en ?? '',
              },
              confirmationText: {
                is: newForm.sectionInfo?.confirmationText?.is ?? '',
                en: newForm.sectionInfo?.confirmationText?.en ?? '',
              },
              additionalInfo:
                newForm.sectionInfo?.additionalInfo?.map((info) => ({
                  is: info?.is ?? '',
                  en: info?.en ?? '',
                })) ?? [],
              additionalPremises:
                newForm.sectionInfo?.additionalPremises?.map((premise) => ({
                  title: {
                    is: premise?.title?.is ?? '',
                    en: premise?.title?.en ?? '',
                  },
                  description: {
                    is: premise?.description?.is ?? '',
                    en: premise?.description?.en ?? '',
                  },
                })) ?? [],
            },
            dependencies: newForm.dependencies ?? [],
            lastModifiedBy: userName,
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
