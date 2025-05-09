import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import slugify from '@sindresorhus/slugify'

import {
  Box,
  GridColumnProps,
  ResponsiveSpace,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import {
  GetTabSectionQuery,
  QueryGetTabSectionArgs,
  TabSection,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import * as styles from '@island.is/web/screens/Organization/Organization.css'
import { GET_TAB_SECTION_QUERY } from '@island.is/web/screens/queries/TabSection'
import { webRichText } from '@island.is/web/utils/richText'

interface SliceProps {
  slice: TabSection
  contentColumnProps?: GridColumnProps
  contentPaddingTop?: ResponsiveSpace
  contentPaddingBottom?: ResponsiveSpace
  containerPaddingTop?: ResponsiveSpace
  containerPaddingBottom?: ResponsiveSpace
}

export const TabSectionSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
  contentPaddingTop = [0, 4, 6],
  contentPaddingBottom = [8, 0, 6],
  containerPaddingBottom = [0, 4, 4],
  containerPaddingTop = 2,
}) => {
  const [tabSection, setTabSection] = useState(slice)
  const router = useRouter()
  const { activeLocale } = useI18n()

  const selected = useMemo(() => {
    const index = tabSection?.tabs?.findIndex(
      (tab) =>
        tab?.tabTitle && slugify(tab.tabTitle) === router.query?.selectedTab,
    )
    if (index >= 0) {
      return String(index)
    }
    return undefined
  }, [router.query?.selectedTab, tabSection?.tabs])

  useQuery<GetTabSectionQuery, QueryGetTabSectionArgs>(GET_TAB_SECTION_QUERY, {
    variables: {
      input: {
        id: tabSection?.id,
        lang: activeLocale,
      },
    },
    onCompleted(data) {
      if (data?.getTabSection?.tabs?.length) {
        setTabSection(data.getTabSection as TabSection)
      }
    },
  })

  return (
    <section
      key={tabSection.id}
      id={tabSection.id}
      aria-labelledby={'sliceTitle-' + tabSection.id}
    >
      <Box
        paddingTop={containerPaddingTop}
        paddingBottom={containerPaddingBottom}
      >
        <Tabs
          selected={selected}
          onChange={(id) => {
            const index = Number(id)
            const tab = tabSection.tabs[index]
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
          label={tabSection.title}
          tabs={tabSection.tabs?.map((tab) => ({
            label: tab?.tabTitle,
            content: (
              <Box
                paddingTop={contentPaddingTop}
                paddingBottom={contentPaddingBottom}
              >
                {tab?.image?.url && (
                  <img
                    src={tab.image.url}
                    className={styles.tabSectionImg}
                    alt={tab.image.description ?? ''}
                  />
                )}
                <Text variant="h2" as="h2" marginBottom={3}>
                  {tab?.contentTitle}
                </Text>
                {tab?.body && webRichText(tab.body)}
              </Box>
            ),
          }))}
          contentBackground="white"
        />
      </Box>
    </section>
  )
}
