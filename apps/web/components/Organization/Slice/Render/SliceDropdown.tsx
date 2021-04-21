import React, { useEffect, useState } from 'react'
import { Slice } from '@island.is/web/graphql/schema'
import { OrganizationSlice } from '@island.is/web/components'
import {
  GridColumn,
  GridContainer,
  GridRow,
  Option,
  Select,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'
import { ValueType } from 'react-select/src/types'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

interface SliceProps {
  slices: Slice[]
  sliceExtraText: string
}

interface DropdownOption {
  label: string
  value: string
  slug: string
}

export const SliceDropdown: React.FC<SliceProps> = ({
  slices,
  sliceExtraText,
}) => {
  const Router = useRouter()
  const [selectedId, setSelectedId] = useState<string>('')
  const options: DropdownOption[] = []
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
    setSelectedId(
      (options.find((x) => x.slug === hashString) ?? options[0]).value,
    )
  }, [Router, options])

  const selectedSlice = slices.find((x) => x.id === selectedId)

  return (
    <>
      <GridContainer>
        <GridRow>
          <GridColumn
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
              onChange={(option: ValueType<Option>) => {
                const slug = options.find(
                  (x) => x.value === (option as Option).value,
                )?.slug
                setSelectedId((option as Option).value as string)
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
        <OrganizationSlice key={selectedSlice.id} slice={selectedSlice} />
      )}
    </>
  )
}
