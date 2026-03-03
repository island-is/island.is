/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloCache,
  DefaultContext,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'
import { ActiveItem } from './interfaces'
import {
  FormSystemSection,
  FormSystemScreen,
  FormSystemField,
} from '@island.is/api/schema'

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
  const { type } = activeItem
  const [updateSection] = sectionMutation
  const [updateScreen] = screenMutation
  const [updateField] = fieldMutation
  try {
    if (type === 'Section') {
      const { id, name, waitingText } = currentActiveItem
        ? (currentActiveItem.data as FormSystemSection)
        : (activeItem.data as FormSystemSection)
      updateSection({
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
      const { id, name, multiset, shouldValidate, shouldPopulate } =
        currentActiveItem
          ? (currentActiveItem.data as FormSystemScreen)
          : (activeItem.data as FormSystemScreen)
      updateScreen({
        variables: {
          input: {
            id,
            updateScreenDto: {
              name,
              multiset: multiset ? multiset : 0,
              shouldValidate: shouldValidate ? shouldValidate : false,
              shouldPopulate: shouldPopulate ? shouldPopulate : false,
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
      updateField({
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
    if (e.GraphQLError) {
      console.error('GraphQL errors:', e.graphQLErrors)
    }
    console.error('Error updating active item: ', e)
  }
}
