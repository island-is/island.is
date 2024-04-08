import { FormSystemForm } from "@island.is/api/schema"
import { useFormSystemUpdateFormMutation } from "../../gql/Form.generated"
import { ControlState } from "../../hooks/controlReducer"


export const partialFormUpdate = (
  control: ControlState,
  updateForm = useFormSystemUpdateFormMutation()[0],
  updatedForm?: FormSystemForm
) => {
  const form = updatedForm ? updatedForm : control.form
  console.log('updating form: ', form)
  updateForm({
    variables: {
      input: {
        formId: form.id,
        form: {
          invalidationDate: form.invalidationDate,
          name: form.name?.__typename ? { ...form.name, __typename: undefined } : form.name,
          stopProgressOnValidatingStep: form.stopProgressOnValidatingStep ?? false, // doesnt save....whyyyy
          applicationsDaysToRemove: form.applicationsDaysToRemove,
          documentTypes: form.documentTypes?.map(d => ({
            __typename: undefined,
            id: d?.id,
            type: d?.type,
            name: d?.name?.__typename ? { ...d?.name, __typename: undefined } : d?.name,
            description: d?.description?.__typename ? { ...d?.description, __typename: undefined } : d?.description,
          })),
        }
      }
    }
  })
}
