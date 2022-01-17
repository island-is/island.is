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
import { defineMessage } from 'react-intl'
import * as styles from './FamilyMemberCard.css'

interface Props {
  title: string
  nationalId?: string
  familyRelation?: 'child' | 'spouse'
  currentUser?: boolean
}

export const FamilyMemberCard: FC<Props> = ({
  title,
  nationalId,
  currentUser,
  familyRelation,
}) => {
  const { formatMessage } = useLocale()

  const familyRelationLabel =
    familyRelation === 'child'
      ? defineMessage({
          id: 'sp.family:child',
          defaultMessage: 'Barn',
        })
      : familyRelation === 'spouse'
      ? defineMessage({
          id: 'sp.family:spouse',
          defaultMessage: 'Maki',
        })
      : defineMessage({
          id: 'sp.family:family-member',
          defaultMessage: 'Fjölskyldumeðlimur',
        })

  const link = (nationalId: string) =>
    familyRelation === 'spouse'
      ? ServicePortalPath.Spouse.replace(':nationalId', nationalId)
      : ServicePortalPath.FamilyMember.replace(':nationalId', nationalId)

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
          {familyRelation && (
            <Text variant="eyebrow" color="purple400">
              {formatMessage(familyRelationLabel)}
            </Text>
          )}
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
            to={{
              pathname: currentUser
                ? ServicePortalPath.UserInfo
                : link(nationalId),
            }}
          >
            <Button variant="text" size="small">
              {formatMessage({
                id: 'sp.family:see-info',
                defaultMessage: 'Skoða nánar',
              })}
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  )
}
