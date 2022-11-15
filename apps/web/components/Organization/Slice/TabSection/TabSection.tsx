import React from 'react'
import { useRouter } from 'next/router'
import { TabSection } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridColumnProps,
  GridRow,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { richText, Slice as SliceType } from '@island.is/island-ui/contentful'
import { PowerBiSlice } from '../PowerBiSlice'

import * as styles from '@island.is/web/screens/Organization/Organization.css'

interface SliceProps {
  slice: TabSection
  contentColumnProps?: GridColumnProps
}

export const TabSectionSlice: React.FC<SliceProps> = ({
  slice,
  contentColumnProps = {
    span: ['9/9', '9/9', '9/9', '7/9'],
    offset: [null, null, null, '1/9'],
  },
}) => {
  const router = useRouter()

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <Box paddingTop={2} paddingBottom={[0, 4, 4]}>
        <Tabs
          selected={router.query?.selectedTab as string}
          onChange={(id) => {
            router.push(
              {
                pathname: router.asPath.split('#')[0].split('?')[0],
                query: { selectedTab: id },
              },
              undefined,
              { shallow: true },
            )
          }}
          label={slice?.title}
          tabs={slice?.tabs.map((tab) => ({
            label: tab.tabTitle,
            content: (
              <GridRow>
                <GridColumn {...contentColumnProps}>
                  <Box paddingTop={[0, 4, 9]} paddingBottom={[8, 0, 9]}>
                    {tab.image?.url && (
                      <img
                        src={tab.image.url}
                        className={styles.tabSectionImg}
                        alt=""
                      />
                    )}
                    <Text variant="h2" as="h2" marginBottom={3}>
                      {tab.contentTitle}
                    </Text>
                    {tab.body &&
                      richText(tab.body as SliceType[], {
                        renderComponent: {
                          PowerBiSlice: (slice) => (
                            <PowerBiSlice slice={slice} />
                          ),
                        },
                      })}
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
