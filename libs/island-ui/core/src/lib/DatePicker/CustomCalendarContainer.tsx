import React from 'react'
import { CalendarContainer } from 'react-datepicker'
import { Box, FocusableBox, Text } from '../..'
import * as styles from './DatePicker.css'

interface CustomCalendarContainerProps {
  children: React.ReactNode
  className?: string
  setDate: (startDate: Date | null, endDate?: Date | null) => void
  ranges?: { label: string; startDate: Date; endDate: Date }[]
}

const CustomCalendarContainer: React.FC<CustomCalendarContainerProps> = ({
  children,
  className,
  setDate,
  ranges,
}) => {
  return (
    <CalendarContainer className={className}>
      <div>{children}</div>
      {ranges && (
        <Box className={styles.rangeContainer}>
          <Box
            display="flex"
            flexWrap="wrap"
            flexDirection="row"
            justifyContent="spaceBetween"
            paddingTop={2}
            columnGap={1}
          >
            {ranges?.map((range) => (
              <FocusableBox
                paddingY={1}
                paddingX={'p1'}
                borderRadius="large"
                border="standard"
                borderColor="borderPrimary"
                borderWidth="standard"
                background="transparent"
                display="flex"
                alignItems="center"
                justifyContent="center"
                className={styles.rangeItem}
                key={range.label}
                onClick={() => setDate(range.startDate, range.endDate)}
              >
                <Text variant="small" color="blue400" fontWeight="medium">
                  {range.label}
                </Text>
              </FocusableBox>
            ))}
          </Box>
        </Box>
      )}
    </CalendarContainer>
  )
}

export default CustomCalendarContainer
