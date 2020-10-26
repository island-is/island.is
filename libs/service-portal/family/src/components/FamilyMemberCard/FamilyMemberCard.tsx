import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getNameAbbreviation,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './FamilyMemberCard.treat'

interface Props {
  title: string
  nationalId: string
  userInfoNationalId: string
}

export const FamilyMemberCard: FC<Props> = ({
  title,
  nationalId,
  userInfoNationalId,
}) => {
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
      {userInfoNationalId !== nationalId && (
        <Box
          display="flex"
          alignItems="flexEnd"
          marginTop="auto"
          marginLeft="auto"
        >
          <Link
            to={ServicePortalPath.FamilyMember.replace(
              ':nationalId',
              nationalId,
            )}
          >
            <Button variant="text" size="small">
              {formatMessage({
                id: 'sp.family:see-info',
                defaultMessage: 'Skoða upplýsingar',
              })}
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  )
}
