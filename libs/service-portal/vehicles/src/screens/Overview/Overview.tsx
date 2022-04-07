import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'

/*
 {
      persidno
      name
      address
      postStation
      vehicleList {
        isCurrent
        permno
        regno
        vin
        type
        color
        firstRegDate
        modelYear
        productYear
        registrationType
        role
        operationStartDate
        operationEndDate
        outOfUse
        otherOwners
        termination
        buyerPersidno
        ownerPersidno
        vehicleStatus
        useGroup
        vehGroup
        plateStatus
      }
      createdTimestamp
    } */
const GET_USERS_VEHICLES = gql`
  query GetUsersVehicles {
    getVehiclesForUser
  }
`
export const VehiclesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()

  const { data, loading, error, called } = useQuery<Query>(GET_USERS_VEHICLES)
  console.log('DAAAAAAAAAAAAAATA', data)
  //const { nationalRegistryUser } = data || {}

  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.assets:vehicles-title',
        defaultMessage: 'Ökutæki',
      })}
      intro={defineMessage({
        id: 'sp.assets:vehicles-intro',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir
        ökutæki á næstunni.`,
      })}
      list={{
        title: m.incoming,
        items: [
          defineMessage({
            id: 'sp.assets:vehicles-inc-1',
            defaultMessage: 'Ökutækin mín',
          }),
          defineMessage({
            id: 'sp.assets:vehicles-inc-2',
            defaultMessage: 'Eignastöðuvottorð',
          }),
          defineMessage({
            id: 'sp.assets:vehicles-inc-3',
            defaultMessage: 'Ökutækjaferill',
          }),
        ],
      }}
      externalHref="https://mitt.samgongustofa.is/"
      externalLinkTitle={defineMessage({
        id: 'sp.assets:vehicles-external-link-title',
        defaultMessage: 'Fara á ökutækjaskrá',
      })}
      inProgress={false}
      figure="./assets/images/movingTruck.svg"
    />
  )

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(m.myInfo)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru gögn um þig og fjölskyldu þína sem sótt eru til Þjóðskrár. Með því að smella á skoða nánar er hægt að óska eftir breytingum á þeim upplýsingum.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        {called && !loading && !error && (
          <AlertMessage type="info" title={formatMessage(m.noDataPresent)} />
        )}
        {/* <FamilyMemberCard
            title={userInfo.profile.name || ''}
            nationalId={userInfo.profile.nationalId}
            currentUser
          />
          {loading && <FamilyMemberCardLoader />}
          {spouseData && (
            <FamilyMemberCard
              key={nationalRegistryUser?.spouse?.nationalId}
              title={nationalRegistryUser?.spouse?.name || ''}
              nationalId={nationalRegistryUser?.spouse?.nationalId || ''}
              familyRelation="spouse"
            />
          )}
          {childrenLoading &&
            [...Array(2)].map((_key, index) => (
              <FamilyMemberCardLoader key={index} />
            ))}
          {nationalRegistryChildren?.map((familyMember) => (
            <FamilyMemberCard
              key={familyMember.nationalId}
              title={familyMember.fullName || familyMember.displayName || ''}
              nationalId={familyMember.nationalId}
              familyRelation="child"
            />
          ))} */}
      </Stack>
    </>
  )
}

export default VehiclesOverview
