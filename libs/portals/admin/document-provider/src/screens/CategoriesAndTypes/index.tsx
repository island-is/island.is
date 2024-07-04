import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Tabs,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { documentProviderNavigation } from '../../lib/navigation'
import DocumentCategories from './Categories'
import DocumentTypes from './Types'
import { AddTypeCategory } from '../../components/AddTypeCategory'
import {
  CategoryAndType,
  TabOptions,
  TypeCategoryContext,
} from './TypeCategoryContext'

const CategoriesAndTypes = () => {
  const { formatMessage } = useLocale()
  const [currentTypeCategory, setCurrentTypeCategory] =
    useState<CategoryAndType>()
  const [activeTab, setActiveTab] = useState<TabOptions>('categories')
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <TypeCategoryContext.Provider
      value={{
        currentTypeCategory,
        activeTab,
        setCurrentTypeCategory,
        setActiveTab,
      }}
    >
      <GridContainer>
        <GridRow direction="row">
          <GridColumn
            span={['12/12', '5/12', '5/12', '3/12']}
            offset={['0', '7/12', '7/12', '0']}
          >
            <Box paddingBottom={4}>
              <PortalNavigation
                navigation={documentProviderNavigation}
                title={formatMessage(m.documentProviders)}
              />
            </Box>
          </GridColumn>
          <GridColumn
            paddingTop={[5, 5, 5, 2]}
            offset={['0', '0', '0', '1/12']}
            span={['12/12', '12/12', '12/12', '8/12']}
          >
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
          </GridColumn>
        </GridRow>
      </GridContainer>
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
