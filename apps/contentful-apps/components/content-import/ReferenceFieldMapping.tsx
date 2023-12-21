import { Dispatch, SetStateAction, useEffect } from 'react'
import { ContentTypeProps } from 'contentful-management'
import { FormControl, Text } from '@contentful/f36-components'
import { Grid, Stack } from '@contentful/f36-core'

import { Select as IslandUISelect } from '@island.is/island-ui/core'

import { isReferenceField } from './utils'

interface ReferenceFieldMappingProps {
  contentTypeData: ContentTypeProps
  referenceFieldMapping: { from: string; to: string }[]
  setReferenceFieldMapping: Dispatch<
    SetStateAction<ReferenceFieldMappingProps['referenceFieldMapping']>
  >
}

export const ReferenceFieldMapping = ({
  contentTypeData,
  referenceFieldMapping,
  setReferenceFieldMapping,
}: ReferenceFieldMappingProps) => {
  useEffect(() => {
    if (!contentTypeData) return
    setReferenceFieldMapping(
      contentTypeData.fields
        .filter((field) => isReferenceField(field))

        .map((field) => {
          return {
            from: field.name,
            to: '',
          }
        }),
    )
  }, [contentTypeData, setReferenceFieldMapping])

  return (
    <FormControl>
      <FormControl.Label>Reference fields</FormControl.Label>
      <Stack flexDirection="column" spacing="spacingL">
        {referenceFieldMapping.map(({ from, to }, index) => {
          const key = `${from}-${to}`
          return (
            <Grid key={key} columns="1fr 1fr">
              <Text>{from}</Text>

              <IslandUISelect options={[]} />

              {/* <Select
                id={key}
                name={key}
                value={to}
                onChange={(ev) => {
                  setReferenceFieldMapping((prev) => {
                    const alreadyPresentIndex = prev.findIndex(
                      (e) => e.to === ev.target.value,
                    )
                    if (alreadyPresentIndex >= 0) {
                      prev[alreadyPresentIndex].to = undefined
                    }
                    prev[index].to = ev.target.value
                    return [...prev]
                  })
                }}
              >
                <Select.Option value={null}>-</Select.Option>
                {['TODO'].map((text) => (
                  <Select.Option key={text} value={text}>
                    {text}
                  </Select.Option>
                ))}
              </Select> */}
            </Grid>
          )
        })}
      </Stack>
    </FormControl>
  )
}
