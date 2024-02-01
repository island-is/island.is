import { arrayMove } from '@dnd-kit/sortable'
import {
  ItemType,
  IGroup,
  IInput,
  IInputSettings,
  IListItem,
  ILists,
  IStep,
  ActiveItem,
  ILanguage,
} from '../types/interfaces'
import { UniqueIdentifier } from '@dnd-kit/core'
import { uuid } from 'uuidv4'
import { updateItem } from '../services/apiService'

export type ILang = 'is' | 'en'

type DndAction =
  | {
      type: 'stepOverStep'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'groupOverStep'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'groupOverGroup'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'inputOverGroup'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'inputOverInput'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }
  | {
      type: 'listItemOverListItem'
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
    }

type AddRemoveAction =
  | { type: 'addStep'; payload: { data: IStep } }
  | { type: 'addGroup'; payload: { data: IGroup } }
  | { type: 'addInput'; payload: { data: IInput } }
  | { type: 'removeStep'; payload: { guid: UniqueIdentifier } }
  | { type: 'removeGroup'; payload: { guid: UniqueIdentifier } }
  | { type: 'removeInput'; payload: { guid: UniqueIdentifier } }
  | { type: 'addListItem' }
  | { type: 'removeListItem'; payload: { guid: UniqueIdentifier } }
  | {
      type: 'addInputRelevantParty'
      payload: { data: IInput; type: string; name: ILanguage }
    }

type ChangeAction =
  | {
      type: 'changeName'
      payload: {
        activeType: ItemType
        index: number
        lang: ILang
        newValue: string
      }
    }
  | {
      type: 'changeInputType'
      payload: {
        index: number
        newValue: string | number
        inputSettings: unknown
      }
    }
  | {
      type: 'setIsRequired'
      payload: { guid: UniqueIdentifier; isRequired: boolean }
    }
  | { type: 'setDescription'; payload: { lang: ILang; newValue: string } }
  | {
      type: 'changeInputName'
      payload: { guid: UniqueIdentifier; lang: ILang; newValue: string }
    }

type ControlAction =
  | {
      type: 'setActiveItem'
      payload: { type: ItemType; data: IStep | IGroup | IInput }
    }
  | { type: 'setActiveListItem'; payload: { listItem: IListItem } }

type InputSettingsAction =
  | { type: 'timeInterval'; payload: { data: number } }
  | { type: 'setInputSettings'; payload: { inputSettings: IInputSettings } }
  | {
      type: 'setMessageWithLinkSettings'
      payload: {
        property: 'hnapptexti' | 'url' | 'erHlekkur'
        value?: string
        checked?: boolean
        lang: ILang
      }
    }
  | {
      type: 'setFileUploadSettings'
      payload: {
        property: 'erFjolval' | 'fjoldi' | 'hamarksstaerd' | 'tegundir'
        checked?: boolean
        value: number | string
      }
    }
  | {
      type: 'setNumberInputSettings'
      payload: {
        property: 'lagmarkslengd' | 'hamarkslengd' | 'laggildi' | 'hagildi'
        value: number
      }
    }
  | {
      type: 'setListItemSelected'
      payload: { guid: UniqueIdentifier; checked: boolean }
    }
  | {
      type: 'setListItem'
      payload: {
        property: 'text' | 'description'
        lang: ILang
        value: string
        listItemGuid: UniqueIdentifier
      }
    }
  | { type: 'setMultiSet'; payload: { checked: boolean } }
  | {
      type: 'setRelevantPartiesSettings'
      payload: { property: 'type' | 'name'; lang?: ILang; type: string }
    }

export type Action =
  | DndAction
  | AddRemoveAction
  | ChangeAction
  | ControlAction
  | InputSettingsAction

export const listsReducer = (lists: ILists, action: Action): ILists => {
  const types = {
    Step: 'steps',
    Group: 'groups',
    Input: 'inputs',
  }
  const { activeItem, steps, groups, inputs } = lists
  //const activeIndex = lists[types[activeItem.type]].findIndex((e) => e.guid === activeItem.data.guid)

  const addNewInput = (newInput: IInput, toSave: boolean) => {
    toSave && updateItem('Input', newInput)
    return {
      ...lists,
      activeItem: {
        ...activeItem,
        data: newInput,
      },
      inputs: inputs.map((i) =>
        i.guid === activeItem.data.guid ? newInput : i,
      ),
    }
  }

  switch (action.type) {
    // case actions.initialize: {
    //   return action.payload
    // }

    // DnD control
    case 'stepOverStep': {
      const activeIndex = steps.findIndex(
        (s) => s.guid === action.payload.activeId,
      )
      const overIndex = steps.findIndex((s) => s.guid === action.payload.overId)
      const updatedSteps = arrayMove(steps, activeIndex, overIndex)
      return {
        ...lists,
        steps: updatedSteps,
      }
    }
    case 'groupOverStep': {
      const activeIndex = groups.findIndex(
        (g) => g.guid === action.payload.activeId,
      )
      const overIndex = steps.findIndex((s) => s.guid === action.payload.overId)

      const updatedGroup = groups
      updatedGroup[activeIndex].stepGuid = action.payload.overId
      updatedGroup[activeIndex].stepId = steps[overIndex].id

      return {
        ...lists,
        groups: arrayMove(updatedGroup, activeIndex, activeIndex),
      }
    }
    case 'groupOverGroup': {
      const activeIndex = groups.findIndex(
        (g) => g.guid === action.payload.activeId,
      )
      const overIndex = groups.findIndex(
        (g) => g.guid === action.payload.overId,
      )

      const updatedGroup = groups
      if (
        updatedGroup[activeIndex].stepGuid !== updatedGroup[overIndex].stepGuid
      ) {
        updatedGroup[activeIndex].stepGuid = updatedGroup[overIndex].stepGuid
        updatedGroup[activeIndex].stepId = updatedGroup[overIndex].stepId
        return {
          ...lists,
          groups: arrayMove(updatedGroup, activeIndex, overIndex - 1),
        }
      }
      return {
        ...lists,
        groups: arrayMove(updatedGroup, activeIndex, overIndex),
      }
    }
    case 'inputOverGroup': {
      const activeIndex = inputs.findIndex(
        (i) => i.guid === action.payload.activeId,
      )
      const overIndex = groups.findIndex(
        (g) => g.guid === action.payload.overId,
      )

      const updatedInput = inputs
      updatedInput[activeIndex].groupGuid = action.payload.overId
      updatedInput[activeIndex].groupId = groups[overIndex].id
      return {
        ...lists,
        inputs: arrayMove(updatedInput, activeIndex, activeIndex),
      }
    }
    case 'inputOverInput': {
      const activeIndex = inputs.findIndex(
        (i) => i.guid === action.payload.activeId,
      )
      const overIndex = inputs.findIndex(
        (i) => i.guid === action.payload.overId,
      )

      const updatedInput = inputs
      if (
        updatedInput[activeIndex].groupGuid !==
        updatedInput[overIndex].groupGuid
      ) {
        updatedInput[activeIndex].groupGuid = updatedInput[overIndex].groupGuid
        updatedInput[activeIndex].groupId = updatedInput[overIndex].groupId
        return {
          ...lists,
          inputs: arrayMove(updatedInput, activeIndex, overIndex - 1),
        }
      }
      return {
        ...lists,
        inputs: arrayMove(updatedInput, activeIndex, overIndex),
      }
    }
    case 'listItemOverListItem': {
      const input = activeItem.data as IInput
      const { listi: list } = input.inputSettings
      if (list === undefined) {
        return lists
      }
      const activeIndex = list.findIndex(
        (l) => l.guid === action.payload.activeId,
      )
      const overIndex = list.findIndex((l) => l.guid === action.payload.overId)
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          listi: arrayMove(list, activeIndex, overIndex).map((l, i) => ({
            ...l,
            displayOrder: i,
          })),
        },
      }
      return addNewInput(newInput, false)
    }

    // DnD control - end
    // Add
    case 'addStep': {
      return {
        ...lists,
        activeItem: {
          type: 'Step',
          data: action.payload.data,
        },
        steps: [...steps, action.payload.data],
      }
    }
    case 'addGroup': {
      return {
        ...lists,
        activeItem: {
          type: 'Group',
          data: action.payload.data,
        },
        groups: [...groups, action.payload.data],
      }
    }
    case 'addInput': {
      return {
        ...lists,
        activeItem: {
          type: 'Input',
          data: action.payload.data,
        },
        inputs: [...inputs, action.payload.data],
      }
    }
    case 'addInputRelevantParty': {
      const newInput = {
        ...action.payload.data,
        name: action.payload.name,
        type: 'Aðili',
        inputSettings: {
          $type: 'adili',
          type: action.payload.type,
        },
      }
      updateItem('Input', newInput)
      return {
        ...lists,
        inputs: [...inputs, newInput],
      }
    }
    //Add - end
    // Remove
    case 'removeStep': {
      return {
        ...lists,
        steps: steps.filter((s) => s.guid !== action.payload.guid),
      }
    }
    case 'removeGroup': {
      return {
        ...lists,
        groups: groups.filter((g) => g.guid !== action.payload.guid),
      }
    }
    case 'removeInput': {
      return {
        ...lists,
        inputs: inputs.filter((i) => i.guid !== action.payload.guid),
      }
    }
    // Remove - end

    // ChangeHandlers
    case 'changeName': {
      const updatedList = [...lists[types[activeItem.type]]]
      const activeIndex = lists[types[activeItem.type]].findIndex(
        (e: { guid: UniqueIdentifier }) => e.guid === activeItem.data.guid,
      )
      updatedList[activeIndex] = {
        ...lists[types[activeItem.type]][activeIndex],
        name: {
          ...lists[types[activeItem.type]][activeIndex].name,
          [action.payload.lang]: action.payload.newValue,
        },
      }

      const newActive = {
        type: activeItem.type,
        data: updatedList[activeIndex],
      }
      return {
        ...lists,
        activeItem: newActive,
        [types[activeItem.type]]: updatedList,
      }
    }
    case 'changeInputType': {
      const activeIndex = lists[types[activeItem.type]].findIndex(
        (e: { guid: UniqueIdentifier }) => e.guid === activeItem.data.guid,
      )
      const newInputs = [...inputs]

      newInputs[activeIndex] = {
        ...inputs[activeIndex],
        type: action.payload.newValue as string,
        inputSettings: action.payload.inputSettings,
      }

      const newActive: ActiveItem = {
        type: 'Input',
        data: newInputs[activeIndex],
      }

      updateItem(newActive.type, newActive.data)

      return {
        ...lists,
        activeItem: newActive,
        inputs: newInputs,
      }
    }
    case 'setDescription': {
      const input = activeItem.data as IInput
      const newInput = {
        ...input,
        description: {
          ...input.description,
          [action.payload.lang]: action.payload.newValue,
        },
      }
      return {
        ...lists,
        activeItem: {
          ...activeItem,
          data: newInput,
        },
        inputs: inputs.map((i) => {
          if (i.guid === input.guid) {
            return newInput
          }
          return i
        }),
      }
    }
    case 'changeInputName': {
      const { guid, lang, newValue } = action.payload
      const currentInput = inputs.find((i) => i.guid === guid)
      const newInput = {
        ...currentInput,
        name: {
          ...currentInput.name,
          [lang]: newValue,
        },
      }
      return {
        ...lists,
        inputs: inputs.map((i) => {
          if (i.guid === guid) {
            return newInput
          }
          return i
        }),
      }
    }

    case 'setActiveItem': {
      return {
        ...lists,
        activeItem: {
          type: action.payload.type,
          data: action.payload.data,
        },
      }
    }
    case 'setIsRequired': {
      return {
        ...lists,
        activeItem: {
          ...activeItem,
          data: {
            ...activeItem.data,
            isRequired: action.payload.isRequired,
          },
        },
        inputs: inputs.map((i) => {
          if (i.guid === action.payload.guid) {
            const newInput = {
              ...i,
              isRequired: action.payload.isRequired,
            }
            updateItem('Input', newInput)
            return newInput
          }
          return i
        }),
      }
    }
    case 'timeInterval': {
      if (activeItem.type === 'Input') {
        const inputItem = activeItem.data as IInput
        return {
          ...lists,
          activeItem: {
            ...activeItem,
            data: {
              ...activeItem.data,
              inputSettings: {
                ...inputItem.inputSettings,
                interval: action.payload.data,
              },
            },
          },
          inputs: inputs.map((i) => {
            if (i.guid === activeItem.data.guid) {
              const newInput = {
                ...i,
                inputSettings: {
                  ...i.inputSettings,
                  interval: action.payload.data,
                },
              }
              updateItem('Input', newInput)
              return newInput
            }
            return i
          }),
        }
      }
      break
    }
    case 'setMessageWithLinkSettings': {
      const input: IInput = activeItem.data as IInput

      const { payload } = action
      if ('property' in payload) {
        // dont know why but typescript was inferring payload : {data: number;}
        const { property, lang, value, checked } = payload

        const updateMessageLink = (
          property: string,
          value: string | undefined,
        ) => {
          return {
            ...input.inputSettings,
            [property]: {
              ...input.inputSettings[property],
              [lang]: value,
            },
          }
        }

        const newInput = {
          ...input,
          inputSettings: {
            ...input.inputSettings,
            [property]: property === 'erHlekkur' ? checked : value,
            ...(property === 'hnapptexti'
              ? updateMessageLink(property, value)
              : {}),
          },
        }
        if (property === 'erHlekkur') {
          updateItem('Input', newInput)
        }
        return {
          ...lists,
          activeItem: {
            ...activeItem,
            data: newInput,
          },
          inputs: inputs.map((i) =>
            i.guid === activeItem.data.guid ? newInput : i,
          ),
        }
      }
      break
    }

    // "inputSettings": {
    //   "$type": "skjal",
    //   "tegundir": [],
    //   "hamarksstaerd": 10,
    //   "erFjolval": false,
    //   "fjoldi": 20
    // }
    case 'setFileUploadSettings': {
      const input = activeItem.data as IInput
      const { payload } = action

      if (
        !payload ||
        !('property' in payload) ||
        !('checked' in payload) ||
        !('value' in payload)
      ) {
        throw new Error('Invalid payload')
      }

      const { property, checked, value } = payload

      const updateFileTypesArray = () => {
        const currentTegundir = input.inputSettings.tegundir || []
        if (checked) {
          return [...currentTegundir, value as string]
        } else {
          return currentTegundir.filter((t) => t !== value)
        }
      }
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          [property]: property === 'tegundir' ? updateFileTypesArray() : value,
        },
      }
      updateItem('Input', newInput)
      return {
        ...lists,
        activeItem: {
          ...activeItem,
          data: newInput,
        },
        inputs: inputs.map((i) =>
          i.guid === activeItem.data.guid ? newInput : i,
        ),
      }
    }

    case 'setNumberInputSettings': {
      const input = activeItem.data as IInput
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          [action.payload.property]: action.payload.value,
        },
      }
      return {
        ...lists,
        activeItem: {
          ...activeItem,
          data: newInput,
        },
        inputs: inputs.map((i) =>
          i.guid === activeItem.data.guid ? newInput : i,
        ),
      }
    }

    case 'addListItem': {
      const input = activeItem.data as IInput
      const list = input.inputSettings.listi || []
      const newListItem = {
        guid: uuid(),
        label: {
          is: '',
          en: '',
        },
        description: {
          is: '',
          en: '',
        },
        isSelected: false,
        displayOrder: list.length,
      }

      const newInput: IInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          listi: [...list, newListItem],
        },
      }
      return addNewInput(newInput, true)
    }

    case 'setListItemSelected': {
      const input = activeItem.data as IInput
      const list = input.inputSettings.listi || []
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          listi: list.map((l) =>
            l.guid === action.payload.guid
              ? { ...l, isSelected: !l.isSelected }
              : { ...l, isSelected: false },
          ),
        },
      }
      return addNewInput(newInput, true)
    }

    case 'removeListItem': {
      const input = activeItem.data as IInput
      const list = input.inputSettings.listi || []
      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          listi: list.filter((l) => l.guid !== action.payload.guid),
        },
      }
      return addNewInput(newInput, true)
    }

    case 'setListItem': {
      const input = activeItem.data as IInput
      const { payload } = action
      const { property, lang, value, listItemGuid } = payload
      const list = input.inputSettings.listi || []

      const newInput = {
        ...input,
        inputSettings: {
          ...input.inputSettings,
          listi: list.map((l) => {
            if (l.guid === listItemGuid) {
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
      console.log('newInput', newInput)
      return addNewInput(newInput, false)
    }

    case 'setActiveListItem': {
      return {
        ...lists,
        activeListItem: action.payload.listItem,
      }
    }

    // MultiSet boolean??
    case 'setMultiSet': {
      const group = activeItem.data as IGroup
      const newGroup = {
        ...group,
        multiSet: action.payload.checked ? 10 : 0,
      }
      updateItem('Group', newGroup)
      return {
        ...lists,
        activeItem: {
          ...activeItem,
          data: newGroup,
        },
        groups: lists.groups.map((g) =>
          g.guid === activeItem.data.guid ? newGroup : g,
        ),
      }
    }

    case 'setInputSettings': {
      const { inputSettings } = action.payload
      const input = activeItem.data as IInput
      const newInput = {
        ...input,
        inputSettings: inputSettings,
      }
      updateItem('Input', newInput)
      return {
        ...lists,
        activeItem: {
          ...activeItem,
          data: newInput,
        },
        inputs: inputs.map((i) =>
          i.guid === activeItem.data.guid ? newInput : i,
        ),
      }
    }

    default:
      return lists
  }
}
