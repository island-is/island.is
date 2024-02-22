import React from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
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

const CategoriesAndTypes = () => {
  const { formatMessage } = useLocale()

  return (
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
            <Tabs
              selected="categories"
              label={formatMessage(m.catAndTypeTitle)}
              tabs={[
                {
                  id: 'categories',
                  label: formatMessage(m.categories),
                  content: <DocumentCategories />,
                },
                {
                  id: 'types',
                  label: formatMessage(m.types),
                  content: <DocumentTypes />,
                },
              ]}
              contentBackground="white"
            />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default CategoriesAndTypes
