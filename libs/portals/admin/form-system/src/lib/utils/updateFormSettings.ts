import { FormSystemForm } from '@island.is/api/schema'
import { useFormSystemUpdateFormSettingsMutation } from '../../gql/FormSettings.generated'
import { ControlState } from '../../hooks/controlReducer'
import { removeTypename } from './removeTypename'

export const updateSettings = (
  control: ControlState,
  updatedForm?: FormSystemForm,
  updateFormSettings = useFormSystemUpdateFormSettingsMutation()[0],
) => {
  const form = updatedForm ? updatedForm : control.form
  const documentTypesInput = form?.documentTypes?.map((dt) => ({
    formId: form.id,
    documentTypeId: dt?.id,
  }))
  console.log('form', form)
  updateFormSettings({
    variables: {
      input: {
        id: form.id!,
        formSettingsUpdateDto: {
          id: form.id,
          name: form.name,
          lastChanged: form.lastChanged,
          invalidationDate: form.invalidationDate,
          dependencies: form.dependencies,
          formDocumentTypes: documentTypesInput,
          formApplicantTypes: removeTypename(form.formApplicantTypes),
          completedMessage: form.completedMessage,
          isTranslated: form.isTranslated,
          stopProgressOnValidatingStep: form.stopProgressOnValidatingStep,
          applicationsDaysToRemove: form.applicationsDaysToRemove,
        },
      },
    },
  })
}
