import { LazyQueryExecFunction, OperationVariables } from "@apollo/client"
import { ControlState } from "../../hooks/controlReducer"

export const updateDnd = (
  control: ControlState,
  updateSectionDisplayOrder: LazyQueryExecFunction<any, OperationVariables>,
  updateScreenDisplayOrder: LazyQueryExecFunction<any, OperationVariables>,
  updateFieldDisplayOrder: LazyQueryExecFunction<any, OperationVariables>) => {
  const { type } = control.activeItem

  if (type === 'Section') {
    updateSectionDisplayOrder({
      variables: {
        input: {
          updateSectionsDisplayOrderDto: control.form.sections?.map(section => section?.id)
        }
      }
    })
  } else if (type === 'Screen') {
    updateScreenDisplayOrder({
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
    updateFieldDisplayOrder({
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
