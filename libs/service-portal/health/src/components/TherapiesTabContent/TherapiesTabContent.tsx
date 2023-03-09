import React, { FC, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Text,
  Stack,
  Divider,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import { formatDate, UserInfoLine } from '@island.is/service-portal/core'
import { Therapies } from '@island.is/api/schema'
import { FootNote } from '../FootNote.tsx/FootNote'
import { ValueType } from 'react-select'
import { string } from 'zod'

interface Props {
  data: Therapies[]
}

type OptionType = {
  label: string
  value: string
}
export const TherapiesTabContent: FC<Props> = ({ data }) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [dropDownValue, setDropDownValue] = useState<OptionType>()
  let displayDropDown = false
  let dropDownOptions
  console.log(data)
  if (!data || data.length === 0) {
    return (
      <Box width="full" marginTop={4} display="flex" justifyContent="center">
        <Text variant="h5" as="h3">
          {formatMessage(messages.noData)}
        </Text>
      </Box>
    )
  }

  if (data.length > 1) {
    // Sjúkraþjálfun with more therapies, display dropdown
    displayDropDown = true
    dropDownOptions = data.map((item) => {
      return { label: item.name, value: item.id }
    })
    //setDropDownValue(dropDownOptions[0])
  }
  const content =
    displayDropDown && dropDownValue
      ? data.find((item) => item.id === dropDownValue.value) ?? data[0]
      : data[0]
  const from = content.periods?.find((x) => x.from !== null)?.from ?? ''
  const to = content.periods?.find((x) => x.to !== null)?.to ?? ''
  const timePeriod = [formatDate(from), formatDate(to)]
    .filter(Boolean)
    .join(' - ')
  const periods = content.periods
  console.log(dropDownValue)
  return (
    <Box width="full" marginTop={4}>
      {displayDropDown && dropDownOptions && (
        <Box>
          <Select
            label={formatMessage(messages.therapyType)}
            placeholder={formatMessage(messages.therapyType)}
            size="xs"
            name="therapy-select"
            options={dropDownOptions}
            onChange={(value) => {
              console.log('onChangeValue', value)
              setDropDownValue(value as OptionType)
            }}
            value={dropDownValue ? dropDownValue : dropDownOptions[0]}
          />
        </Box>
      )}
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(messages.informationAboutStatus)}
          label={formatMessage(messages.timePeriod)}
          content={timePeriod}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.status)}
          content={content.state?.display}
        />
        <Divider />

        <UserInfoLine
          label={formatMessage(messages.usedTherapySessions)}
          content={periods
            ?.find((x) => x.sessions?.used)
            ?.sessions?.used.toString()}
        />
        <Divider />

        <UserInfoLine
          label={formatMessage(messages.totalTherapySessions)}
          content={periods
            ?.find((x) => x.sessions?.available)
            ?.sessions?.available.toString()}
        />
        <Divider />
      </Stack>
      <FootNote therapyType={data[0].id.toString()} />
    </Box>
  )
}

export default TherapiesTabContent
