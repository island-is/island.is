import {
  FormSystemForm,
  FormSystemFormInput,
  FormSystemGroupInput,
  FormSystemInputInput,
  FormSystemOrganizationInput,
  FormSystemStepInput,
  InputMaybe,
} from '@island.is/api/schema'
import { ControlState } from '../../hooks/controlReducer'
import { useFormSystemUpdateFormMutation } from '../../screens/Form/Form.generated'

export const entireFormUpdate = (
  control: ControlState,
  updateForm = useFormSystemUpdateFormMutation()[0],
  updatedForm?: FormSystemForm,
) => {
  const form = updatedForm ? updatedForm : control.form
  const organiaztionInput: FormSystemOrganizationInput = {
    ...(form.organization as FormSystemOrganizationInput),
  }

  const inputs: InputMaybe<FormSystemInputInput>[] =
    form.inputsList
      ?.filter((input) => input !== undefined && input !== null)
      .map((i) => ({
        ...i,
        isHidden: i?.isHidden ?? false,
        isPartOfMultiSet: i?.isPartOfMultiSet ?? false,
        isRequired: i?.isRequired ?? false,
      })) ?? []

  const groups: InputMaybe<FormSystemGroupInput>[] =
    form.groupsList
      ?.filter((group) => group !== undefined && group !== null)
      .map((g) => ({
        ...g,
        inputs: null,
      })) ?? []

  const steps: InputMaybe<FormSystemStepInput>[] =
    form.stepsList
      ?.filter((step) => step !== undefined && step !== null)
      .map((s) => ({
        ...s,
        groups: null,
      })) ?? []

  const formInput: FormSystemFormInput = {
    ...form,
    organization: organiaztionInput,
    inputsList: inputs,
    groupsList: groups,
    stepsList: steps,
    steps: null,
  }
  updateForm({
    variables: {
      input: {
        formId: form.id,
        form: formInput,
      },
    },
  })
}
