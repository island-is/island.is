import React, { FC, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Text, Stack, Divider, Select } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import { formatDate, UserInfoLine } from '@island.is/service-portal/core'

import { FootNote } from '../FootNote.tsx/FootNote'
import * as styles from './TherapiesTabContent.css'
import { formatNumberToString } from '../../utils/format'
import { TherapyStatus } from '../../utils/constants'
import LinkButton from '../LinkButton/LinkButton'
import { RightsPortalTherapy } from '@island.is/api/schema'
interface Props {
  data: RightsPortalTherapy[]
  link?: string
  linkText?: string
}

type OptionType = {
  label: string
  value: string
}
export const TherapiesTabContent: FC<React.PropsWithChildren<Props>> = ({
  data,
  link,
  linkText,
}) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [dropDownValue, setDropDownValue] = useState<OptionType>()
  let displayDropDown = false
  let dropDownOptions

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
    // Sjúkraþjálfun with more subtherapies, display dropdown
    displayDropDown = true
    dropDownOptions = data.map((item) => {
      return { label: item.name, value: item.id }
    })
  }

  // Display content - get content from dropdown or get first/only in array
  const content =
    displayDropDown && dropDownValue
      ? data.find((item) => item.id === dropDownValue.value) ?? data[0]
      : data[0]

  // Build time periods in format dd.mm.yyyy - dd.mm.yyyy
  const from = content.periods?.find((x) => x.from !== null)?.from ?? ''
  const to = content.periods?.find((x) => x.to !== null)?.to ?? ''
  const timePeriod = [formatDate(from), formatDate(to)]
    .filter(Boolean)
    .join(' - ')
  const periods = content.periods

  return (
    <Box width="full" marginTop={[1, 1, 4]}>
      {displayDropDown && dropDownOptions && (
        <Box className={styles.dropdown} marginBottom={4}>
          <Select
            label={formatMessage(messages.physiotherapyType)}
            placeholder={formatMessage(messages.physiotherapyType)}
            size="xs"
            name="therapy-select"
            options={dropDownOptions}
            onChange={(value) => {
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
          content={
            timePeriod === ''
              ? formatMessage(messages.noValidTimePeriod)
              : timePeriod
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.status)}
          content={
            formatMessage(messages[content.state?.code as TherapyStatus]) ??
            formatMessage(messages.unknownStatus)
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.usedTherapySessions)}
          content={formatNumberToString(
            periods?.find((x) => x.sessions?.used === 0 || x.sessions?.used)
              ?.sessions?.used,
          )}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.totalTherapySessions)}
          content={formatNumberToString(
            periods?.find(
              (x) => x.sessions?.available === 0 || x.sessions?.available,
            )?.sessions?.available,
          )}
        />
        <Divider />
      </Stack>
      <FootNote type={data[0].id.toString()} />
      {link && linkText && <LinkButton to={link} text={linkText} />}
    </Box>
  )
}

export default TherapiesTabContent
