import {
  DocumentProviderCategory,
  DocumentProviderType,
} from '@island.is/api/schema'
import { createContext } from 'react'

export type CategoryAndType = Partial<
  DocumentProviderCategory | DocumentProviderType
>

export type TabOptions = 'categories' | 'types'

export type TypeCategoryStateProps = {
  currentTypeCategory?: CategoryAndType
  activeTab?: TabOptions
  setCurrentTypeCategory: React.Dispatch<
    React.SetStateAction<CategoryAndType | undefined>
  >
  setActiveTab: React.Dispatch<React.SetStateAction<TabOptions>>
}

const initialTypeCategory: CategoryAndType = {
  id: undefined,
  name: undefined,
  active: undefined,
}

const initalTab: TabOptions = 'categories'

export const TypeCategoryContext = createContext<TypeCategoryStateProps>({
  currentTypeCategory: undefined,
  activeTab: undefined,
  setCurrentTypeCategory: () => initialTypeCategory,
  setActiveTab: () => initalTab,
})
