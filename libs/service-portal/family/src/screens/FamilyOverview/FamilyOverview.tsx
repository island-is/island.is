import { FamilyMember } from '@island.is/api/schema'
import {
  Box,
  SkeletonLoader,
  Stack,
  Text,
  Typography,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useNationalRegistryFamilyInfo } from '@island.is/service-portal/graphql'
import React from 'react'
import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { FamilyMemberCardLoader } from '../../components/FamilyMemberCard/FamilyMemberCardLoader'

const FamilyOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const {
    data: natRegFamilyInfo,
    loading,
    error,
  } = useNationalRegistryFamilyInfo()

  // TODO: This is a temp solution while there is a mismatch between identity servers
  const userInfoNationalId =
    userInfo.profile.nationalId || userInfo.profile.natreg

  const familyMemberList: FamilyMember[] =
    natRegFamilyInfo?.filter((x) => x.nationalId !== userInfoNationalId) || []

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
        {familyMemberList?.map((familyMember, index) => (
          <FamilyMemberCard
            key={index}
            title={familyMember.fullName}
            nationalId={familyMember.nationalId}
            userInfoNationalId={userInfo.profile.natreg}
          />
        ))}
      </Stack>
    </>
  )
}
export default FamilyOverview
