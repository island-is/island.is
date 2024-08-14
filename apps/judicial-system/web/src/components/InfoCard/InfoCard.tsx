import React, { FC } from 'react'

import { Box, Icon, IconMapIcon, Text } from '@island.is/island-ui/core'
import {
  Defendant,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  DefendantInfo,
  DefendantInfoActionButton,
} from './DefendantInfo/DefendantInfo'
import * as styles from './InfoCard.css'

export interface Defender {
  name?: string | null
  defenderNationalId?: string | null
  sessionArrangement?: SessionArrangements | null
  email?: string | null
  phoneNumber?: string | null
}

export interface DataSection {
  data: { title: string; value?: React.ReactNode }[]
}

interface Props {
  courtOfAppealData?: { title: string; value?: React.ReactNode }[]
  data: { title: string; value?: React.ReactNode }[]
  defendants?: {
    title: string
    items: Defendant[]
    defendantInfoActionButton?: DefendantInfoActionButton
    displayAppealExpirationInfo?: boolean
    displayVerdictViewDate?: boolean
  }
  defender?: Defender
  icon?: IconMapIcon
  additionalDataSections?: DataSection[]
}

const InfoCard: FC<Props> = (props) => {
  const {
    courtOfAppealData,
    data,
    defendants,
    defender,
    icon,
    additionalDataSections,
  } = props

  return (
    <Box
      className={styles.infoCardContainer}
      padding={[2, 2, 3, 3]}
      data-testid="infoCard"
    >
      <Box
        className={(defendants || defender) && styles.infoCardTitleContainer}
        marginBottom={(defendants || defender) && [2, 2, 3, 3]}
        paddingBottom={defender && [2, 2, 2, 2]}
      >
        {defendants && (
          <>
            <Text variant="h4">{defendants.title}</Text>
            <Box marginTop={1}>
              {defendants.items.map((defendant) => (
                <DefendantInfo
                  key={defendant.id}
                  defendant={defendant}
                  displayAppealExpirationInfo={
                    defendants.displayAppealExpirationInfo
                  }
                  defendantInfoActionButton={
                    defendants.defendantInfoActionButton
                  }
                  displayVerdictViewDate={defendants.displayVerdictViewDate}
                  defender={defender}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
      <Box className={styles.infoCardDataContainer}>
        {data.map((dataItem, index) => {
          return (
            <Box
              data-testid={`infoCardDataContainer${index}`}
              key={dataItem.title}
              marginBottom={1}
            >
              <Text variant="h4">{dataItem.title}</Text>
              {typeof dataItem.value === 'string' ? (
                <Text>{dataItem.value}</Text>
              ) : (
                dataItem.value
              )}
            </Box>
          )
        })}
      </Box>
      {courtOfAppealData && (
        <Box className={styles.infoCardAdditionalSectionContainer}>
          {courtOfAppealData.map((dataItem, index) => {
            return (
              <Box
                data-testid={`infoCardDataContainer${index}`}
                key={dataItem.title}
              >
                <Text variant="h4">{dataItem.title}</Text>
                {typeof dataItem.value === 'string' ? (
                  <Text>{dataItem.value}</Text>
                ) : (
                  dataItem.value
                )}
              </Box>
            )
          })}
        </Box>
      )}
      {additionalDataSections?.map((section, index) => (
        <Box className={styles.infoCardAdditionalSectionContainer} key={index}>
          {section.data.map((dataItem, dataIndex) => (
            <Box
              key={dataItem.title}
              data-testid={`infoCardDataContainer-${index}-${dataIndex}`}
            >
              <Text variant="h4">{dataItem.title}</Text>
              {typeof dataItem.value === 'string' ? (
                <Text>{dataItem.value}</Text>
              ) : (
                dataItem.value
              )}
            </Box>
          ))}
        </Box>
      ))}
      {icon && (
        <Box position="absolute" top={[2, 2, 3, 3]} right={[2, 2, 3, 3]}>
          <Icon icon={icon} type="outline" color="blue400" size="large" />
        </Box>
      )}
    </Box>
  )
}

export default InfoCard
