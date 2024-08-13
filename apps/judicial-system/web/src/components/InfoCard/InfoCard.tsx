import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, IconMapIcon, LinkV2, Text } from '@island.is/island-ui/core'
import {
  Defendant,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  DefendantInfo,
  DefendantInfoActionButton,
} from './DefendantInfo/DefendantInfo'
import { link } from '../MarkdownWrapper/MarkdownWrapper.css'
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
  defenders?: Defender[]
  icon?: IconMapIcon
  additionalDataSections?: DataSection[]
}

export const NameAndEmail = (
  name?: string | null,
  email?: string | null,
  breakSpaces = true,
) => (
  <Box display={breakSpaces ? 'block' : 'flex'}>
    {name && (
      <Text key={name} whiteSpace="pre">{`${name}${
        email && !breakSpaces ? `, ` : ''
      }`}</Text>
    )}
    {email && (
      <LinkV2 href={`mailto:${email}`} className={link} key={email}>
        <Text as="span">{email}</Text>
      </LinkV2>
    )}
  </Box>
)

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
        paddingBottom={defenders && [2, 2, 3, 3]}
      >
        {defendants && (
          <>
            <Text variant="h4">{defendants.title}</Text>
            <Box marginTop={1}>
              {defendants.items.map((defendant) => (
                <DefendantInfo
                  defendant={defendant}
                  displayDefenderInfo={!defenders}
                  displayAppealExpirationInfo={
                    defendants.displayAppealExpirationInfo
                  }
                  defendantInfoActionButton={
                    defendants.defendantInfoActionButton
                  }
                  displayVerdictViewDate={defendants.displayVerdictViewDate}
                  defenders={defenders}
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
