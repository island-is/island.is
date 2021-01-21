import { Box, Link, LinkContext, Text } from '@island.is/island-ui/core'
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
  defender?: { name: string; email?: string }
}

const InfoCard: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <Link
            href={href}
            underline="small"
            underlineVisibility="always"
            color="blue400"
          >
            {children}
          </Link>
        ),
      }}
    >
      <Box className={styles.infoCardContainer}>
        <Text variant="h4">Sakborningur</Text>
        <Box className={styles.infoCardTitleContainer}>
          <Box marginBottom={4}>
            <Text fontWeight="semiBold">
              {`${props.accusedName} `}
              <Text as="span">{`(${getShortGender(
                props.accusedGender,
              )}), `}</Text>
              {`${props.accusedNationalId}, `}
              <Text as="span">{props.accusedAddress}</Text>
            </Text>
          </Box>
          <Box>
            <Text variant="h4">Verjandi</Text>
            {props.defender?.name ? (
              <Box display="flex">
                <Text>
                  {`${props.defender.name}${props.defender.email ? ', ' : ''}`}
                  <Link
                    href={`mailto:${props.defender.email}`}
                    underlineVisibility="always"
                    underline="normal"
                  >
                    {props.defender.email}
                  </Link>
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
    </LinkContext.Provider>
  )
}

export default InfoCard
