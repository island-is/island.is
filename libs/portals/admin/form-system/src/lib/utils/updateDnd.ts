import { FormSystemField, FormSystemScreen } from '@island.is/api/schema'
import { ControlState } from "../../hooks/controlReducer"
import { useFormMutations } from "../../hooks/formProviderHooks"

export const updateDnd = (control: ControlState) => {
  const { type } = control.activeItem
  const { updateSectionDisplayOrder, updateScreen, updateScreenDisplayOrder, updateField, updateFieldDisplayOrder } = useFormMutations()

  if (type === 'Section') {
    updateSectionDisplayOrder({
      variables: {
        input: {
          updateSectionsDisplayOrderDto: control.form.sections?.map(section => section?.id)
        }
      }
    })
  } else if (type === 'Screen') {
    const activeItem = control.activeItem.data as FormSystemScreen
    updateScreenDisplayOrder({
      variables: {
        input: {
          updateScreensDisplayOrderDto: control.form.screens?.map(screen => screen?.id)
        }
      }
    })
    updateScreen({
      variables: {
        input: {
          id: activeItem.id,
          updateScreenDto: {
            name: activeItem.name,
            sectionId: activeItem.sectionId,
            multiSet: activeItem.multiSet,
            callRuleset: activeItem.callRuleset,
          }
        }
      }
    })
  } else if (type === 'Field') {
    const activeItem = control.activeItem.data as FormSystemField
    updateFieldDisplayOrder({
      variables: {
        input: {
          updateFieldsDisplayOrderDto: control.form.fields?.map(field => field?.id)
        }
      }
    })
    updateField({
      variables: {
        input: {
          id: activeItem.id,
          updateFieldDto: {
            name: activeItem.name,
            description: activeItem.description,
            isPartOfMultiSet: activeItem.isPartOfMultiset,
            fieldSettings: activeItem.fieldSettings,
            fieldType: activeItem.fieldType,
            screenId: activeItem.screenId,
          }
        }
      }
    })
  }
}
