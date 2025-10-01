import { Box, Button, DatePicker, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../..'
import { addMonths, addYears, today } from '../../../utils/dates'
import { DelegationInput } from '../utils/mockdata'

interface SecondStepProps {
  onClick: () => void
  formState?: DelegationInput
  setFormState: Dispatch<SetStateAction<DelegationInput | undefined>>
}

// Choose Date
const SecondStep: FC<SecondStepProps> = ({
  onClick,
  setFormState,
  formState,
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<{
    dateFrom?: Date
    dateTo?: Date
  }>({
    dateFrom: formState?.dateFrom,
    dateTo: formState?.dateTo,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onClick()
  }

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: 2, second: 2 })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={3}>
        {formatMessage(messages.howLongShouldDelegationApply)}
      </Text>

      <Box marginBottom={2} width="half">
        <DatePicker
          backgroundColor="blue"
          highlightWeekends
          size="xs"
          label={formatMessage(messages.period)}
          handleChange={(startDate, endDate) => {
            setFormData({
              dateFrom: startDate ?? undefined,
              dateTo: endDate ?? undefined,
            })
          }}
          placeholderText={undefined}
          range
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
      </Box>

      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginTop={4}
        flexWrap="wrap"
        columnGap={2}
      >
        <Box marginRight={1}>
          <Button
            fluid
            variant="ghost"
            size="small"
            type="button"
            onClick={() => navigate(-1)}
            preTextIcon="arrowBack"
          >
            {formatMessage(m.buttonCancel)}
          </Button>
        </Box>
        <Box marginLeft={1}>
          <Button
            fluid
            size="small"
            type="submit"
            disabled={!formData.dateFrom || !formData.dateTo}
            onClick={onClick}
          >
            {formatMessage(m.nextStep)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SecondStep
