import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Tabs,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import DocumentCategories from './Categories'
import DocumentTypes from './Types'
import { AddTypeCategory } from '../../components/AddTypeCategory'
import {
  CategoryAndType,
  TabOptions,
  TypeCategoryContext,
} from './TypeCategoryContext'
import { useGetProvidersByNationalId } from '../../shared/useGetProvidersByNationalId'
import { DocumentProvidersLoading } from '../../components/DocumentProvidersLoading/DocumentProvidersLoading'

const CategoriesAndTypes = () => {
  const { formatMessage } = useLocale()
  const [currentTypeCategory, setCurrentTypeCategory] =
    useState<CategoryAndType>()
  const [activeTab, setActiveTab] = useState<TabOptions>('categories')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { loading, items: providers } = useGetProvidersByNationalId(
    undefined,
    undefined,
  )

  if (loading) {
    return <DocumentProvidersLoading />
  }

  return (
    <TypeCategoryContext.Provider
      value={{
        currentTypeCategory,
        activeTab,
        setCurrentTypeCategory,
        setActiveTab,
      }}
    >
      <>
        <Box marginBottom={[2, 3, 5]}>
          <IntroHeader
            title={formatMessage(m.catAndTypeTitle)}
            intro={formatMessage(m.catAndTypeDescription)}
          />
          <Box paddingBottom={3}>
            <Button
              variant="utility"
              size="small"
              onClick={() => setIsModalVisible(true)}
              icon="add"
            >
              {formatMessage(m.add, {
                add:
                  activeTab === 'types'
                    ? formatMessage(m.typeP)
                    : formatMessage(m.categoryP),
              })}
            </Button>
          </Box>
          <Tabs
            selected={activeTab}
            label={formatMessage(m.catAndTypeTitle)}
            onChange={(id: TabOptions) => setActiveTab(id)}
            tabs={[
              {
                id: 'categories',
                label: formatMessage(m.categories),
                content: (
                  <DocumentCategories
                    callback={() => setIsModalVisible(true)}
                  />
                ),
              },
              {
                id: 'types',
                label: formatMessage(m.types),
                content: (
                  <DocumentTypes callback={() => setIsModalVisible(true)} />
                ),
              },
            ]}
            contentBackground="white"
          />
        </Box>
      </>
      {isModalVisible && (
        <AddTypeCategory
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false)
            setCurrentTypeCategory(undefined)
          }}
        />
      )}
    </TypeCategoryContext.Provider>
  )
}

export default CategoriesAndTypes
