import { ActiveItem } from "./interfaces"
import { useFormSystemUpdateStepMutation } from "../../gql/Step.generated"
import { useFormSystemUpdateGroupMutation } from "../../gql/Group.generated"
import { useFormSystemUpdateInputMutation } from "../../gql/Input.generated"
import { FormSystemStep, FormSystemGroup, FormSystemInput } from "@island.is/api/schema"

export const updateActiveItemFn = (
  activeItem: ActiveItem,
  updateStep = useFormSystemUpdateStepMutation()[0],
  updateGroup = useFormSystemUpdateGroupMutation()[0],
  updateInput = useFormSystemUpdateInputMutation()[0],
  currentActiveItem?: ActiveItem
) => {
  const { type } = activeItem
  console.log('updating: ', type)
  if (type === 'Step') {
    const { id, name, type, displayOrder, waitingText, callRuleset } = currentActiveItem ? currentActiveItem.data as FormSystemStep : activeItem.data as FormSystemStep

    updateStep({
      variables: {
        input: {
          stepId: id,
          stepUpdateDto: {
            id: id,
            name: name?.__typename ? { ...name, __typename: undefined } : name,
            type: type,
            displayOrder: displayOrder,
            waitingText: waitingText?.__typename ? { ...waitingText, __typename: undefined } : waitingText,
            callRuleset: callRuleset
          }
        }
      }
    })
  } else if (type === 'Group') {
    const { id, name, guid, displayOrder, multiSet } = currentActiveItem ? currentActiveItem.data as FormSystemGroup : activeItem.data as FormSystemGroup
    updateGroup({
      variables: {
        input: {
          groupId: activeItem?.data?.id,
          groupUpdateDto: {
            id,
            name: name?.__typename ? { ...name, __typename: undefined } : name,
            guid,
            displayOrder,
            multiSet,
          },
        },
      },
    })
  } else if (type === 'Input') {
    const {
      id,
      name,
      description,
      isRequired,
      displayOrder,
      isHidden,
      type,
      inputSettings,
      isPartOfMultiSet,
    } = currentActiveItem ? currentActiveItem.data as FormSystemInput : activeItem.data as FormSystemInput
    updateInput({
      variables: {
        input: {
          inputId: activeItem?.data?.id,
          inputUpdateDto: {
            id,
            name: name?.__typename ? { ...name, __typename: undefined } : name,
            description: description?.__typename
              ? { ...description, __typename: undefined }
              : description,
            isRequired: isRequired ?? false,
            displayOrder,
            isHidden: isHidden ?? false,
            type,
            inputSettings: inputSettings?.__typename
              ? { ...inputSettings, __typename: undefined }
              : inputSettings,
            isPartOfMultiSet: isPartOfMultiSet ?? false,
          },
        },
      },
    });
  }
};
