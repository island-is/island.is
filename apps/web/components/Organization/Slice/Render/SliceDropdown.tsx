import React, { useEffect, useState } from 'react'
import { Slice } from '@island.is/web/graphql/schema'
import { OrganizationSlice } from '@island.is/web/components'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'
import { ActionMeta, ValueType } from 'react-select/src/types'

interface SliceProps {
  slices: Slice[]
  sliceExtraText: string
}

interface OptionItem extends Option {
  slug: string
}

export const SliceDropdown: React.FC<SliceProps> = ({
  slices,
  sliceExtraText,
}) => {
  const Router = useRouter()
  const [selectedId, setSelectedId] = useState<string>('')
  const options: OptionItem[] = []
  for (const slice of slices) {
    if (slice.__typename === 'OneColumnText') {
      options.push({
        label: slice.title,
        value: slice.id,
        slug: slugify(slice.title),
      })
    }
  }

  useEffect(() => {
    const hashString = window.location.hash.replace('#', '')
    const option = options.find((x: OptionItem) => x.slug === hashString)
    const value = hashString ? option?.value : options[0].value
    setSelectedId(String(value))
  }, [Router, options])

  const selectedSlice = slices.find((x) => x.id === selectedId)

  console.log('options', options)
  return (
    <>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingTop={[4, 4, 0]}
            paddingBottom={[4, 4, 6]}
            span={['12/12', '12/12', '12/12', '12/12', '7/12']}
          >
            <Select
              backgroundColor="white"
              icon="chevronDown"
              size="sm"
              isSearchable
              label={sliceExtraText}
              name="select1"
              options={options}
              value={options.find((x) => x.value === selectedId)}
              onChange={(value: ValueType<Option>) => {
                const option = options.find(
                  (x) => x.value === (value as Option).value,
                )
                const slug = option?.slug
                setSelectedId(String(value))
                Router.replace(
                  window.location.protocol +
                    '//' +
                    window.location.host +
                    window.location.pathname +
                    `#${slug}`,
                )
              }}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      {!!selectedSlice && (
        <OrganizationSlice
          key={selectedSlice.id}
          slice={selectedSlice}
          namespace={undefined}
        />
      )}
    </>
  )
}
