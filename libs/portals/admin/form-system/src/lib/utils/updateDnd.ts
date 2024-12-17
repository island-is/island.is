/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client'
import { ControlState } from '../../hooks/controlReducer'

export const updateDnd = async (
  control: ControlState,
  updateSectionDisplayOrder: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined,
  ) => Promise<any>,
  updateScreenDisplayOrder: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined,
  ) => Promise<any>,
  updateFieldDisplayOrder: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined,
  ) => Promise<any>,
) => {
  const { type } = control.activeItem
  if (type === 'Section') {
    try {
      updateSectionDisplayOrder({
        variables: {
          input: {
            updateSectionsDisplayOrderDto: {
              sectionsDisplayOrderDto: control.form.sections?.map((section) => {
                return {
                  id: section?.id,
                }
              }),
            },
          },
        },
      })
    } catch (err) {
      console.error('Error updating section display order:', err.message)
    }
  } else if (type === 'Screen') {
    try {
      updateScreenDisplayOrder({
        variables: {
          input: {
            updateScreensDisplayOrderDto: {
              screensDisplayOrderDto: control.form.screens?.map((screen) => {
                return {
                  id: screen?.id,
                  sectionId: screen?.sectionId,
                }
              }),
            },
          },
        },
      })
    } catch (err) {
      console.error('Error updating screen display order:', err.message)
    }
  } else if (type === 'Field') {
    updateFieldDisplayOrder({
      variables: {
        input: {
          updateFieldsDisplayOrderDto: control.form.fields?.map((field) => {
            return {
              id: field?.id,
              screenId: field?.screenId,
            }
          }),
        },
      },
    })
  }
}
