import { useFormSystemUpdateGroupMutation } from '../../screens/Form/UpdateGroup.generated'
import { useFormSystemUpdateInputMutation } from '../../screens/Form/UpdateInput.generated'
import { useFormSystemUpdateStepMutation } from '../../screens/Form/UpdateStep.generated'
import { ActiveItem } from './interfaces'
import {
  FormSystemStep,
  FormSystemGroup,
  FormSystemInput,
} from '@island.is/api/schema'

export const updateActiveItemFn = (
  activeItem: ActiveItem,
  updateStep = useFormSystemUpdateStepMutation()[0],
  updateGroup = useFormSystemUpdateGroupMutation()[0],
  updateInput = useFormSystemUpdateInputMutation()[0],
  currentActiveItem?: ActiveItem,
) => {
  const { type } = activeItem
  try {
    if (type === 'Step') {
      const { id, name, type, displayOrder, waitingText, callRuleset } =
        currentActiveItem
          ? (currentActiveItem.data as FormSystemStep)
          : (activeItem.data as FormSystemStep)
      updateStep({
        variables: {
          input: {
            stepId: id,
            stepUpdateDto: {
              id: id,
              name: name,
              type: type,
              displayOrder: displayOrder,
              waitingText: waitingText,
              callRuleset: callRuleset,
            },
          },
        },
      })
    } else if (type === 'Group') {
      const { id, name, guid, displayOrder, multiSet, stepId } =
        currentActiveItem
          ? (currentActiveItem.data as FormSystemGroup)
          : (activeItem.data as FormSystemGroup)
      updateGroup({
        variables: {
          input: {
            groupId: activeItem?.data?.id,
            groupUpdateDto: {
              id,
              name: name,
              guid,
              displayOrder,
              multiSet,
              stepId,
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
        groupId,
      } = currentActiveItem
        ? (currentActiveItem.data as FormSystemInput)
        : (activeItem.data as FormSystemInput)
      updateInput({
        variables: {
          input: {
            inputId: id,
            inputUpdateDto: {
              id,
              name: name,
              description: description,
              isRequired: isRequired ?? false,
              displayOrder,
              isHidden: isHidden ?? false,
              type,
              inputSettings: inputSettings,
              isPartOfMultiSet: isPartOfMultiSet ?? false,
              groupId: groupId ?? null,
            },
          },
        },
      })
    }
  } catch (e) {
    console.error('Error updating active item: ', e)
  }
}
