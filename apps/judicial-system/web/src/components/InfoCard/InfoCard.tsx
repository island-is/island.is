import React, { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, IconMapIcon, Text } from '@island.is/island-ui/core'
import {
  Defendant,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  DefendantInfo,
  DefendantInfoActionButton,
} from './DefendantInfo/DefendantInfo'
import RenderPersonalData from './RenderPersonalInfo/RenderPersonalInfo'
import { strings } from './InfoCard.strings'
import * as styles from './InfoCard.css'

interface Defender {
  name?: string | null
  defenderNationalId?: string | null
  sessionArrangement?: SessionArrangements | null
  email?: string | null
  phoneNumber?: string | null
}

interface UniqueDefendersProps {
  defenders: Defender[]
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
  defenders?: Defender[]
  icon?: IconMapIcon
  additionalDataSections?: DataSection[]
}

const UniqueDefenders: FC<UniqueDefendersProps> = ({ defenders }) => {
  const { formatMessage } = useIntl()

  const uniqueDefenders = defenders?.filter(
    (defender, index, self) =>
      index === self.findIndex((d) => d.email === defender.email),
  )

  return (
    <>
      <Text variant="h4">
        {defenders[0].sessionArrangement ===
        SessionArrangements.ALL_PRESENT_SPOKESPERSON
          ? formatMessage(strings.spokesperson)
          : uniqueDefenders.length > 1
          ? formatMessage(strings.defenders)
          : formatMessage(strings.defender)}
      </Text>
      {uniqueDefenders.map((defender, index) =>
        defender?.name ? (
          RenderPersonalData(
            defender.name,
            defender.email,
            defender.phoneNumber,
            false,
          )
        ) : (
          <Text key={`defender_not_registered_${index}`}>
            {formatMessage(strings.noDefender)}
          </Text>
        ),
      )}
    </>
  )
}

const InfoCard: FC<Props> = (props) => {
  const {
    courtOfAppealData,
    data,
    defendants,
    defenders,
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
        className={(defendants || defenders) && styles.infoCardTitleContainer}
        marginBottom={(defendants || defenders) && [2, 2, 3, 3]}
        paddingBottom={defenders && [2, 2, 2, 2]}
      >
        {defendants && (
          <>
            <Text variant="h4">{defendants.title}</Text>
            <Box marginBottom={defenders ? [2, 2, 3, 3] : 0} marginTop={1}>
              {defendants.items.map((defendant) => (
                <DefendantInfo
                  key={defendant.id}
                  defendant={defendant}
                  displayDefenderInfo={!defenders}
                  displayAppealExpirationInfo={
                    defendants.displayAppealExpirationInfo
                  }
                  defendantInfoActionButton={
                    defendants.defendantInfoActionButton
                  }
                  displayVerdictViewDate={defendants.displayVerdictViewDate}
                />
              ))}
            </Box>
          </>
        )}
        {defenders && <UniqueDefenders defenders={defenders} />}
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
