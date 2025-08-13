import { Box, Divider, Select, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  LinkButton,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { messages } from '../../../../lib/messages'

import { RightsPortalTherapy } from '@island.is/api/schema'
import { Problem } from '@island.is/react-spa/shared'
import { FootNote } from '../../../../components/FootNote/FootNote'
import { TherapyStatus } from '../../../../utils/constants'
import { formatNumberToString } from '../../../../utils/format'
import { CONTENT_GAP_SM } from '../../../../utils/constants'
import * as styles from './TherapiesTabContent.css'
interface Props {
  data: RightsPortalTherapy[]
  link?: string
  linkText?: string
  loading: boolean
}

type OptionType = {
  label: string
  value: string
}
export const TherapiesTabContent = ({
  data,
  link,
  linkText,
  loading,
}: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const [dropDownValue, setDropDownValue] = useState<OptionType>()
  let displayDropDown = false
  let dropDownOptions

  if (!loading && !data.length) {
    return (
      <Problem
        type="no_data"
        title={formatMessage(messages.noDataFound, {
          arg: formatMessage(messages.therapyTitle).toLowerCase(),
        })}
        message={formatMessage(messages.noDataFoundDetail, {
          arg: formatMessage(messages.therapyTitle).toLowerCase(),
        })}
        imgSrc="./assets/images/coffee.svg"
        titleSize="h3"
        noBorder={false}
      />
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
  const from = content?.periods?.find((x) => x.from !== null)?.from ?? ''
  const to = content?.periods?.find((x) => x.to !== null)?.to ?? ''
  const timePeriod = [formatDate(from), formatDate(to)]
    .filter(Boolean)
    .join(' - ')
  const periods = content?.periods

  return (
    <Box width="full">
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
      <Stack space={CONTENT_GAP_SM}>
        <UserInfoLine
          title={formatMessage(messages.informationAboutStatus)}
          label={formatMessage(messages.timePeriod)}
          loading={loading}
          content={
            timePeriod === ''
              ? formatMessage(messages.noValidTimePeriod)
              : timePeriod
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.status)}
          loading={loading}
          content={
            formatMessage(messages[content?.state?.code as TherapyStatus]) ??
            formatMessage(messages.unknownStatus)
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.usedTherapySessions)}
          loading={loading}
          content={formatNumberToString(
            periods?.find((x) => x.sessions?.used === 0 || x.sessions?.used)
              ?.sessions?.used,
          )}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.totalTherapySessions)}
          loading={loading}
          content={formatNumberToString(
            periods?.find(
              (x) => x.sessions?.available === 0 || x.sessions?.available,
            )?.sessions?.available,
          )}
        />
        <Divider />
      </Stack>
      <FootNote type={data?.[0]?.id.toString()} />
      {link && linkText && (
        <LinkButton to={link} text={linkText} variant="text" />
      )}
    </Box>
  )
}

export default TherapiesTabContent
