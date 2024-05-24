import { FormSystemGroupInput, FormSystemInput } from '@island.is/api/schema'
import { ControlState } from '../../hooks/controlReducer'
import { ItemType } from './interfaces'
import { useFormSystemUpdateFormMutation } from '../../screens/Form/Form.generated'

export const updateDnd = (
  type: ItemType,
  control: ControlState,
  updateForm = useFormSystemUpdateFormMutation()[0],
) => {
  const formId = control.form.id
  if (type === 'Step') {
    const steps = control.form.stepsList
    updateForm({
      variables: {
        input: {
          formId: formId,
          form: {
            stepsList: steps?.map((s) => ({
              id: s?.id,
              guid: s?.guid,
              displayOrder: s?.displayOrder,
              name: s?.name,
              type: s?.type,
              waitingText: s?.waitingText,
              callRuleset: s?.callRuleset,
              isHidden: s?.isHidden,
              isCompleted: s?.isCompleted,
            })),
          },
        },
      },
    })
  } else if (type === 'Group') {
    const groups = control.form.groupsList
    updateForm({
      variables: {
        input: {
          formId: formId,
          form: {
            groupsList: groups?.map(
              (g) =>
                ({
                  id: g?.id,
                  name: g?.name,
                  guid: g?.guid,
                  displayOrder: g?.displayOrder,
                  isHidden: (g?.isHidden ?? false) as boolean,
                  stepId: g?.stepId,
                  multiSet: g?.multiSet,
                  stepGuid: g?.stepGuid,
                  inputs: null,
                } as FormSystemGroupInput),
            ),
          },
        },
      },
    })
  } else if (type === 'Input') {
    const { inputsList } = control.form
    updateForm({
      variables: {
        input: {
          formId: formId,
          form: {
            inputsList: inputsList
              ?.filter(
                (i): i is FormSystemInput => i !== null && i !== undefined,
              )
              .map((i) => ({
                id: i.id,
                name: i.name,
                description: i.description,
                isRequired: i.isRequired ?? false,
                displayOrder: i.displayOrder,
                isHidden: i.isHidden ?? false,
                type: i.type,
                inputSettings: i.inputSettings,
                isPartOfMultiSet: i.isPartOfMultiSet ?? false,
                groupId: i.groupId,
                groupGuid: i.groupGuid,
                guid: i.guid,
              })),
          },
        },
      },
    })
  }
}
