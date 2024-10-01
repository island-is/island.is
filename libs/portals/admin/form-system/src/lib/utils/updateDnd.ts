import { ControlState } from "../../hooks/controlReducer"
import { useFormMutations } from "../../hooks/formProviderHooks"

export const updateDnd = (control: ControlState) => {
  const { type } = control.activeItem
  const { updateSectionDisplayOrder, updateScreenDisplayOrder, updateFieldDisplayOrder } = useFormMutations()
  if (type === 'Section') {
    updateSectionDisplayOrder[0]({
      variables: {
        input: {
          updateSectionsDisplayOrderDto: control.form.sections?.map(section => section?.id)
        }
      }
    })
  } else if (type === 'Screen') {
    updateScreenDisplayOrder[0]({
      variables: {
        input: {
          updateScreensDisplayOrderDto: control.form.screens?.map(screen => {
            return {
              id: screen?.id,
              sectionId: screen?.sectionId
            }
          })
        }
      }
    })
  } else if (type === 'Field') {
    updateFieldDisplayOrder[0]({
      variables: {
        input: {
          updateFieldsDisplayOrderDto: control.form.fields?.map(field => {
            return {
              id: field?.id,
              screenId: field?.screenId
            }
          })
        }
      }
    })
  }
}
