import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'
import { TabSection } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridColumnProps,
  GridRow,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { webRichText } from '@island.is/web/utils/richText'

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

  const selected = useMemo(() => {
    const index = slice.tabs?.findIndex(
      (tab) =>
        tab?.tabTitle && slugify(tab.tabTitle) === router?.query?.selectedTab,
    )
    if (index >= 0) {
      return String(index)
    }
    return undefined
  }, [router.query?.selectedTab, slice.tabs])

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <Box paddingTop={2} paddingBottom={[0, 4, 4]}>
        <Tabs
          selected={selected}
          onChange={(id) => {
            const index = Number(id)
            const tab = slice.tabs[index]
            if (!tab?.tabTitle) return

            router.push(
              {
                pathname: router.asPath.split('#')[0].split('?')[0],
                query: { ...router.query, selectedTab: slugify(tab.tabTitle) },
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
                  <Box paddingTop={[0, 4, 6]} paddingBottom={[8, 0, 6]}>
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
                    {tab.body && webRichText(tab.body)}
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
