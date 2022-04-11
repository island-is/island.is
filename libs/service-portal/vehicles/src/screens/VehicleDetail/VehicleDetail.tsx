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
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  vehicleDetail,
  vehicleDetailReal,
  basicInfo,
  currentOwner,
  inspectionInfo,
  owners,
  registration,
  technicalInfo,
} from '../../mock/vehiclesList'
import BaseInfoItem from '../../components/DetailTable/BaseInfoItem'
import RegistrationInfoItem from '../../components/DetailTable/RegistrationInfoItem'
import OwnerInfoItem from '../../components/DetailTable/OwnerInfoItem'
import InspectionInfoItem from '../../components/DetailTable/InspectionInfoItem'
import TechnicalInfoItem from '../../components/DetailTable/TechnicalInfoItem'
import OwnersTable from '../../components/DetailTable/OwnersTable'

const VehicleDetail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.vehicle')
  const { formatMessage } = useLocale()

  PlausiblePageviewDetail(
    ServicePortalPath.AssetsVehiclesDetail.replace(':id', 'detail'),
  )

  const year = dateParse(
    vehicleDetailReal.firstregdate.replace('-', ''),
  ).getFullYear()
  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {vehicleDetailReal.make +
                  ' ' +
                  vehicleDetailReal.vehcom +
                  ' (' +
                  year +
                  ')'}
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
          content={vehicleDetailReal.make}
          loading={false}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:subtype',
            defaultMessage: 'Undirtegund',
          })}
          content={
            vehicleDetailReal.vehcom +
            (vehicleDetailReal.speccom ? ' ' + vehicleDetailReal.speccom : '')
          }
          loading={false}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:number-plate',
            defaultMessage: 'Skráningarnúmer',
          })}
          content={vehicleDetailReal.regno}
          loading={false}
        />
        <Divider />

        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:capacity',
            defaultMessage: 'Slagrými',
          })}
          content={vehicleDetailReal.techincal.capacity.toString() + ' cc.'}
          loading={false}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:trailer-with-brakes',
            defaultMessage: 'Hemlaður eftirvagn',
          })}
          content={vehicleDetailReal.techincal.tMassoftrbr.toString() + ' kg.'}
          loading={false}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage({
            id: 'sp.vehicles:trailer-without-brakes',
            defaultMessage: 'Óhemlaður eftirvagn',
          })}
          content={
            vehicleDetailReal.techincal.tMassoftrunbr.toString() + ' kg.'
          }
          loading={false}
        />
        <Divider />
      </Stack>
      <Box marginBottom={5} />
      <BaseInfoItem data={basicInfo} />
      <RegistrationInfoItem data={registration} />
      <OwnerInfoItem data={currentOwner} />
      <InspectionInfoItem data={inspectionInfo} />
      <TechnicalInfoItem data={technicalInfo} />
      <OwnersTable data={owners} />
    </>
  )
}

export default VehicleDetail
