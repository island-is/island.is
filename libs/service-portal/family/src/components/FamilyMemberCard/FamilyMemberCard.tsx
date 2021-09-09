import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getNameAbbreviation,
  formatNationalId,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './FamilyMemberCard.treat'

interface Props {
  title: string
  nationalId?: string
  familyRelation?: string
  currentUser?: boolean
}

export const FamilyMemberCard: FC<Props> = ({
  title,
  nationalId,
  currentUser,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display={['block', 'flex']}
      alignItems="center"
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <Box display="flex" alignItems="center">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          marginRight={[2, 4]}
          borderRadius="circle"
          background="blue100"
          className={styles.avatar}
        >
          <Text variant="h2" as="h2" color="blue400">
            {getNameAbbreviation(title)}
          </Text>
        </Box>
        <div>
          <Box marginBottom={nationalId ? 1 : 0}>
            <Text variant="h3" as="h3" color="dark400">
              {title}
            </Text>
          </Box>
          {nationalId && (
            <Text fontWeight="light">
              {formatMessage(m.natreg)}: {formatNationalId(nationalId)}
            </Text>
          )}
        </div>
      </Box>
      {nationalId && (
        <Box
          display="flex"
          alignItems="flexEnd"
          justifyContent="flexEnd"
          marginTop={[2, 'auto']}
          marginLeft="auto"
        >
          <Link
            to={
              currentUser
                ? ServicePortalPath.UserInfo
                : ServicePortalPath.FamilyMember.replace(
                    ':nationalId',
                    nationalId,
                  )
            }
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
