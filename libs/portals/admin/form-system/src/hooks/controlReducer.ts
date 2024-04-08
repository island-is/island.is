import { FormSystemForm, FormSystemGroup, FormSystemInput, FormSystemInputSettings, FormSystemStep } from "@island.is/api/schema"
import { ActiveItem } from "../types/interfaces"
import { UniqueIdentifier } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

type ActiveItemActions =
  | { type: 'SET_ACTIVE_ITEM', payload: { activeItem: ActiveItem } }

type GroupActions =
  | { type: 'ADD_GROUP', payload: { group: FormSystemGroup } }
  | { type: 'REMOVE_GROUP', payload: { groupId: number } }

type InputActions =
  | { type: 'ADD_INPUT', payload: { input: FormSystemInput } }
  | { type: 'REMOVE_INPUT', payload: { inputId: number } }
  | { type: 'CHANGE_INPUT_TYPE', payload: { newValue: string, inputSettings: FormSystemInputSettings, update: (updatedActiveItem?: ActiveItem) => void } }
  | { type: 'CHANGE_DESCRIPTION', payload: { lang: 'en' | 'is', newValue: string } }
  | { type: 'CHANGE_IS_REQUIRED', payload: { update: (updatedActiveItem?: ActiveItem) => void } }


type StepActions =
  | { type: 'ADD_STEP', payload: { step: FormSystemStep } }
  | { type: 'REMOVE_STEP', payload: { stepId: number } }

type DndActions =
  | { type: 'STEP_OVER_STEP', payload: { activeId: UniqueIdentifier, overId: UniqueIdentifier } }
  | { type: 'GROUP_OVER_STEP', payload: { activeId: UniqueIdentifier, overId: UniqueIdentifier } }
  | { type: 'GROUP_OVER_GROUP', payload: { activeId: UniqueIdentifier, overId: UniqueIdentifier } }
  | { type: 'INPUT_OVER_GROUP', payload: { activeId: UniqueIdentifier, overId: UniqueIdentifier } }
  | { type: 'INPUT_OVER_INPUT', payload: { activeId: UniqueIdentifier, overId: UniqueIdentifier } }

type ChangeActions =
  | { type: 'CHANGE_NAME', payload: { lang: 'en' | 'is', newValue: string } }
  | { type: 'CHANGE_FORM_NAME', payload: { lang: 'en' | 'is', newValue: string } }
  | { type: 'CHANGE_APPLICATION_DAYS_TO_REMOVE', payload: { value: number } }
  | { type: 'CHANGE_INVALIDATION_DATE', payload: { value: Date } }
  | { type: 'CHANGE_STOP_PROGRESS_ON_VALIDATING_STEP', payload: { value: boolean } }
  | { type: 'CHANGE_FORM_SETTINGS', payload: { newForm: FormSystemForm } }

export type ControlAction = ActiveItemActions | GroupActions | InputActions | StepActions | DndActions | ChangeActions

export interface ControlState {
  activeItem: ActiveItem
  form: FormSystemForm
}

export const controlReducer = (state: ControlState, action: ControlAction): ControlState => {
  const { form, activeItem } = state
  const { stepsList: steps, groupsList: groups, inputsList: inputs } = form
  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: action.payload.activeItem
      }

    // Steps
    case 'ADD_STEP':
      return {
        ...state,
        activeItem: {
          type: 'Step',
          data: action.payload.step
        },
        form: {
          ...form,
          stepsList: [...(steps || []), action.payload.step]
        }
      }
    case 'REMOVE_STEP': {
      const newSteps = state.form.stepsList?.filter((step) => step?.id !== action.payload.stepId)
      return {
        ...state,
        form: {
          ...form,
          stepsList: newSteps
        }
      }
    }

    // Groups
    case 'ADD_GROUP':
      return {
        ...state,
        activeItem: {
          type: 'Group',
          data: action.payload.group
        },
        form: {
          ...form,
          groupsList: [...(groups || []), action.payload.group]
        }
      }
    case 'REMOVE_GROUP': {
      const newGroups = state.form.groupsList?.filter((group) => group?.id !== action.payload.groupId)
      const currentItem = state.activeItem.data as FormSystemGroup
      const newActiveItem = state.form.stepsList?.find((step) => step?.guid === currentItem.stepGuid)
      return {
        ...state,
        activeItem: {
          type: 'Step',
          data: newActiveItem
        },
        form: {
          ...form,
          groupsList: newGroups
        }
      }
    }

    // Inputs
    case 'ADD_INPUT':
      return {
        ...state,
        activeItem: {
          type: 'Input',
          data: action.payload.input
        },
        form: {
          ...form,
          inputsList: [...(inputs || []), action.payload.input]
        }
      }
    case 'REMOVE_INPUT': {
      const newInputs = state.form.inputsList?.filter((input) => input?.id !== action.payload.inputId)
      const currentItem = state.activeItem.data as FormSystemInput
      const newActiveItem = state.form.groupsList?.find((group) => group?.guid === currentItem.groupGuid)
      return {
        ...state,
        activeItem: {
          type: 'Group',
          data: newActiveItem
        },
        form: {
          ...form,
          inputsList: newInputs
        }
      }
    }
    case 'CHANGE_INPUT_TYPE': {
      const { newValue, inputSettings, update } = action.payload;
      const newActive = {
        ...activeItem,
        data: {
          ...activeItem.data,
          type: newValue,
          inputSettings: inputSettings
        }
      }
      update(newActive)
      return {
        activeItem: newActive,
        form: {
          ...form,
          inputsList: inputs?.map(i => i?.guid === activeItem.data?.guid ? newActive.data : i)
        }
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
            [lang]: newValue
          }
        }
      };
      return {
        activeItem: newActive,
        form: {
          ...form,
          inputsList: inputs?.map(i => i?.guid === currentData?.guid ? newActive.data : i)
        }
      }
    }
    case 'CHANGE_IS_REQUIRED': {
      const currentData = activeItem.data as FormSystemInput
      console.log(currentData)
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          isRequired: !currentData?.isRequired
        }
      }
      action.payload.update(newActive)
      return {
        activeItem: newActive,
        form: {
          ...form,
          inputsList: inputs?.map(i => i?.guid === currentData?.guid ? newActive.data : i)
        }
      }
    }

    // Change
    case 'CHANGE_NAME': {
      const { lang, newValue } = action.payload;
      const newActive = {
        ...activeItem,
        data: {
          ...activeItem.data,
          name: {
            ...activeItem.data?.name,
            [lang]: newValue
          }
        }
      };
      const { type } = activeItem;
      let updatedList;
      if (type === 'Step') {
        updatedList = steps?.map(s => s?.guid === activeItem.data?.guid ? newActive.data : s);
      } else if (type === 'Group') {
        updatedList = groups?.map(g => g?.guid === activeItem.data?.guid ? newActive.data : g);
      } else if (type === 'Input') {
        updatedList = inputs?.map(i => i?.guid === activeItem.data?.guid ? newActive.data : i);
      }
      return {
        activeItem: newActive,
        form: {
          ...form,
          stepsList: type === 'Step' ? updatedList as FormSystemStep[] : form.stepsList,
          groupsList: type === 'Group' ? updatedList as FormSystemGroup[] : form.groupsList,
          inputsList: type === 'Input' ? updatedList as FormSystemInput[] : form.inputsList
        }
      }
    }
    case 'CHANGE_FORM_NAME': {
      const { lang, newValue } = action.payload;
      return {
        ...state,
        form: {
          ...form,
          name: {
            ...form.name,
            [lang]: newValue
          }
        }
      }
    }
    case 'CHANGE_APPLICATION_DAYS_TO_REMOVE': {
      return {
        ...state,
        form: {
          ...form,
          applicationsDaysToRemove: action.payload.value
        }
      }
    }
    case 'CHANGE_INVALIDATION_DATE': {
      return {
        ...state,
        form: {
          ...form,
          invalidationDate: action.payload.value
        }
      }
    }
    case 'CHANGE_FORM_SETTINGS': {
      return {
        ...state,
        form: action.payload.newForm
      }
    }
    // Drag and Drop
    case 'STEP_OVER_STEP': {
      const activeIndex = steps?.findIndex((step) => step?.guid === action.payload.activeId) as number
      const overIndex = steps?.findIndex((step) => step?.guid === action.payload.overId) as number
      const updatedSteps = arrayMove(steps || [], activeIndex, overIndex)
      return {
        ...state,
        form: {
          ...form,
          stepsList: updatedSteps.map((s, i) => ({ ...s, displayOrder: i }))
        }
      }
    }
    case 'GROUP_OVER_STEP': {
      const activeIndex = groups?.findIndex((group) => group?.guid === action.payload.activeId) as number
      const overIndex = steps?.findIndex((step) => step?.guid === action.payload.overId) as number
      const updatedGroups = groups?.map(group => ({ ...group })) as FormSystemGroup[]
      if (steps && steps[overIndex]) {
        updatedGroups[activeIndex].stepGuid = action.payload.overId as string
        updatedGroups[activeIndex].stepId = steps[overIndex]?.id as number
      }
      return {
        ...state,
        form: {
          ...form,
          groupsList: arrayMove(updatedGroups, activeIndex, overIndex).map((g, i) => ({ ...g, displayOrder: i }))
        }
      }
    }
    case 'GROUP_OVER_GROUP': {
      const activeIndex = groups?.findIndex((group) => group?.guid === action.payload.activeId) as number
      const overIndex = groups?.findIndex((group) => group?.guid === action.payload.overId) as number
      const updatedGroups = groups?.map(group => ({ ...group })) as FormSystemGroup[]
      if (updatedGroups[activeIndex] && updatedGroups[overIndex]) {
        if (updatedGroups[activeIndex].stepGuid !== updatedGroups[overIndex].stepGuid) {
          updatedGroups[activeIndex].stepGuid = updatedGroups[overIndex].stepGuid
          updatedGroups[activeIndex].stepId = updatedGroups[overIndex].stepId
          return {
            ...state,
            form: {
              ...form,
              groupsList: arrayMove(updatedGroups, activeIndex, overIndex - 1).map((g, i) => ({ ...g, displayOrder: i }))
            }
          }
        }
        return {
          ...state,
          form: {
            ...form,
            groupsList: arrayMove(updatedGroups, activeIndex, overIndex).map((g, i) => ({ ...g, displayOrder: i }))
          }
        }
      }
      return state
    }
    case 'INPUT_OVER_GROUP': {
      const activeIndex = inputs?.findIndex((input) => input?.guid === action.payload.activeId) as number
      const overIndex = groups?.findIndex((group) => group?.guid === action.payload.overId) as number
      const updatedInputs = inputs?.map(input => ({ ...input })) as FormSystemInput[]
      if (groups && groups[overIndex]) {
        updatedInputs[activeIndex].groupGuid = action.payload.overId as string
        updatedInputs[activeIndex].groupId = groups[overIndex]?.id as number
      }
      return {
        ...state,
        form: {
          ...form,
          inputsList: arrayMove(updatedInputs, activeIndex, overIndex).map((i, index) => ({ ...i, displayOrder: index }))
        }
      }
    }
    case 'INPUT_OVER_INPUT': {
      const activeIndex = inputs?.findIndex((input) => input?.guid === action.payload.activeId) as number
      const overIndex = inputs?.findIndex((input) => input?.guid === action.payload.overId) as number
      const updatedInputs = inputs?.map(input => ({ ...input })) as FormSystemInput[]
      if (updatedInputs[activeIndex] && updatedInputs[overIndex]) {
        if (updatedInputs[activeIndex].groupGuid !== updatedInputs[overIndex].groupGuid) {
          updatedInputs[activeIndex].groupGuid = updatedInputs[overIndex].groupGuid
          updatedInputs[activeIndex].groupId = updatedInputs[overIndex].groupId
          return {
            ...state,
            form: {
              ...form,
              inputsList: arrayMove(updatedInputs, activeIndex, overIndex - 1).map((i, index) => ({ ...i, displayOrder: index }))
            }
          }
        }
        return {
          ...state,
          form: {
            ...form,
            inputsList: arrayMove(updatedInputs, activeIndex, overIndex).map((i, index) => ({ ...i, displayOrder: index }))
          }
        }
      }
      return state
    }
    default:
      return state
  }
}

