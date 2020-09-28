/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'

export type MenuTabsProps = {
  [key: string]: any
}

export interface MenuTabsContextProps {
  menuTabs: MenuTabsProps
}

export const MenuTabsContext = createContext<MenuTabsContextProps>({
  menuTabs: {},
})
