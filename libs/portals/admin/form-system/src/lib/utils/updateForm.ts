import { FormSystemForm, FormSystemFormInput, FormSystemGroupInput, FormSystemInputInput, FormSystemOrganizationInput, FormSystemStepInput, InputMaybe } from "@island.is/api/schema"
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
          stopProgressOnValidatingStep: (form.stopProgressOnValidatingStep ?? false) as boolean, // doesnt save....whyyyy
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

export const entireFormUpdate = (
  control: ControlState,
  updateForm = useFormSystemUpdateFormMutation()[0],
  updatedForm?: FormSystemForm
) => {
  const form = updatedForm ? updatedForm : control.form
  const organiaztionInput: FormSystemOrganizationInput = {
    ...(form.organization as FormSystemOrganizationInput),
  }

  const inputs: InputMaybe<FormSystemInputInput>[] = form.inputsList?.filter(input => input !== undefined && input !== null).map(i => ({
    ...i,
    isHidden: i?.isHidden ?? false,
    isPartOfMultiSet: i?.isPartOfMultiSet ?? false,
    isRequired: i?.isRequired ?? false,
  })) ?? []

  const groups: InputMaybe<FormSystemGroupInput>[] = form.groupsList?.filter(group => group !== undefined && group !== null).map(g => ({
    ...g,
    inputs: null
  })) ?? []

  const steps: InputMaybe<FormSystemStepInput>[] = form.stepsList?.filter(step => step !== undefined && step !== null).map(s => ({
    ...s,
    groups: null
  })) ?? []

  const formInput: FormSystemFormInput = {
    ...form,
    organization: organiaztionInput,
    inputsList: inputs,
    groupsList: groups,
    stepsList: steps,
    steps: null
  }
  console.log('updating form: ', formInput)
  updateForm({
    variables: {
      input: {
        formId: form.id,
        form: formInput
      }
    }
  })
}




