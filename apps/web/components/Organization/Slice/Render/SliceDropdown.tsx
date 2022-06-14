import React, { useEffect, useMemo, useState } from 'react'
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

interface SliceProps {
  slices: Slice[]
  sliceExtraText: string
}

export const SliceDropdown: React.FC<SliceProps> = ({
  slices,
  sliceExtraText,
}) => {
  const Router = useRouter()
  const [selectedId, setSelectedId] = useState<string>('')
  const options = useMemo(() => {
    const options = []
    for (const slice of slices) {
      if (slice.__typename === 'OneColumnText') {
        options.push({
          label: slice.title,
          value: slice.id,
          slug: slugify(slice.title),
        })
      }
    }
    return options
  }, [slices])

  useEffect(() => {
    const hashString = window.location.hash.replace('#', '')
    setSelectedId(
      hashString
        ? options.find((x) => x.slug === hashString).value
        : options[0].value,
    )
  }, [Router, options])

  const selectedSlice = slices.find((x) => x.id === selectedId)

  return (
    <>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingBottom={[4, 4, 6]}
            span={['9/9', '9/9', '7/9', '7/9', '4/9']}
            offset={['0', '0', '1/9']}
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
              onChange={({ value }: Option) => {
                const slug = options.find((x) => x.value === value).slug
                setSelectedId(String(value))
                Router.push(
                  {
                    pathname: Router.asPath.split('#')[0],
                    hash: slug,
                  },
                  undefined,
                  { shallow: true },
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
          namespace={null}
        />
      )}
    </>
  )
}
