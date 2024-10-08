// import { MutationHookOptions, useLazyQuery } from '@apollo/client'
// // eslint-disable-next-line @nx/enforce-module-boundaries
// import {
//   CREATE_FIELD,
//   CREATE_LIST_ITEM,
//   CREATE_SCREEN,
//   CREATE_SECTION,
//   DELETE_FIELD,
//   DELETE_LIST_ITEM,
//   DELETE_SCREEN,
//   DELETE_SECTION,
//   UPDATE_FIELD,
//   UPDATE_FIELDS_DISPLAY_ORDER,
//   UPDATE_FORM,
//   UPDATE_LIST_ITEM,
//   UPDATE_LIST_ITEM_DISPLAY_ORDER,
//   UPDATE_SCREEN,
//   UPDATE_SCREEN_DISPLAY_ORDER,
//   UPDATE_SECTION,
//   UPDATE_SECTION_DISPLAY_ORDER,
// } from '@island.is/form-system/graphql'

// type MutationName = keyof typeof MUTATIONS
// type CamelCaseMutationName = typeof MUTATION_NAMES[MutationName]

// export type FormMutations = ReturnType<typeof useFormMutations>
// export type FormMutationName = keyof FormMutations


// const MUTATIONS = {
//   CREATE_SECTION,
//   CREATE_SCREEN,
//   CREATE_FIELD,
//   DELETE_SECTION,
//   DELETE_SCREEN,
//   DELETE_FIELD,
//   UPDATE_SECTION,
//   UPDATE_SECTION_DISPLAY_ORDER,
//   UPDATE_SCREEN,
//   UPDATE_SCREEN_DISPLAY_ORDER,
//   UPDATE_FIELD,
//   UPDATE_FIELDS_DISPLAY_ORDER,
//   CREATE_LIST_ITEM,
//   DELETE_LIST_ITEM,
//   UPDATE_LIST_ITEM,
//   UPDATE_LIST_ITEM_DISPLAY_ORDER,
//   UPDATE_FORM
// } as const

// const MUTATION_NAMES = {
//   CREATE_SECTION: 'createSection',
//   CREATE_SCREEN: 'createScreen',
//   CREATE_FIELD: 'createField',
//   DELETE_SECTION: 'deleteSection',
//   DELETE_SCREEN: 'deleteScreen',
//   DELETE_FIELD: 'deleteField',
//   UPDATE_SECTION: 'updateSection',
//   UPDATE_SECTION_DISPLAY_ORDER: 'updateSectionDisplayOrder',
//   UPDATE_SCREEN: 'updateScreen',
//   UPDATE_SCREEN_DISPLAY_ORDER: 'updateScreenDisplayOrder',
//   UPDATE_FIELD: 'updateField',
//   UPDATE_FIELDS_DISPLAY_ORDER: 'updateFieldDisplayOrder',
//   CREATE_LIST_ITEM: 'createListItem',
//   DELETE_LIST_ITEM: 'deleteListItem',
//   UPDATE_LIST_ITEM: 'updateListItem',
//   UPDATE_LIST_ITEM_DISPLAY_ORDER: 'updateListItemDisplayOrder',
//   UPDATE_FORM: 'updateForm'
// } as const



// export const useFormMutations = () => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const createMutationHook = (mutation: any, options: MutationHookOptions = {}) =>
//     useLazyQuery(mutation, {
//       ...options,
//       onError: (error) => {
//         console.error(error, error.message)
//         options.onError?.(error)
//       },
//     })

//   const hooks = (Object.entries(MUTATIONS) as [MutationName, any][]).reduce((acc, [key, mutation]) => {
//     const mutationHook = createMutationHook(mutation)
//     return { ...acc, [MUTATION_NAMES[key]]: mutationHook }
//   }, {} as Record<CamelCaseMutationName, ReturnType<typeof createMutationHook>>)

//   return hooks
// }


