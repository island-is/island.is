import { Box, Text } from '@island.is/island-ui/core'
import { formatNationalId } from '@island.is/judicial-system/formatters'
import React, { PropsWithChildren } from 'react'
import * as styles from './InfoCard.css'

interface Props {
  data: Array<{ title: string; value?: string }>
  accusedName?: string
  accusedNationalId?: string
  accusedAddress?: string
  defender?: {
    name: string
    email?: string
    phoneNumber?: string
    defenderIsSpokesperson?: boolean
  }
  isInvestigationCase?: boolean
}

const InfoCard: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  return (
    <Box className={styles.infoCardContainer} data-testid="infoCard">
      <Text variant="h4">
        {props.isInvestigationCase ? 'Varnaraðili' : 'Sakborningur'}
      </Text>
      <Box className={styles.infoCardTitleContainer}>
        <Box marginBottom={4}>
          <Text fontWeight="semiBold">
            {props.accusedName}
            <Text as="span">{`, `}</Text>
            {`kt. ${formatNationalId(props.accusedNationalId ?? '')}`}
            {props.accusedAddress && (
              <Text as="span">{`, ${props.accusedAddress}`}</Text>
            )}
          </Text>
        </Box>
        <Box>
          <Text variant="h4">
            {props.defender?.defenderIsSpokesperson ? 'Talsmaður' : 'Verjandi'}
          </Text>
          {props.defender?.name ? (
            <Box display="flex">
              <Text>
                {`${props.defender.name}${
                  props.defender.email ? `, ${props.defender.email}` : ''
                }${
                  props.defender.phoneNumber
                    ? `, s. ${props.defender.phoneNumber}`
                    : ''
                }`}
              </Text>
            </Box>
          ) : (
            <Text>Hefur ekki verið skráður</Text>
          )}
        </Box>
      </Box>
      <Box className={styles.infoCardDataContainer}>
        {props.data.map((dataItem, index) => (
          <Box
            data-testid={`infoCardDataContainer${index}`}
            className={styles.infoCardData}
            // Should be applied to every element except the last two
            marginBottom={index < props.data.length - 2 ? 3 : 0}
            key={index}
          >
            <Text variant="h4">{dataItem.title}</Text>
            <Text>{dataItem.value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default InfoCard
