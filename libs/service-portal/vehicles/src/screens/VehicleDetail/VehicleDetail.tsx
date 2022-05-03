import React from 'react'
import {
  dateParse,
  PlausiblePageviewDetail,
} from '@island.is/service-portal/core'

import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Table as T,
  Stack,
  Text,
  LoadingDots,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import BaseInfoItem from '../../components/DetailTable/BaseInfoItem'
import RegistrationInfoItem from '../../components/DetailTable/RegistrationInfoItem'
import OwnerInfoItem from '../../components/DetailTable/OwnerInfoItem'
import InspectionInfoItem from '../../components/DetailTable/InspectionInfoItem'
import TechnicalInfoItem from '../../components/DetailTable/TechnicalInfoItem'
import OwnersTable from '../../components/DetailTable/OwnersTable'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

const GET_USERS_VEHICLE_DETAIL = gql`
  query GetUsersVehicles($input: GetVehicleDetailInput!) {
    getVehicleDetail(input: $input) {
      mainInfo {
        model
        subModel
        regno
        year
        co2
        cubicCapacity
        trailerWithBrakesWeight
        trailerWithoutBrakesWeight
      }
      basicInfo {
        model
        regno
        subModel
        permno
        verno
        year
        country
        preregDateYear
        formerCountry
        importStatus
      }
      registrationInfo {
        firstRegistrationDate
        preRegistrationDate
        newRegistrationDate
        vehicleGroup
        color
        reggroup
        passengers
        useGroup
        driversPassengers
        standingPassengers
      }
      currentOwnerInfo {
        owner
        persidno
        address
        postalcode
        city
        dateOfPurchase
      }
      inspectionInfo {
        type
        date
        result
        plateStatus
        nextInspectionDate
        lastInspectionDate
      }
      technicalInfo {
        engine
        totalWeight
        cubicCapacity
        capacityWeight
        length
        vehicleWeight
        width
        trailerWithoutBrakesWeight
        horsepower
        trailerWithBrakesWeight
        carryingCapacity
        axleTotalWeight
        axle {
          axleMaxWeight
          wheelAxle
        }
      }
      ownersInfo {
        name
        address
        dateOfPurchase
      }
    }
  }
`

const VehicleDetail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.vehicle')
  const { formatMessage } = useLocale()

  PlausiblePageviewDetail(
    ServicePortalPath.AssetsVehiclesDetail.replace(':id', 'detail'),
  )
  const { data, loading, error } = useQuery<Query>(GET_USERS_VEHICLE_DETAIL, {
    variables: {
      input: {
        regno: 'kzp28',
        permno: '',
        vin: '',
      },
    },
  })

  const {
    mainInfo,
    basicInfo,
    registrationInfo,
    currentOwnerInfo,
    inspectionInfo,
    technicalInfo,
    ownersInfo,
  } = data?.getVehicleDetail || {}
  console.log(data)

  const year = mainInfo?.year ? '(' + mainInfo.year + ')' : ''

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {loading ? (
                  <LoadingDots />
                ) : (
                  mainInfo?.model + ' ' + mainInfo?.subModel + ' ' + year
                )}
              </Text>
              <Text>
                {formatMessage({
                  id: 'sp.vehicles:data-info-detail',
                  defaultMessage:
                    'Hér færðu upplýsingar úr ökutækjaskrá um ökutæki sem þú er skráð/ur eigandi að. ',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:type',
            defaultMessage: 'Tegund',
          })}
          content={mainInfo?.model ?? ''}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:subtype',
            defaultMessage: 'Undirtegund',
          })}
          content={mainInfo?.subModel ?? ''}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:number-plate',
            defaultMessage: 'Skráningarnúmer',
          })}
          content={mainInfo?.regno ?? ''}
          loading={loading}
        />
        <Divider />

        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:capacity',
            defaultMessage: 'Slagrými',
          })}
          content={mainInfo?.cubicCapacity?.toString() + ' cc.'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:trailer-with-brakes',
            defaultMessage: 'Hemlaður eftirvagn',
          })}
          content={mainInfo?.trailerWithBrakesWeight?.toString() + ' kg.'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:trailer-without-brakes',
            defaultMessage: 'Óhemlaður eftirvagn',
          })}
          content={mainInfo?.trailerWithoutBrakesWeight?.toString() + ' kg.'}
          loading={loading}
        />
        <Divider />
      </Stack>
      <Box marginBottom={5} />
      {basicInfo && <BaseInfoItem data={basicInfo} />}
      {registrationInfo && <RegistrationInfoItem data={registrationInfo} />}
      {currentOwnerInfo && <OwnerInfoItem data={currentOwnerInfo} />}
      {inspectionInfo && <InspectionInfoItem data={inspectionInfo} />}
      {technicalInfo && <TechnicalInfoItem data={technicalInfo} />}
      {ownersInfo && <OwnersTable data={ownersInfo} />}
    </>
  )
}

export default VehicleDetail
