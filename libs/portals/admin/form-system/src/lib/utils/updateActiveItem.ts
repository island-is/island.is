/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloCache, DefaultContext, MutationFunctionOptions, MutationTuple, OperationVariables } from '@apollo/client'
import { ActiveItem } from './interfaces'
import {
  FormSystemSection,
  FormSystemScreen,
  FormSystemField,
} from '@island.is/api/schema'


export const updateActiveItemFn = async (
  activeItem: ActiveItem,
  sectionMutation: MutationTuple<any, OperationVariables, DefaultContext, ApolloCache<any>>,
  screenMutation: MutationTuple<any, OperationVariables, DefaultContext, ApolloCache<any>>,
  fieldMutation: MutationTuple<any, OperationVariables, DefaultContext, ApolloCache<any>>,
  currentActiveItem?: ActiveItem,
) => {
  const { type } = activeItem
  const [updateSection, { error: sectionError }] = sectionMutation
  const [updateScreen, { error: screenError }] = screenMutation
  const [updateField, { error: fieldError }] = fieldMutation
  try {
    if (type === 'Section') {
      const { id, name, waitingText } =
        currentActiveItem
          ? (currentActiveItem.data as FormSystemSection)
          : (activeItem.data as FormSystemSection)
      updateSection({
        variables: {
          input: {
            id,
            updateSectionDto: {
              name,
              waitingText
            }
          },
        },
      })
    } else if (type === 'Screen') {
      const { id, name, multiset, callRuleset } =
        currentActiveItem
          ? (currentActiveItem.data as FormSystemScreen)
          : (activeItem.data as FormSystemScreen)
      console.log('callRuleset', callRuleset)
      updateScreen({
        variables: {
          input: {
            id,
            updateScreenDto: {
              name,
              multiset: multiset ? multiset : 0,
              callRuleset
            },
          },
        }
      })
      if (screenError) {
        console.error('Error updating screen: ', screenError)
      }
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
    if (e.GraphQLError) {
      console.error("GraphQL errors:", e.graphQLErrors)
    }
    console.error('Error updating active item: ', e)
  }
}
