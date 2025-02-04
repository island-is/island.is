import { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box, Select } from '@island.is/island-ui/core'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { TempIndictmentCount } from '@island.is/judicial-system-web/src/types'

import { indictmentCount as strings } from '../IndictmentCount.strings'
import { indictmentCountEnum as enumStrings } from '../IndictmentCountEnum.strings'

export const Offenses = ({
  indictmentCount,
}: {
  indictmentCount: TempIndictmentCount
}) => {
  const { formatMessage } = useIntl()

  const {offenses} = indictmentCount
  console.log({offenses})
  // TODO
  const offensesOptions = useMemo(
    () =>
      Object.values(IndictmentCountOffense).map((offense) => ({
        value: offense,
        label: formatMessage(enumStrings[offense]),
        disabled: indictmentCount.deprecatedOffenses?.includes(offense),
      })),
    [formatMessage, indictmentCount.deprecatedOffenses],
  )

  return (
    <Box marginBottom={2}>
      <SectionHeading
        heading="h4"
        title={formatMessage(strings.incidentTitle)}
        marginBottom={2}
      />
      <Select
        name="deprecatedOffenses"
        options={offensesOptions}
        label={formatMessage(strings.incidentLabel)}
        placeholder={formatMessage(strings.incidentPlaceholder)}
        onChange={(so) => {
          const selectedOffense = so?.value as IndictmentCountOffense

          // handleIndictmentCountChanges({
          //   deprecatedOffenses,
          // })
        }}
        value={null}
        required
      />
    </Box>
  )
}
