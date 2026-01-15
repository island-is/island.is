import {
  Box,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, FC, SetStateAction } from 'react'
import { messages } from '../../..'
import { addMonths, addYears, today } from '../../../utils/dates'
import { DelegationState } from '../../../utils/types'

interface SecondStepProps {
  formState?: DelegationState
  setFormState: Dispatch<SetStateAction<DelegationState | undefined>>
}

const SecondStep: FC<SecondStepProps> = ({ setFormState, formState }) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: 2, second: 2 })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={3}>
        {formatMessage(messages.howLongShouldDelegationApply)}
      </Text>

      <Box marginBottom={2}>
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '8/12', '8/12', '6/12', '5/12']}>
              <DatePicker
                backgroundColor="blue"
                highlightWeekends
                size="xs"
                label={formatMessage(messages.period)}
                handleChange={(startDate, endDate) => {
                  setFormState({
                    ...formState,
                    dateFrom: startDate,
                    dateTo: endDate,
                  })
                }}
                placeholderText={formatMessage(messages.choosePeriod)}
                range
                minDate={today}
                ranges={[
                  {
                    startDate: today,
                    endDate: addMonths(today, 6),
                    label: formatMessage(messages.sixMonths),
                  },
                  {
                    startDate: today,
                    endDate: addYears(today, 1),
                    label: formatMessage(messages.oneYear),
                  },
                  {
                    startDate: today,
                    endDate: addYears(today, 2),
                    label: formatMessage(messages.twoYears),
                  },
                  {
                    startDate: today,
                    endDate: addYears(today, 3),
                    label: formatMessage(messages.threeYears),
                  },
                ]}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}

export default SecondStep
