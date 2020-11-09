import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
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
    called,
  } = useNationalRegistryFamilyInfo()

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <Text variant="h1">
          {formatMessage({
            id: 'service.portal:family',
            defaultMessage: 'Fjölskyldan',
          })}
        </Text>
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
        {called && !loading && !error && natRegFamilyInfo?.length === 0 && (
          <AlertMessage
            type="info"
            title={formatMessage({
              id: 'service.portal:no-data-present',
              defaultMessage: 'Engar upplýsingar til staðar',
            })}
          />
        )}
        {loading &&
          [...Array(3)].map((_key, index) => (
            <FamilyMemberCardLoader key={index} />
          ))}
        {natRegFamilyInfo?.map((familyMember, index) => (
          <FamilyMemberCard
            key={index}
            title={familyMember.fullName}
            nationalId={familyMember.nationalId}
            familyRelation={familyMember.familyRelation}
          />
        ))}
      </Stack>
    </>
  )
}
export default FamilyOverview
