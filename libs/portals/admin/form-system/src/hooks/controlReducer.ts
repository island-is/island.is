import {
  FormSystemForm,
  FormSystemGroup,
  FormSystemInput,
  FormSystemListItem,
  FormSystemStep,
} from '@island.is/api/schema'
import { UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { removeTypename } from '../lib/utils/removeTypename'
import { uuid } from 'uuidv4'
import { ActiveItem, InputSettings } from '../lib/utils/interfaces'

type ActiveItemActions =
  | { type: 'SET_ACTIVE_ITEM'; payload: { activeItem: ActiveItem } }
  | {
      type: 'SET_ACTIVE_LIST_ITEM'
      payload: { listItem: FormSystemListItem | null }
    }

type GroupActions =
  | { type: 'ADD_GROUP'; payload: { group: FormSystemGroup } }
  | { type: 'REMOVE_GROUP'; payload: { groupId: number } }

type InputActions =
  | { type: 'ADD_INPUT'; payload: { input: FormSystemInput } }
  | { type: 'REMOVE_INPUT'; payload: { inputId: number } }
  | {
      type: 'CHANGE_INPUT_TYPE'
      payload: {
        newValue: string
        inputSettings: InputSettings
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'CHANGE_DESCRIPTION'
      payload: { lang: 'en' | 'is'; newValue: string }
    }
  | {
      type: 'CHANGE_IS_REQUIRED'
      payload: { update: (updatedActiveItem?: ActiveItem) => void }
    }

type StepActions =
  | { type: 'ADD_STEP'; payload: { step: FormSystemStep } }
  | { type: 'REMOVE_STEP'; payload: { stepId: number } }

type DndActions =
  | {
      type: 'STEP_OVER_STEP'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'GROUP_OVER_STEP'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'GROUP_OVER_GROUP'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'INPUT_OVER_GROUP'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'INPUT_OVER_INPUT'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'LIST_ITEM_OVER_LIST_ITEM'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }

type ChangeActions =
  | { type: 'CHANGE_NAME'; payload: { lang: 'en' | 'is'; newValue: string } }
  | {
      type: 'CHANGE_FORM_NAME'
      payload: { lang: 'en' | 'is'; newValue: string }
    }
  | { type: 'CHANGE_APPLICATION_DAYS_TO_REMOVE'; payload: { value: number } }
  | { type: 'CHANGE_INVALIDATION_DATE'; payload: { value: Date } }
  | {
      type: 'CHANGE_STOP_PROGRESS_ON_VALIDATING_STEP'
      payload: { value: boolean }
    }
  | { type: 'CHANGE_FORM_SETTINGS'; payload: { newForm: FormSystemForm } }
  | {
      type: 'TOGGLE_DEPENDENCY'
      payload: {
        activeId: string
        itemId: string
        update: (updatedForm: FormSystemForm) => void
      }
    }
  | {
      type: 'TOGGLE_MULTI_SET'
      payload: {
        checked: boolean
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }

type InputSettingsActions =
  | {
      type: 'SET_MESSAGE_WITH_LINK_SETTINGS'
      payload: {
        property: 'buttonText' | 'url' | 'hasLink'
        value?: string
        checked?: boolean
        lang?: 'is' | 'en'
        update?: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_FILE_UPLOAD_SETTINGS'
      payload: {
        property: 'isMulti' | 'maxSize' | 'amount' | 'types'
        checked?: boolean
        value?: string | number
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_INPUT_SETTINGS'
      payload: {
        property: 'isLarge'
        value: boolean
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'SET_LIST_ITEM_SELECTED'
      payload: {
        guid: UniqueIdentifier
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'REMOVE_LIST_ITEM'
      payload: {
        guid: UniqueIdentifier
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | {
      type: 'CHANGE_LIST_ITEM'
      payload: {
        property: 'label' | 'description'
        lang: 'is' | 'en'
        value: string
        guid: UniqueIdentifier
        update: (updatedActiveItem?: ActiveItem) => void
      }
    }
  | { type: 'ADD_LIST_ITEM' }

export type ControlAction =
  | ActiveItemActions
  | GroupActions
  | InputActions
  | StepActions
  | DndActions
  | ChangeActions
  | InputSettingsActions

export interface ControlState {
  activeItem: ActiveItem
  activeListItem: FormSystemListItem | null
  form: FormSystemForm
}

export const controlReducer = (
  state: ControlState,
  action: ControlAction,
): ControlState => {
  const { form, activeItem } = state
  const { stepsList: steps, groupsList: groups, inputsList: inputs } = form
  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: action.payload.activeItem,
      }
    case 'SET_ACTIVE_LIST_ITEM': {
      return {
        ...state,
        activeListItem: action.payload.listItem,
      }
    }
    // Steps
    case 'ADD_STEP':
      return {
        ...state,
        activeItem: {
          type: 'Step',
          data: action.payload.step,
        },
        form: {
          ...form,
          stepsList: [...(steps || []), action.payload.step],
        },
      }
    case 'REMOVE_STEP': {
      const newSteps = state.form.stepsList?.filter(
        (step) => step?.id !== action.payload.stepId,
      )
      return {
        ...state,
        form: {
          ...form,
          stepsList: newSteps,
        },
      }
    }

    // Groups
    case 'ADD_GROUP':
      return {
        ...state,
        activeItem: {
          type: 'Group',
          data: action.payload.group,
        },
        form: {
          ...form,
          groupsList: [...(groups || []), action.payload.group],
        },
      }
    case 'REMOVE_GROUP': {
      const newGroups = state.form.groupsList?.filter(
        (group) => group?.id !== action.payload.groupId,
      )
      const currentItem = state.activeItem.data as FormSystemGroup
      const newActiveItem = state.form.stepsList?.find(
        (step) => step?.guid === currentItem.stepGuid,
      )
      return {
        ...state,
        activeItem: {
          type: 'Step',
          data: newActiveItem,
        },
        form: {
          ...form,
          groupsList: newGroups,
        },
      }
    }

    // Inputs
    case 'ADD_INPUT':
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: action.payload.input,
        },
        form: {
          ...form,
          inputsList: [...(inputs || []), action.payload.input],
        },
      }
    case 'REMOVE_INPUT': {
      const newInputs = state.form.inputsList?.filter(
        (input) => input?.id !== action.payload.inputId,
      )
      const currentItem = state.activeItem.data as FormSystemInput
      const newActiveItem = state.form.groupsList?.find(
        (group) => group?.guid === currentItem.groupGuid,
      )
      return {
        ...state,
        activeItem: {
          type: 'Group',
          data: newActiveItem,
        },
        form: {
          ...form,
          inputsList: newInputs,
        },
      }
    }
    case 'CHANGE_INPUT_TYPE': {
      const { newValue, inputSettings, update } = action.payload
      const newActive = {
        ...activeItem,
        data: {
          ...activeItem.data,
          type: newValue,
          inputSettings: removeTypename(inputSettings),
        },
      }
      update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === activeItem.data?.guid ? newActive.data : i,
          ),
        },
      }
    }
    case 'CHANGE_DESCRIPTION': {
      const { lang, newValue } = action.payload
      const currentData = activeItem.data as FormSystemInput
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          description: {
            ...currentData?.description,
            [lang]: newValue,
          },
        },
      }
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === currentData?.guid ? newActive.data : i,
          ),
        },
      }
    }
    case 'CHANGE_IS_REQUIRED': {
      const currentData = activeItem.data as FormSystemInput
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          isRequired: !currentData?.isRequired,
        },
      }
      action.payload.update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === currentData?.guid ? newActive.data : i,
          ),
        },
      }
    }

    // Change
    case 'CHANGE_NAME': {
      const { lang, newValue } = action.payload
      const newActive = {
        ...activeItem,
        data: {
          ...activeItem.data,
          name: {
            ...activeItem.data?.name,
            [lang]: newValue,
          },
        },
      }
      const { type } = activeItem
      let updatedList
      if (type === 'Step') {
        updatedList = steps?.map((s) =>
          s?.guid === activeItem.data?.guid ? newActive.data : s,
        )
      } else if (type === 'Group') {
        updatedList = groups?.map((g) =>
          g?.guid === activeItem.data?.guid ? newActive.data : g,
        )
      } else if (type === 'Input') {
        updatedList = inputs?.map((i) =>
          i?.guid === activeItem.data?.guid ? newActive.data : i,
        )
      }
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          stepsList:
            type === 'Step'
              ? (updatedList as FormSystemStep[])
              : form.stepsList,
          groupsList:
            type === 'Group'
              ? (updatedList as FormSystemGroup[])
              : form.groupsList,
          inputsList:
            type === 'Input'
              ? (updatedList as FormSystemInput[])
              : form.inputsList,
        },
      }
    }
    case 'CHANGE_FORM_NAME': {
      const { lang, newValue } = action.payload
      return {
        ...state,
        form: {
          ...form,
          name: {
            ...form.name,
            [lang]: newValue,
          },
        },
      }
    }
    case 'CHANGE_APPLICATION_DAYS_TO_REMOVE': {
      return {
        ...state,
        form: {
          ...form,
          applicationsDaysToRemove: action.payload.value,
        },
      }
    }
    case 'CHANGE_INVALIDATION_DATE': {
      return {
        ...state,
        form: {
          ...form,
          invalidationDate: action.payload.value,
        },
      }
    }
    case 'CHANGE_FORM_SETTINGS': {
      return {
        ...state,
        form: action.payload.newForm,
      }
    }
    case 'CHANGE_STOP_PROGRESS_ON_VALIDATING_STEP': {
      return {
        ...state,
        form: {
          ...form,
          stopProgressOnValidatingStep: action.payload.value,
        },
      }
    }
    case 'TOGGLE_DEPENDENCY': {
      const { activeId, itemId, update } = action.payload
      const dependencies = { ...form.dependencies } ?? {}
      if (activeId in dependencies) {
        if (!dependencies[activeId].includes(itemId)) {
          dependencies[activeId] = [...dependencies[activeId], itemId]
        } else {
          dependencies[activeId] = dependencies[activeId].filter(
            (t: string) => t !== itemId,
          )
          if (dependencies[activeId].length === 0) {
            delete dependencies[activeId]
          }
        }
      } else {
        dependencies[activeId] = [itemId]
      }
      const updatedForm = {
        ...form,
        dependencies: dependencies,
      }
      update(updatedForm)
      return {
        ...state,
        form: updatedForm,
      }
    }

    case 'TOGGLE_MULTI_SET': {
      const currentData = activeItem.data as FormSystemGroup
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          multiSet: action.payload.checked ? 1 : 0,
        },
      }
      action.payload.update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          groupsList: groups?.map((g) =>
            g?.guid === currentData?.guid ? newActive.data : g,
          ),
        },
      }
    }
    // Input settings
    case 'SET_MESSAGE_WITH_LINK_SETTINGS': {
      const input = activeItem.data as FormSystemInput
      const { property, lang: langg, value, checked, update } = action.payload
      const lang = langg ?? 'is'

      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          [property]: property === 'hasLink' ? checked : value,
          ...(property === 'buttonText'
            ? {
                buttonText: {
                  ...input.inputSettings?.buttonText,
                  [lang]: value,
                },
              }
            : {}),
        },
      }
      if (property === 'hasLink' && update) {
        update({ type: 'Input', data: newInput })
      }
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    case 'SET_FILE_UPLOAD_SETTINGS': {
      const input = activeItem.data as FormSystemInput
      const { property, checked, value, update } = action.payload

      const updateFileTypesArray = (): string[] => {
        const newFileTypes = (input.inputSettings?.types as string[]) ?? []
        if (checked) {
          return [...newFileTypes, value as string]
        } else {
          return newFileTypes.filter((type) => type !== value)
        }
      }
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          [property]:
            property === 'types'
              ? updateFileTypesArray()
              : property === 'isMulti'
              ? checked
              : value,
        },
      }
      update({ type: 'Input', data: newInput })
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    case 'SET_INPUT_SETTINGS': {
      const input = activeItem.data as FormSystemInput
      const { property, value, update } = action.payload
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          [property]: value,
        },
      }
      update({ type: 'Input', data: newInput })
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    case 'SET_LIST_ITEM_SELECTED': {
      const { guid, update } = action.payload
      const input = activeItem.data as FormSystemInput
      const list = input.inputSettings?.list ?? []
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          list: list.map((l: FormSystemListItem) =>
            l.guid === guid
              ? { ...l, isSelected: !l.isSelected }
              : { ...l, isSelected: false },
          ),
        },
      }
      update({ type: 'Input', data: newInput })
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    case 'REMOVE_LIST_ITEM': {
      const { guid, update } = action.payload
      const input = activeItem.data as FormSystemInput
      const list = input.inputSettings?.list ?? []
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          list: list.filter((l: FormSystemListItem) => l.guid !== guid),
        },
      }
      update({ type: 'Input', data: newInput })
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    case 'ADD_LIST_ITEM': {
      const input = activeItem.data as FormSystemInput
      const list = input.inputSettings?.list ?? []
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          list: [
            ...list,
            {
              guid: uuid(),
              label: { is: '', en: '' },
              description: { is: '', en: '' },
              displayOrder: list.length,
              isSelected: false,
            },
          ],
        },
      }
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    case 'CHANGE_LIST_ITEM': {
      const input = activeItem.data as FormSystemInput
      const list = input.inputSettings?.list
      const { property, lang, value, guid, update } = action.payload
      if (!list) return state
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          list: list.map((l: FormSystemListItem) => {
            if (l.guid === guid) {
              return {
                ...l,
                [property]: {
                  ...l[property],
                  [lang]: value,
                },
              }
            }
            return l
          }),
        },
      }
      update({ type: 'Input', data: newInput })
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    // Drag and Drop
    case 'STEP_OVER_STEP': {
      const activeIndex = steps?.findIndex(
        (step) => step?.guid === action.payload.activeId,
      ) as number
      const overIndex = steps?.findIndex(
        (step) => step?.guid === action.payload.overId,
      ) as number
      const updatedSteps = arrayMove(steps || [], activeIndex, overIndex)
      return {
        ...state,
        form: {
          ...form,
          stepsList: updatedSteps.map((s, i) => ({ ...s, displayOrder: i })),
        },
      }
    }
    case 'GROUP_OVER_STEP': {
      const activeIndex = groups?.findIndex(
        (group) => group?.guid === action.payload.activeId,
      ) as number
      const overIndex = steps?.findIndex(
        (step) => step?.guid === action.payload.overId,
      ) as number
      const updatedGroups = groups as FormSystemGroup[]
      if (steps && steps[overIndex]) {
        updatedGroups[activeIndex].stepGuid = action.payload.overId as string
        updatedGroups[activeIndex].stepId = steps[overIndex]?.id as number
      }
      return {
        ...state,
        form: {
          ...form,
          groupsList: arrayMove(updatedGroups, activeIndex, activeIndex).map(
            (g, i) => ({ ...g, displayOrder: i }),
          ),
        },
      }
    }
    case 'GROUP_OVER_GROUP': {
      const activeIndex = groups?.findIndex(
        (group) => group?.guid === action.payload.activeId,
      ) as number
      const overIndex = groups?.findIndex(
        (group) => group?.guid === action.payload.overId,
      ) as number
      const updatedGroups = groups as FormSystemGroup[]
      if (updatedGroups[activeIndex] && updatedGroups[overIndex]) {
        if (
          updatedGroups[activeIndex].stepGuid !==
          updatedGroups[overIndex].stepGuid
        ) {
          updatedGroups[activeIndex].stepGuid =
            updatedGroups[overIndex].stepGuid
          updatedGroups[activeIndex].stepId = updatedGroups[overIndex].stepId
          return {
            ...state,
            form: {
              ...form,
              groupsList: arrayMove(
                updatedGroups,
                activeIndex,
                overIndex - 1,
              ).map((g, i) => ({ ...g, displayOrder: i })),
            },
          }
        }
        return {
          ...state,
          form: {
            ...form,
            groupsList: arrayMove(updatedGroups, activeIndex, overIndex).map(
              (g, i) => ({ ...g, displayOrder: i }),
            ),
          },
        }
      }
      return state
    }
    case 'INPUT_OVER_GROUP': {
      const activeIndex = inputs?.findIndex(
        (input) => input?.guid === action.payload.activeId,
      ) as number
      const overIndex = groups?.findIndex(
        (group) => group?.guid === action.payload.overId,
      ) as number
      const updatedInputs = inputs?.map((input) => ({
        ...input,
      })) as FormSystemInput[]
      if (groups && groups[overIndex]) {
        updatedInputs[activeIndex].groupGuid = action.payload.overId as string
        updatedInputs[activeIndex].groupId = groups[overIndex]?.id as number
      }
      return {
        ...state,
        form: {
          ...form,
          inputsList: arrayMove(updatedInputs, activeIndex, overIndex).map(
            (i, index) => ({ ...i, displayOrder: index }),
          ),
        },
      }
    }
    case 'INPUT_OVER_INPUT': {
      const activeIndex = inputs?.findIndex(
        (input) => input?.guid === action.payload.activeId,
      ) as number
      const overIndex = inputs?.findIndex(
        (input) => input?.guid === action.payload.overId,
      ) as number
      const updatedInputs = inputs?.map((input) => ({
        ...input,
      })) as FormSystemInput[]
      if (updatedInputs[activeIndex] && updatedInputs[overIndex]) {
        if (
          updatedInputs[activeIndex].groupGuid !==
          updatedInputs[overIndex].groupGuid
        ) {
          updatedInputs[activeIndex].groupGuid =
            updatedInputs[overIndex].groupGuid
          updatedInputs[activeIndex].groupId = updatedInputs[overIndex].groupId
          return {
            ...state,
            form: {
              ...form,
              inputsList: arrayMove(
                updatedInputs,
                activeIndex,
                overIndex - 1,
              ).map((i, index) => ({ ...i, displayOrder: index })),
            },
          }
        }
        return {
          ...state,
          form: {
            ...form,
            inputsList: arrayMove(updatedInputs, activeIndex, overIndex).map(
              (i, index) => ({ ...i, displayOrder: index }),
            ),
          },
        }
      }
      return state
    }
    case 'LIST_ITEM_OVER_LIST_ITEM': {
      const input = activeItem.data as FormSystemInput
      const list = input.inputSettings?.list
      const { activeId, overId } = action.payload
      if (!list) {
        return state
      }
      const activeIndex = list.findIndex(
        (item: FormSystemListItem) => item.guid === activeId,
      )
      const overIndex = list.findIndex(
        (item: FormSystemListItem) => item.guid === overId,
      )

      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          list: arrayMove<FormSystemListItem>(list, activeIndex, overIndex).map(
            (l: FormSystemListItem, i: number) => ({ ...l, displayOrder: i }),
          ),
        },
      }
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: newInput,
        },
        form: {
          ...form,
          inputsList: inputs?.map((i) =>
            i?.guid === input.guid ? newInput : i,
          ),
        },
      }
    }
    default:
      return state
  }
}
