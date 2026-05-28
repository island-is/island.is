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

  let didRedirectToLogin = false

  const redirectToBffLogin = () => {
    if (didRedirectToLogin) return
    // avoid loops if we somehow are already on a BFF route
    if (window.location.pathname.startsWith('/stjornbord/bff/')) return

    didRedirectToLogin = true
    const target = encodeURIComponent(window.location.href)
    window.location.href = `/stjornbord/bff/login?target_link_uri=${target}`
  }

  const getHttpStatusFromApolloError = (err: any): number | undefined => {
    return (
      err?.networkError?.statusCode ??
      err?.networkError?.response?.status ??
      err?.networkError?.status ??
      err?.statusCode
    )
  }

  if (type === 'Section') {
    try {
      await updateSectionDisplayOrder({
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
      const status = getHttpStatusFromApolloError(err)
      if (status === 401 || status === 403) {
        redirectToBffLogin()
        return
      }
      console.error('Error updating section display order:', err.message)
    }
  } else if (type === 'Screen') {
    try {
      await updateScreenDisplayOrder({
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
      const status = getHttpStatusFromApolloError(err)
      if (status === 401 || status === 403) {
        redirectToBffLogin()
        return
      }
      console.error('Error updating screen display order:', err.message)
    }
  } else if (type === 'Field') {
    try {
      await updateFieldDisplayOrder({
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
    } catch (err) {
      const status = getHttpStatusFromApolloError(err)
      if (status === 401 || status === 403) {
        redirectToBffLogin()
        return
      }
      console.error('Error updating field display order:', err.message)
    }
  }
}
