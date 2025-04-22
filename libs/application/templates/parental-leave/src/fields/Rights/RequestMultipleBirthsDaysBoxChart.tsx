import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getMaxMultipleBirthsAndDefaultMonths } from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { defaultMonths, daysInMonth } from '../../config'
import { formatTextWithLocale, NO } from '@island.is/application/core'
import { useEffectOnce } from 'react-use'
import { Locale } from '@island.is/shared/types'

const RequestMultipleBirthsDaysBoxChart: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ field, application }) => {
  const { description } = field
  const { formatMessage, lang: locale } = useLocale()
  const { setValue, watch } = useFormContext()

  const maxMonths = getMaxMultipleBirthsAndDefaultMonths(application.answers)

  const chosenRequestDays = watch('multipleBirthsRequestDays')
  useEffectOnce(() => {
    setValue('requestRights.isRequestingRights', NO)
    setValue('requestRights.requestDays', '0')
    setValue('giveRights.isGivingRights', NO)
    setValue('giveRights.giveDays', '0')
  })

  const requestedMonths = defaultMonths + chosenRequestDays / daysInMonth

  const daysStringKey =
    chosenRequestDays === 1
      ? parentalLeaveFormMessages.shared.requestMultipleBirthsDay
      : parentalLeaveFormMessages.shared.requestMultipleBirthsDays

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
    {
      label: () => ({ ...daysStringKey, values: { day: chosenRequestDays } }),
      bulletStyle: 'purpleWithLines',
    },
  ]

  return (
    <>
      <p>
        {formatTextWithLocale(
          description!,
          application,
          locale as Locale,
          formatMessage,
        )}
      </p>
      <Box marginBottom={6} marginTop={5}>
        <BoxChart
          application={application}
          boxes={Math.ceil(maxMonths)}
          calculateBoxStyle={(index) => {
            if (index < defaultMonths) {
              return 'blue'
            }

            if (index < requestedMonths) {
              return 'purpleWithLines'
            }

            return 'grayWithLines'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      </Box>
    </>
  )
}

export default RequestMultipleBirthsDaysBoxChart
