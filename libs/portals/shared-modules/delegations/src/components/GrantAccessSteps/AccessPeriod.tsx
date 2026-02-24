import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Box, DatePicker, RadioButton, Text } from '@island.is/island-ui/core'
import { useState } from 'react'
import { m as portalMessages } from '@island.is/portals/core'

import { DateScopesTable } from '../../components/ScopesTable/DateScopesTable'
import { useDelegationForm } from '../../context'

export const AccessPeriod = ({
  initialIsSamePeriod = false,
}: {
  initialIsSamePeriod?: boolean
}) => {
  const { formatMessage, lang } = useLocale()
  const [isSamePeriod, setIsSamePeriod] = useState<boolean>(initialIsSamePeriod)
  const { selectedScopes, setSelectedScopes } = useDelegationForm()

  const onValidityPeriodChange = (date: Date) => {
    setSelectedScopes(selectedScopes.map((s) => ({ ...s, validTo: date })))
  }

  return (
    <Box display="flex" flexDirection="column">
      <Text variant="h4" marginBottom={4}>
        {formatMessage(m.stepThreeTitle)}
      </Text>
      {selectedScopes.length > 1 && (
        <Box display="flex" flexDirection="column" rowGap={2} marginBottom={4}>
          <RadioButton
            name="accessPeriodType"
            id="accessPeriodCombined"
            label={formatMessage(m.accessPeriodSame)}
            checked={isSamePeriod}
            onChange={() => setIsSamePeriod(true)}
          />
          <RadioButton
            name="accessPeriodType"
            id="accessPeriodSeparate"
            label={formatMessage(m.accessPeriodDifferent)}
            checked={!isSamePeriod}
            onChange={() => setIsSamePeriod(false)}
          />
        </Box>
      )}
      {isSamePeriod ? (
        <Box alignSelf="flexStart">
          <DatePicker
            id="validityPeriod"
            size="xs"
            label={formatMessage(portalMessages.date)}
            backgroundColor="blue"
            minDate={new Date()}
            selected={selectedScopes[0]?.validTo}
            locale={lang}
            handleChange={onValidityPeriodChange}
            placeholderText={formatMessage(portalMessages.chooseDate)}
          />
        </Box>
      ) : (
        <Box>
          <DateScopesTable />
        </Box>
      )}
    </Box>
  )
}
