import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

import {
  BoxProps,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  TableOfContents,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { SliceMachine } from '@island.is/web/components'
import { OneColumnText, Slice } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

interface SliceProps {
  slices: Slice[]
  sliceExtraText: string
  gridSpan?: SpanType
  gridOffset?: SpanType
  slicesAreFullWidth?: boolean
  dropdownMarginBottom?: BoxProps['marginBottom']
}

export const SliceTableOfContents: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({
  slices,
  sliceExtraText,
  gridSpan = ['9/9', '9/9', '7/9', '7/9', '4/9'],
  gridOffset = ['0', '0', '1/9'],
  slicesAreFullWidth = false,
  dropdownMarginBottom = 0,
}) => {
  const Router = useRouter()
  const [selectedId, setSelectedId] = useState('')
  const { activeLocale } = useI18n()
  const options = useMemo(() => {
    const options = []
    for (const slice of slices) {
      if (slice.__typename === 'OneColumnText') {
        options.push({
          headingTitle: slice.title,
          headingId: slice.id,
          slug: slugify(slice.title),
        })
      }
    }
    return options
  }, [slices])

  useEffect(() => {
    const hashString = window.location.hash.replace('#', '')
    if (!options.length) {
      return
    }

    setSelectedId(
      hashString
        ? options.find((x) => x.slug === hashString)?.headingId ?? ''
        : options[0].headingId,
    )
  }, [Router, options, setSelectedId])

  const selectedSlice = slices.find((x) => x.id === selectedId) as OneColumnText

  return (
    <Stack space={5}>
      <GridContainer>
        <GridRow marginBottom={dropdownMarginBottom}>
          <GridColumn span={gridSpan} offset={gridOffset}>
            <TableOfContents
              headings={options}
              tableOfContentsTitle={
                sliceExtraText ||
                (activeLocale === 'is' ? 'Efnisyfirlit' : 'Contents')
              }
              onClick={(id) => {
                const slug = options.find((x) => x.headingId === id)?.slug
                setSelectedId(id)
                Router.push(
                  {
                    pathname: Router.asPath.split('#')[0],
                    hash: slug,
                  },
                  undefined,
                  { shallow: true },
                )
              }}
              selectedHeadingId={selectedId}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      {!!selectedSlice && (
        <SliceMachine
          key={selectedSlice.id}
          slice={{
            ...selectedSlice,
            dividerOnTop: false,
            showTitle: true,
          }}
          namespace={{}}
          fullWidth={slicesAreFullWidth}
        />
      )}
    </Stack>
  )
}
