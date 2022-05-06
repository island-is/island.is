import React from 'react'

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
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import BaseInfoItem from '../../components/DetailTable/BaseInfoItem'
import RegistrationInfoItem from '../../components/DetailTable/RegistrationInfoItem'
import OwnerInfoItem from '../../components/DetailTable/OwnerInfoItem'
import InspectionInfoItem from '../../components/DetailTable/InspectionInfoItem'
import TechnicalInfoItem from '../../components/DetailTable/TechnicalInfoItem'
import OwnersTable from '../../components/DetailTable/OwnersTable'
import { gql, useQuery } from '@apollo/client'
import { CurrentOwnerInfo, Query } from '@island.is/api/schema'
import OperatorInfoItem from '../../components/DetailTable/OperatorInfoItem'
import CoOwnerInfoItem from '../../components/DetailTable/CoOwnerInfoItem'
import { useParams } from 'react-router-dom'
import { NoDataScreen } from '@island.is/service-portal/core'

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
      coOwners {
        persidno
        owner
        address
        postalcode
        city
        dateOfPurchase
      }
      operator {
        persidno
        name
        address
        postalcode
        city
        startDate
        endDate
      }
    }
  }
`

const VehicleDetail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.vehicle')
  const { formatMessage } = useLocale()
  const { id }: { id: string | undefined } = useParams()

  const { data, loading, error } = useQuery<Query>(GET_USERS_VEHICLE_DETAIL, {
    variables: {
      input: {
        regno: id,
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
    operator,
    coOwners,
  } = data?.getVehicleDetail || {}
  console.log(data)

  const year = mainInfo?.year ? '(' + mainInfo.year + ')' : ''

  if (error && !loading) {
    return (
      <NotFound
        title={formatMessage({
          id: 'sp.vehicles:not-found',
          defaultMessage: 'Ökutæki fannst ekki',
        })}
      />
    )
  }
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
      {coOwners &&
        coOwners?.length > 0 &&
        coOwners.map((owner: CurrentOwnerInfo, index) => (
          <CoOwnerInfoItem key={index} data={owner} />
        ))}
      {operator && <OperatorInfoItem data={operator} />}
      {ownersInfo && (
        <OwnersTable
          data={ownersInfo}
          title={formatMessage({
            id: 'sp.vehicles:operators-title',
            defaultMessage: 'Eigendaferill',
          })}
        />
      )}
      <Box paddingTop={4}>
        <Text variant="small">
          {formatMessage({
            id: 'sp.vehicles:detail-info-note',
            defaultMessage:
              'Samgöngustofa hefur umsjón með ökutækjaskrá. Í skránni er að finna upplýsingar um ökutæki sem þú er skráð/ur eigandi, meðeigandi og umráðamaður að.',
          })}
        </Text>
      </Box>
    </>
  )
}

export default VehicleDetail
