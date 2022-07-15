import isNumber from 'lodash/isNumber'
import React from 'react'
import { useParams } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import {
  Query,
  VehiclesCurrentOwnerInfo,
  VehiclesOperator,
} from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Divider,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  amountFormat,
  NotFound,
  ServicePortalModuleComponent,
  TableGrid,
  UserInfoLine,
} from '@island.is/service-portal/core'

import OwnersTable from '../../components/DetailTable/OwnersTable'
import { messages } from '../../lib/messages'
import { GET_USERS_VEHICLE_DETAIL } from '../../queries/getUsersVehicleDetail'
import {
  basicInfoArray,
  coOwnerInfoArray,
  feeInfoArray,
  inspectionInfoArray,
  operatorInfoArray,
  ownerInfoArray,
  registrationInfoArray,
  technicalInfoArray,
} from '../../utils/createUnits'
import { displayWithUnit } from '../../utils/displayWithUnit'

const VehicleDetail: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const { id }: { id: string | undefined } = useParams()

  const { data, loading, error } = useQuery<Query>(GET_USERS_VEHICLE_DETAIL, {
    variables: {
      input: {
        regno: '',
        permno: id,
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

  const year = mainInfo?.year ? `(${mainInfo.year})` : ''
  const color = registrationInfo?.color ? `- ${registrationInfo.color}` : ''
  const noInfo = data?.vehiclesDetail === null

  if ((error || noInfo) && !loading) {
    return <NotFound title={formatMessage(messages.notFound)} />
  }

  const basicArr = basicInfo && basicInfoArray(basicInfo, formatMessage)
  const feeArr = inspectionInfo && feeInfoArray(inspectionInfo, formatMessage)
  const inspectionArr =
    inspectionInfo && inspectionInfoArray(inspectionInfo, formatMessage)
  const currentOwnerArr =
    currentOwnerInfo && ownerInfoArray(currentOwnerInfo, formatMessage)
  const registrationArr =
    registrationInfo && registrationInfoArray(registrationInfo, formatMessage)
  const technicalArr =
    technicalInfo && technicalInfoArray(technicalInfo, formatMessage)

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
                  [mainInfo?.model, mainInfo?.subModel, year, color]
                    .filter(Boolean)
                    .join(' ')
                )}
              </Text>
            </Stack>
            {inspectionInfo?.inspectionFine &&
            inspectionInfo.inspectionFine > 0 ? (
              <Box marginTop={5}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(messages.negligence)}
                  message={formatMessage(messages.negligenceText)}
                />
              </Box>
            ) : null}
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <UserInfoLine
          label={formatMessage(messages.numberPlate)}
          content={mainInfo?.regno ?? ''}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.trailerWithBrakes)}
          content={displayWithUnit(
            mainInfo?.trailerWithBrakesWeight?.toString(),
            'kg',
          )}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.trailerWithoutBrakes)}
          content={displayWithUnit(
            mainInfo?.trailerWithoutBrakesWeight?.toString(),
            'kg',
          )}
          loading={loading}
        />
        <Divider />

        {/* <UserInfoLine
          label={formatMessage(messages.insured)}
          content={
            inspectionInfo?.insuranceStatus === true
              ? formatMessage(messages.yes)
              : inspectionInfo?.insuranceStatus === false
              ? formatMessage(messages.no)
              : ''
          }
          warning={inspectionInfo?.insuranceStatus === false}
          loading={loading}
        />
        <Divider /> */}

        <UserInfoLine
          label={formatMessage(messages.unpaidVehicleFee)}
          content={
            isNumber(inspectionInfo?.carTax)
              ? amountFormat(Number(inspectionInfo?.carTax))
              : ''
          }
          loading={loading}
          tooltip={formatMessage(messages.unpaidVehicleFeeText)}
        />
        <Divider />

        {mainInfo?.co2 && (
          <>
            <UserInfoLine
              label={formatMessage(messages.nedc)}
              content={displayWithUnit(String(mainInfo.co2), 'g/km')}
              loading={loading}
            />
            <Divider />
          </>
        )}

        {mainInfo?.weightedCo2 && (
          <>
            <UserInfoLine
              label={formatMessage(messages.nedcWeighted)}
              content={displayWithUnit(String(mainInfo.weightedCo2), 'g/km')}
              loading={loading}
            />
            <Divider />
          </>
        )}

        {mainInfo?.co2Wltp && (
          <>
            <UserInfoLine
              label={formatMessage(messages.wltp)}
              content={displayWithUnit(String(mainInfo.co2Wltp), 'g/km')}
              loading={loading}
            />
            <Divider />
          </>
        )}

        {mainInfo?.weightedCo2Wltp && (
          <>
            <UserInfoLine
              label={formatMessage(messages.wltpWeighted)}
              content={displayWithUnit(
                String(mainInfo.weightedCo2Wltp),
                'g/km',
              )}
              loading={loading}
            />
            <Divider />
          </>
        )}
      </Stack>
      <Box marginBottom={5} />

      {basicArr && (
        <TableGrid dataArray={basicArr.rows} title={basicArr.header.title} mt />
      )}
      {registrationArr && (
        <TableGrid
          dataArray={registrationArr.rows}
          title={registrationArr.header.title}
          mt
        />
      )}

      {currentOwnerArr && (
        <TableGrid
          dataArray={currentOwnerArr.rows}
          title={currentOwnerArr.header.title}
          mt
        />
      )}

      {coOwners &&
        coOwners.length > 0 &&
        coOwners.map((owner: VehiclesCurrentOwnerInfo, index) => {
          const coOwnerArr = coOwnerInfoArray(owner, formatMessage)
          return (
            <TableGrid
              key={`vehicle-coOwner-${index}`}
              dataArray={coOwnerArr.rows}
              title={coOwnerArr.header.title}
              mt
            />
          )
        })}
      {inspectionArr && (
        <TableGrid
          dataArray={inspectionArr.rows}
          title={inspectionArr.header.title}
          mt
        />
      )}
      {feeArr && (
        <TableGrid dataArray={feeArr.rows} title={feeArr.header.title} mt />
      )}

      {technicalArr && (
        <TableGrid
          dataArray={technicalArr.rows}
          title={technicalArr.header.title}
          mt
        />
      )}

      {operators &&
        operators.length > 0 &&
        operators.map((operator: VehiclesOperator, index) => {
          const operatorArr = operatorInfoArray(operator, formatMessage)
          return (
            <TableGrid
              key={`vehicle-operator-${index}`}
              dataArray={operatorArr.rows}
              title={operatorArr.header.title}
              mt
            />
          )
        })}
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
