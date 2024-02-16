import { ChangeEvent, FocusEvent, SetStateAction, createContext } from 'react'
import {
  ActiveItem,
  IFormBuilder,
  IFormBuilderContext,
  IListItem,
  NavbarSelectStatus,
} from '../types/interfaces'

const FormBuilderContext = createContext<IFormBuilderContext>({
  formBuilder: {} as IFormBuilder,
  formDispatch: function (_value: unknown): void {
    throw new Error('Function not implemented.')
  },
  lists: {
    activeItem: {} as ActiveItem,
    steps: [],
    groups: [],
    inputs: [],
  },
  listsDispatch: function (_value: unknown): void {
    throw new Error('Function not implemented.')
  },
  formUpdate: async function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  setIsTyping: function (_value: SetStateAction<boolean>): void {
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
  changeSelectHandler: function (_e: unknown): void {
    throw new Error('Function not implemented.')
  },
  changeHandler: function (
    _e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    _propertyName: string,
  ): void {
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
