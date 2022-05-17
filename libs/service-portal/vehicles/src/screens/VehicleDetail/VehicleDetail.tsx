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
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { GET_USERS_VEHICLE_DETAIL } from '../../queries/getUsersVehicleDetail'
import {
  VehiclesCurrentOwnerInfo,
  Query,
  VehiclesOperator,
} from '@island.is/api/schema'
import { messages } from '../../lib/messages'
import BaseInfoItem from '../../components/DetailTable/BaseInfoItem'
import RegistrationInfoItem from '../../components/DetailTable/RegistrationInfoItem'
import OwnerInfoItem from '../../components/DetailTable/OwnerInfoItem'
import InspectionInfoItem from '../../components/DetailTable/InspectionInfoItem'
import TechnicalInfoItem from '../../components/DetailTable/TechnicalInfoItem'
import OwnersTable from '../../components/DetailTable/OwnersTable'
import OperatorInfoItem from '../../components/DetailTable/OperatorInfoItem'
import CoOwnerInfoItem from '../../components/DetailTable/CoOwnerInfoItem'

const VehicleDetail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.vehicles')
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
    operators,
    coOwners,
  } = data?.vehiclesDetail || {}

  const year = mainInfo?.year ? '(' + mainInfo.year + ')' : ''

  if (error && !loading) {
    return <NotFound title={formatMessage(messages.notFound)} />
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
              <Text>{formatMessage(messages.introDetail)}</Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <UserInfoLine
          label={formatMessage(messages.type)}
          content={mainInfo?.model ?? ''}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.subType)}
          content={mainInfo?.subModel ?? ''}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.numberPlate)}
          content={mainInfo?.regno ?? ''}
          loading={loading}
        />
        <Divider />

        <UserInfoLine
          label={formatMessage(messages.capacity)}
          content={mainInfo?.cubicCapacity?.toString() + ' cc.'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.trailerWithBrakes)}
          content={mainInfo?.trailerWithBrakesWeight?.toString() + ' kg.'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.trailerWithoutBrakes)}
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
        coOwners.length > 0 &&
        coOwners.map((owner: VehiclesCurrentOwnerInfo, index) => (
          <CoOwnerInfoItem key={index} data={owner} />
        ))}
      {operators &&
        operators.length > 0 &&
        operators.map((operator: VehiclesOperator, index) => (
          <OperatorInfoItem key={index} data={operator} />
        ))}
      {ownersInfo && (
        <OwnersTable
          data={ownersInfo}
          title={formatMessage(messages.ownersTitle)}
        />
      )}
      <Box paddingTop={4}>
        <Text variant="small">{formatMessage(messages.infoNote)}</Text>
      </Box>
    </>
  )
}

export default VehicleDetail
