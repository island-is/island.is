import {
  Box,
  SkeletonLoader,
  Stack,
  Text,
  Typography,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useNationalRegistryFamilyInfo } from '@island.is/service-portal/graphql'
import React from 'react'
import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { FamilyMemberCardLoader } from '../../components/FamilyMemberCard/FamilyMemberCardLoader'

const FamilyOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()
  const {
    data: natRegFamilyInfo,
    loading,
    error,
  } = useNationalRegistryFamilyInfo(userInfo.profile.natreg)

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <Typography variant="h1">
          {formatMessage({
            id: 'service.portal:family',
            defaultMessage: 'Fjölskyldan',
          })}
        </Typography>
      </Box>
      {error && (
        <Box textAlign="center">
          <Text variant="h3">
            {formatMessage({
              id: 'sp.family:could-not-fetch-family-info',
              defaultMessage:
                'Tókst ekki að sækja upplýsingar um fjölskyldu, eitthvað fór úrskeiðis',
            })}
          </Text>
        </Box>
      )}
      <Stack space={2}>
        {loading &&
          [...Array(3)].map((_key, index) => (
            <FamilyMemberCardLoader key={index} />
          ))}
        {natRegFamilyInfo?.map((familyMember, index) => (
          <FamilyMemberCard
            key={index}
            title={familyMember.fullName}
            nationalId={familyMember.nationalId}
          />
        ))}
      </Stack>
    </>
  )
}
export default FamilyOverview
