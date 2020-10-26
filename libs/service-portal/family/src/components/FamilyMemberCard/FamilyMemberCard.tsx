import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getNameAbbreviation } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import * as styles from './FamilyMemberCard.treat'

interface Props {
  title: string
  nationalId: string
}

export const FamilyMemberCard: FC<Props> = ({ title, nationalId }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      alignItems="center"
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexShrink={0}
        marginRight={[2, 4]}
        borderRadius="circle"
        background="purple200"
        className={styles.avatar}
      >
        <Text variant="h2" color="purple400">
          {getNameAbbreviation(title)}
        </Text>
      </Box>
      <div>
        <Text variant="h3" color="blue400">
          {title}
        </Text>
        <div>
          {formatMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          : {nationalId}
        </div>
      </div>
    </Box>
  )
}
