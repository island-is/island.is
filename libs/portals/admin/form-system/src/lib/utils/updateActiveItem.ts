/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloCache,
  DefaultContext,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'
import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { ActiveItem } from './interfaces'

export const updateActiveItemFn = async (
  activeItem: ActiveItem,
  sectionMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
  screenMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
  fieldMutation: MutationTuple<
    any,
    OperationVariables,
    DefaultContext,
    ApolloCache<any>
  >,
  currentActiveItem?: ActiveItem,
) => {
  const { type } = currentActiveItem ? currentActiveItem : activeItem
  const [updateSection] = sectionMutation
  const [updateScreen] = screenMutation
  const [updateField] = fieldMutation

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

  try {
    if (type === 'Section') {
      const { id, name, waitingText } = currentActiveItem
        ? (currentActiveItem.data as FormSystemSection)
        : (activeItem.data as FormSystemSection)
      await updateSection({
        variables: {
          input: {
            id,
            updateSectionDto: {
              name,
              waitingText,
            },
          },
        },
      })
    } else if (type === 'Screen') {
      const { id, name, multiMax, isMulti, shouldValidate } = currentActiveItem
        ? (currentActiveItem.data as FormSystemScreen)
        : (activeItem.data as FormSystemScreen)
      await updateScreen({
        variables: {
          input: {
            id,
            updateScreenDto: {
              name,
              multiMax: multiMax ? multiMax : 0,
              isMulti: isMulti ? isMulti : false,
              shouldValidate: shouldValidate ? shouldValidate : false,
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
        fieldType,
        isRequired,
        isHidden,
      } = currentActiveItem
        ? (currentActiveItem.data as FormSystemField)
        : (activeItem.data as FormSystemField)
      await updateField({
        variables: {
          input: {
            id: id,
            updateFieldDto: {
              name,
              description,
              isPartOfMultiset,
              fieldSettings,
              fieldType,
              isRequired: isRequired ? isRequired : false,
              isHidden: isHidden ? isHidden : false,
            },
          },
        },
      })
    }
  } catch (e) {
    const status = getHttpStatusFromApolloError(e)
    if (status === 401 || status === 403) {
      redirectToBffLogin()
      return
    }
    if (e.GraphQLError) {
      console.error('GraphQL errors:', e.graphQLErrors)
    }
    console.error('Error updating active item: ', e)
  }
}
