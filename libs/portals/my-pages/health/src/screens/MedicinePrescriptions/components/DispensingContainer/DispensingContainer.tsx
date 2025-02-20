import { Box, GridContainer, Hidden, Text } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './DispensingContainer.css'
import DispensingItem, { DispensingItemProps } from './DispensingItem'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../../lib/messages'
import cn from 'classnames'

interface Props {
  label: string
  data: DispensingItemProps[]
  backgroundColor?: 'blue' | 'white'
}

const DispensingContainer: React.FC<Props> = ({
  label,
  data,
  backgroundColor,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box
      padding={[0, 0, 1, 3]}
      paddingBottom={0}
      background={backgroundColor === 'blue' ? 'blue100' : 'white'}
    >
      <Box
        className={cn(styles.noLeftPadding, styles.text)}
        paddingBottom={[2, 2, 2, 0]}
      >
        <Text variant="small" fontWeight="medium">
          {label}
        </Text>
      </Box>
      <Hidden above="md">
        {/*  
            message={formatMessage(messages.noDataFoundDetail, {
            arg: formatMessage(messages.dentistsTitleVariation).toLowerCase(),
          })} */}
        {data.map((item, i) => (
          <Box
            background={i % 2 === 0 ? 'white' : 'blue100'}
            paddingY={1}
            paddingLeft={1}
            key={`dispensing-item-container-${i}`}
          >
            <Box className={styles.text}>
              <Text fontWeight="medium">
                {formatMessage(messages.dispensations, {
                  arg: i + 1,
                })}
              </Text>
            </Box>
            <Box className={styles.text}>
              <Text fontWeight="regular">
                {formatMessage(messages.pickedUpInPharmacy, {
                  arg: item.pharmacy,
                  date: item.date,
                })}
              </Text>
            </Box>
          </Box>
        ))}
      </Hidden>
      <Hidden below="lg">
        <Box background="blue100">
          <GridContainer className={styles.grid}>
            <DispensingItem
              number={formatMessage(messages.number)}
              date={formatMessage(messages.vaccinesTableHeaderDate)}
              pharmacy={formatMessage(messages.dispensingPlace)}
              quantity={formatMessage(messages.medicineQuantity)}
              bold
              icon={undefined}
            />
            {data.map((item, i) => (
              <DispensingItem
                date={item.date}
                icon={item.icon}
                number={item.number}
                pharmacy={item.pharmacy}
                quantity={item.quantity}
                key={`dispensing-item-${i}`}
                backgroundColor={i % 2 === 0 ? 'white' : 'blue'}
              />
            ))}
          </GridContainer>
        </Box>
      </Hidden>
    </Box>
  )
}

export default DispensingContainer
