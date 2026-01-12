import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import React from 'react'
import { messages } from '../../lib/messages'
import * as styles from './DispensingContainer.css'
import DispensingItem, { DispensingItemProps } from './DispensingItem'

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
        {data.map((item, i) => (
          <Box
            background={i % 2 === 0 ? 'white' : 'blue100'}
            padding={1}
            key={`dispensing-item-container-${item.id}`}
          >
            <Box className={styles.text} marginBottom={'smallGutter'}>
              <Text fontWeight="regular">
                {[
                  item.medicine,
                  item.strength,
                  formatMessage(messages.medicineAmount),
                  item.quantity,
                ].join('  ')}
              </Text>
            </Box>
            <Box className={styles.text} marginBottom={'smallGutter'}>
              <Text fontWeight="regular">
                {formatMessage(messages.pickedUpInPharmacy, {
                  arg: item.pharmacy,
                  date: item.date,
                })}
              </Text>
            </Box>
            {item.button && (
              <Box width="full" marginBottom={'smallGutter'}>
                <Button
                  variant="text"
                  size="small"
                  fluid
                  onClick={item.button?.onClick}
                  icon="arrowForward"
                >
                  {item.button?.text}
                </Button>
              </Box>
            )}
          </Box>
        ))}
      </Hidden>
      <Hidden below="lg">
        <Box background="blue100">
          <GridContainer className={styles.grid}>
            <DispensingItem
              id=""
              date={formatMessage(messages.vaccinesTableHeaderDate)}
              pharmacy={formatMessage(messages.dispensingPlace)}
              quantity={formatMessage(messages.medicineQuantity)}
              medicine={formatMessage(messages.medicineTitle)}
              strength={formatMessage(messages.medicineStrength)}
              button={
                data.some((item) => item.button)
                  ? { text: '', onClick: () => undefined }
                  : undefined
              }
              bold
            />
            {data.map((item, i) => (
              <DispensingItem
                id={item.id}
                date={item.date}
                strength={item.strength}
                pharmacy={item.pharmacy}
                quantity={item.quantity}
                medicine={item.medicine}
                key={`dispensing-item-${item.id}`}
                backgroundColor={i % 2 === 0 ? 'white' : 'blue'}
                button={item.button}
              />
            ))}
          </GridContainer>
        </Box>
      </Hidden>
    </Box>
  )
}

export default DispensingContainer
