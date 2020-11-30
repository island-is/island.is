import { Box, Text } from '@island.is/island-ui/core'
import { CaseGender } from '@island.is/judicial-system/types'
import React, { PropsWithChildren } from 'react'
import { getShortGender } from '../../utils/stepHelper'
import * as styles from './InfoCard.treat'

interface Props {
  data: Array<{ title: string; value?: string }>
  accusedName?: string
  accusedGender?: CaseGender
  accusedNationalId?: string
  accusedAddress?: string
}

const InfoCard: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  return (
    <Box className={styles.infoCardContainer}>
      <Text variant="h4">Sakborningur</Text>
      <Box className={styles.infoCardTitleContainer}>
        <Text fontWeight="semiBold">
          {`${props.accusedName} `}
          <Text as="span">{`(${getShortGender(props.accusedGender)}), `}</Text>
          {`${props.accusedNationalId}, `}
          <Text as="span">{props.accusedAddress}</Text>
        </Text>
      </Box>
      <Box className={styles.infoCardDataContainer}>
        {props.data.map((dataItem, index) => (
          <Box
            className={styles.infoCardData}
            // Should be applied to every element except the last two
            marginBottom={index < props.data.length - 2 ? 1 : 0}
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
