import { FormSystemGroup, FormSystemGroupInput, FormSystemInput } from "@island.is/api/schema"
import { useFormSystemUpdateFormMutation } from "../../gql/Form.generated"
import { ControlState } from "../../hooks/controlReducer"
import { ItemType } from "./interfaces"


export const updateDnd = (
  type: ItemType,
  control: ControlState,
  updateForm = useFormSystemUpdateFormMutation()[0]
) => {
  console.log('updating: ', type)
  const formId = control.form.id
  if (type === 'Step') {
    const steps = control.form.stepsList
    const { form } = control
    updateForm({
      variables: {
        input: {
          formId: formId,
          form: {
            stepsList: steps?.map(s => ({
              id: s?.id,
              guid: s?.guid,
              displayOrder: s?.displayOrder,
              name: s?.name?.__typename ? { ...s?.name, __typename: undefined } : s?.name,
              type: s?.type,
              waitingText: s?.waitingText?.__typename ? { ...s?.waitingText, __typename: undefined } : s?.waitingText,
              callRuleset: s?.callRuleset,
              isHidden: s?.isHidden,
              isCompleted: s?.isCompleted,
            }))
          }
        }
      }
    })
  } else if (type === 'Group') {
    const { groupsList } = control.form
    const updatedGroup = groupsList?.map(g => ({
      id: g?.id,
      name: g?.name?.__typename ? { ...g?.name, __typename: undefined } : g?.name,
      guid: g?.guid,
      displayOrder: g?.displayOrder,
      isHidden: g?.isHidden ?? false,
      stepId: g?.stepId,
      multiSet: g?.multiSet,
      stepGuid: g?.stepGuid,
    }))
    console.log('updatedGroup', updatedGroup)
    updateForm({
      variables: {
        input: {
          formId: formId,
          form: {
            groupsList: groupsList?.map(g => ({
              id: g?.id,
              name: g?.name?.__typename ? { ...g?.name, __typename: undefined } : g?.name,
              guid: g?.guid,
              displayOrder: g?.displayOrder,
              isHidden: g?.isHidden ?? false,
              stepId: g?.stepId,
              multiSet: g?.multiSet,
              stepGuid: g?.stepGuid,
            } as FormSystemGroupInput),
            )
          }
        }
      }
    })
  } else if (type === 'Input') {
    const { inputsList } = control.form
    updateForm({
      variables: {
        input: {
          formId: formId,
          form: {
            inputsList: inputsList?.filter((i): i is FormSystemInput => i !== null && i !== undefined).map(i => ({
              id: i.id,
              name: i.name?.__typename ? { ...i.name, __typename: undefined } : i.name,
              description: i.description?.__typename ? { ...i.description, __typename: undefined } : i.description,
              isRequired: i.isRequired ?? false,
              displayOrder: i.displayOrder,
              isHidden: i.isHidden ?? false,
              type: i.type,
              inputSettings: i.inputSettings?.__typename ? { ...i.inputSettings, __typename: undefined } : i.inputSettings,
              isPartOfMultiSet: i.isPartOfMultiSet ?? false,
              groupId: i.groupId,
              groupGuid: i.groupGuid,
              guid: i.guid
            }),
            )
          }
        }
      }
    })
  }
}
