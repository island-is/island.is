import { Box, Button, DatePicker, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../lib/messages'
import * as styles from './PatientDataPermit.css'
interface ThirdStepProps {
  onClick: () => void
  goBack: () => void
}

const ThirdStep: React.FC<ThirdStepProps> = ({ onClick, goBack }) => {
  const { formatMessage } = useLocale()
  const [selectedRange, setSelectedRange] = React.useState<{
    startDate: Date | null | undefined
    endDate: Date | null | undefined
  }>({ startDate: null, endDate: null })
  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: '3', second: '3' })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={2}>
        {formatMessage(messages.howLongShouldPermitApply)}
      </Text>

      <Box width="touchable" style={{ width: '320px' }}>
        <DatePicker
          backgroundColor="blue"
          range
          ranges={[
            {
              startDate: new Date(),
              endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
              label: formatMessage(messages.sixMonths),
            },
            {
              startDate: new Date(),
              endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1),
              ),
              label: formatMessage(messages.oneYear),
            },
            {
              startDate: new Date(),
              endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 2),
              ),
              label: formatMessage(messages.twoYears),
            },
            {
              startDate: new Date(),
              endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 3),
              ),
              label: formatMessage(messages.threeYears),
            },
          ]}
          selected={selectedRange.startDate}
          handleChange={(startDate, endDate) =>
            setSelectedRange({ startDate, endDate })
          }
          label={formatMessage(messages.period)}
          placeholderText={formatMessage(messages.choosePeriod)}
          size="xs"
        />
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginTop={[0, 0, 3]}
        flexWrap="wrap"
      >
        <Box className={styles.forwardButton} marginBottom={[1, 1, 0]}>
          <Button
            fluid
            variant="ghost"
            size="small"
            onClick={goBack}
            preTextIcon="arrowBack"
          >
            {formatMessage(messages.goBack)}
          </Button>
        </Box>
        <Box className={styles.forwardButton}>
          <Button
            fluid
            size="small"
            disabled={!selectedRange.endDate || !selectedRange.startDate}
            onClick={onClick}
          >
            {formatMessage(messages.forward)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ThirdStep
