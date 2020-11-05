import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getNameAbbreviation,
  formatNationalId,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './FamilyMemberCard.treat'

interface Props {
  title: string
  nationalId?: string
  familyRelation?: string
}

export const FamilyMemberCard: FC<Props> = ({
  title,
  nationalId,
  familyRelation,
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
          <Text variant="h2" color="blue400">
            {getNameAbbreviation(title)}
          </Text>
        </Box>
        <div>
          {familyRelation && (
            <Text variant="eyebrow" color="purple400">
              {formatMessage(
                familyRelation === 'child'
                  ? {
                      id: 'sp.family:child',
                      defaultMessage: 'Barn',
                    }
                  : familyRelation === 'spouse'
                  ? {
                      id: 'sp.family:spouse',
                      defaultMessage: 'Maki',
                    }
                  : {
                      id: 'sp.family:family-member',
                      defaultMessage: 'Fjölskyldumeðlimur',
                    },
              )}
            </Text>
          )}
          <Box marginBottom={1}>
            <Text variant="h3" color="dark400">
              {title}
            </Text>
          </Box>
          {nationalId && (
            <Text fontWeight="light">
              {formatMessage({
                id: 'service.portal:natreg',
                defaultMessage: 'Kennitala',
              })}
              : {formatNationalId(nationalId)}
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
