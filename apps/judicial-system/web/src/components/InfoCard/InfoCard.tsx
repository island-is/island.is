import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  Defendant,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'

import * as styles from './InfoCard.css'

interface Props {
  data: Array<{ title: string; value?: string }>
  defendants?: Defendant[]
  defender?: {
    name: string
    defenderNationalId?: string
    email?: string
    phoneNumber?: string
  }
  sessionArrangement: SessionArrangements | undefined
}

const InfoCard: React.FC<Props> = (props) => {
  const { data, defendants, defender, sessionArrangement } = props
  const { formatMessage } = useIntl()

  return (
    <Box
      className={styles.infoCardContainer}
      padding={[2, 2, 3, 3]}
      data-testid="infoCard"
    >
      {defendants && (
        <>
          <Text variant="h4">
            {capitalize(
              formatMessage(core.defendant, {
                suffix: defendants.length > 1 ? 'ar' : 'i',
              }),
            )}
          </Text>
          <Box marginBottom={[2, 2, 3, 3]}>
            {defendants.map((defendant, index) => (
              <Text key={index}>
                <span className={styles.infoCardDefendant}>
                  <Text
                    as="span"
                    fontWeight="semiBold"
                  >{`${defendant.name}, `}</Text>
                  <Text as="span" fontWeight="semiBold">
                    {(!defendant.noNationalId || defendant.nationalId) &&
                      `${defendant.noNationalId ? 'fd.' : ', kt.'} ${
                        defendant.noNationalId
                          ? defendant.nationalId
                          : formatNationalId(defendant.nationalId ?? '')
                      }, `}
                  </Text>
                  <Text as="span">
                    {defendant.citizenship && ` (${defendant.citizenship}), `}
                  </Text>
                  {defendant.address && (
                    <Text as="span">{`${defendant.address}`}</Text>
                  )}
                </span>
              </Text>
            ))}
          </Box>
        </>
      )}
      <Box
        className={styles.infoCardTitleContainer}
        marginBottom={[2, 2, 3, 3]}
        paddingBottom={[2, 2, 3, 3]}
      >
        <Text variant="h4">
          {sessionArrangement === SessionArrangements.ALL_PRESENT_SPOKESPERSON
            ? 'Talsmaður'
            : 'Verjandi'}
        </Text>
        {defender?.name ? (
          <Box display="flex">
            <Text>
              {`${defender.name}${defender.email ? `, ${defender.email}` : ''}${
                defender.phoneNumber ? `, s. ${defender.phoneNumber}` : ''
              }`}
            </Text>
          </Box>
        ) : (
          <Text>Hefur ekki verið skráður</Text>
        )}
      </Box>
      <Box className={styles.infoCardDataContainer}>
        {data.map((dataItem, index) => {
          const isLastItem = index === data.length - 1
          const isLastTwoItems = isLastItem || index === data.length - 2

          return (
            <Box
              data-testid={`infoCardDataContainer${index}`}
              className={styles.infoCardData}
              // Should be applied to every element except the last two
              marginBottom={[
                isLastItem ? 0 : 2,
                isLastItem ? 0 : 2,
                isLastTwoItems ? 0 : 3,
                isLastTwoItems ? 0 : 3,
              ]}
              key={index}
            >
              <Text variant="h4">{dataItem.title}</Text>
              <Text>{dataItem.value}</Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default InfoCard
