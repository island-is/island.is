import { useFormMutations } from '../../hooks/formProviderHooks'
import { ActiveItem } from './interfaces'
import {
  FormSystemSection,
  FormSystemScreen,
  FormSystemField,
} from '@island.is/api/schema'

export const updateActiveItemFn = (
  activeItem: ActiveItem,
  currentActiveItem?: ActiveItem,
) => {
  const { type } = activeItem
  const { updateSection, updateScreen, updateField } = useFormMutations()
  try {
    if (type === 'Section') {
      const { id, name, waitingText } =
        currentActiveItem
          ? (currentActiveItem.data as FormSystemSection)
          : (activeItem.data as FormSystemSection)
      updateSection({
        variables: {
          input: {
            stepId: id,
            stepUpdateDto: {
              id: id,
              name: name,
              type: type,
              waitingText: waitingText,
            },
          },
        },
      })
    } else if (type === 'Screen') {
      const { id, name, displayOrder, multiSet, sectionId } =
        currentActiveItem
          ? (currentActiveItem.data as FormSystemScreen)
          : (activeItem.data as FormSystemScreen)
      updateScreen({
        variables: {
          input: {
            id: activeItem?.data?.id,
            screenUpdateDto: {
              id,
              name: name,
              displayOrder,
              multiSet,
              sectionId,
            },
          },
        },
      })
    } else if (type === 'Field') {
      const {
        id,
        name,
        description,
        isPartOfMultiset,
        fieldSettings,
        fieldType
      } = currentActiveItem
          ? (currentActiveItem.data as FormSystemField)
          : (activeItem.data as FormSystemField)
      updateField({
        variables: {
          input: {
            id: id,
            fieldUpdateDto: {
              id,
              name,
              description,
              isPartOfMultiset,
              fieldSettings,
              fieldType,
            },
          },
        },
      })
    }
  } catch (e) {
    console.error('Error updating active item: ', e)
  }
}
