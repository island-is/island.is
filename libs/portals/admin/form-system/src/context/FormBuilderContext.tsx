import { FocusEvent, SetStateAction, createContext } from 'react'
import {
  ActiveItem,
  IFormBuilder,
  IFormBuilderContext,
  IGroup,
  IInput,
  IListItem,
  IStep,
  NavbarSelectStatus,
  ILists
} from '../types/interfaces'

const FormBuilderContext = createContext<IFormBuilderContext>({
  // formBuilder: {} as IFormBuilder,
  // formDispatch: function (_value: unknown): void {
  //   throw new Error('Function not implemented.')
  // },
  // lists: {
  //   activeItem: {} as ActiveItem,
  //   steps: [] as IStep[],
  //   groups: [] as IGroup[],
  //   inputs: [] as IInput[],
  // },
  lists: {} as ILists,
  formUpdate: async function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  inSettings: false,
  setInSettings: function (_value: SetStateAction<boolean>): void {
    throw new Error('Function not implemented.')
  },
  setSelectStatus: function (_value: SetStateAction<NavbarSelectStatus>): void {
    throw new Error('Function not implemented.')
  },
  selectStatus: NavbarSelectStatus.OFF,
  setActiveListItem: function (_value: SetStateAction<IListItem | null>): void {
    throw new Error('Function not implemented.')
  },
  blur: function (
    _e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ): void {
    throw new Error('Function not implemented.')
  },
  onFocus: function (_e: string): void {
    throw new Error('Function not implemented.')
  },
})

export default FormBuilderContext
