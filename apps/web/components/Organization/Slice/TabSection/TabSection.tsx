import React from 'react'
import { TabSection } from '@island.is/web/graphql/schema'
import { Box, GridColumn, GridRow, Tabs, Text } from '@island.is/island-ui/core'
import * as styles from '@island.is/web/screens/Organization/Organization.treat'
import {
  renderSlices,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'

interface SliceProps {
  slice: TabSection
}

export const TabSectionSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <Box paddingTop={2} paddingBottom={[0, 4, 4]}>
        <Tabs
          label={slice?.title}
          tabs={slice?.tabs.map((tab) => ({
            label: tab.tabTitle,
            content: (
              <GridRow>
                <GridColumn
                  span={['9/9', '9/9', '9/9', '7/9']}
                  offset={[null, null, null, '1/9']}
                >
                  <Box paddingTop={[0, 4, 9]} paddingBottom={[8, 0, 9]}>
                    <img
                      src={tab.image.url}
                      className={styles.tabSectionImg}
                      alt=""
                    />
                    <Text variant="h2" as="h2" marginBottom={3}>
                      {tab.contentTitle}
                    </Text>
                    {tab.body &&
                      renderSlices((tab.body as unknown) as SliceType)}
                  </Box>
                </GridColumn>
              </GridRow>
            ),
          }))}
          contentBackground="white"
        />
      </Box>
    </section>
  )
}
