import isNumber from 'lodash/isNumber'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import {
  Query,
  VehiclesCurrentOwnerInfo,
  VehiclesOperator,
} from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, withClientLocale } from '@island.is/localization'
import {
  amountFormat,
  ErrorScreen,
  formSubmit,
  NotFound,
  ServicePortalModuleComponent,
  TableGrid,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'

import OwnersTable from '../../components/DetailTable/OwnersTable'
import { messages } from '../../lib/messages'
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
import AxleTable from '../../components/DetailTable/AxleTable'
import Dropdown from '../../components/Dropdown/Dropdown'
import { SAMGONGUSTOFA_LINK } from '../../utils/constants'

export const GET_USERS_VEHICLE_DETAIL = gql`
  query GetUsersVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      mainInfo {
        model
        subModel
        regno
        year
        co2
        weightedCo2
        co2Wltp
        weightedCo2Wltp
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
        reggroupName
        passengers
        useGroup
        driversPassengers
        standingPassengers
        plateLocation
        specialName
        plateStatus
      }
      currentOwnerInfo {
        owner
        nationalId
        address
        postalcode
        city
        dateOfPurchase
      }
      inspectionInfo {
        type
        date
        result
        nextInspectionDate
        lastInspectionDate
        insuranceStatus
        mortages
        carTax
        inspectionFine
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
        axles {
          axleMaxWeight
          wheelAxle
        }
        tyres {
          axle1
          axle2
          axle3
          axle4
          axle5
        }
      }
      ownersInfo {
        name
        address
        dateOfPurchase
      }
      coOwners {
        nationalId
        owner
        address
        postalcode
        city
        dateOfPurchase
      }
      operators {
        nationalId
        name
        address
        postalcode
        city
        startDate
        endDate
      }
      downloadServiceURL
    }
  }
`

const VehicleDetail: ServicePortalModuleComponent = () => {
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
    downloadServiceURL,
  } = data?.vehiclesDetail || {}

  const year = mainInfo?.year ? `(${mainInfo.year})` : ''
  const color = registrationInfo?.color ? `- ${registrationInfo.color}` : ''
  const noInfo = data?.vehiclesDetail === null

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.vehicles).toLowerCase(),
        })}
      />
    )
  }
  if (noInfo && !loading) {
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
        {!loading && downloadServiceURL && (
          <GridRow marginTop={6}>
            <GridColumn span="12/12">
              <Box display="flex" justifyContent="flexStart" printHidden>
                <Box paddingRight={2}>
                  <Button
                    colorScheme="default"
                    icon="receipt"
                    iconType="outline"
                    size="default"
                    type="button"
                    variant="utility"
                    onClick={() => formSubmit(`${downloadServiceURL}`)}
                  >
                    {formatMessage(messages.vehicleHistoryReport)}
                  </Button>
                </Box>
                <Box paddingRight={2}>
                  <a
                    href={SAMGONGUSTOFA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      colorScheme="default"
                      icon="open"
                      iconType="outline"
                      size="default"
                      type="button"
                      variant="utility"
                    >
                      {formatMessage(messages.changeOfOwnership)}
                    </Button>
                  </a>
                </Box>
                <Box paddingRight={2}>
                  <Dropdown
                    dropdownItems={[
                      {
                        title: formatMessage(messages.orderRegistrationNumber),
                        href: SAMGONGUSTOFA_LINK,
                      },
                      {
                        title: formatMessage(messages.orderRegistrationLicense),
                        href: SAMGONGUSTOFA_LINK,
                      },
                      {
                        title: formatMessage(messages.addCoOwner),
                        href: SAMGONGUSTOFA_LINK,
                      },
                      {
                        title: formatMessage(messages.addOperator),
                        href: SAMGONGUSTOFA_LINK,
                      },
                    ]}
                  />
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        )}
      </Box>
      <Stack space={2}>
        <UserInfoLine
          label={formatMessage(messages.numberPlate)}
          content={mainInfo?.regno ?? ''}
          editLink={{
            title: messages.orderRegistrationNumber,
            url: SAMGONGUSTOFA_LINK,
            external: true,
          }}
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

        <UserInfoLine
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
        <Divider />

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
      {technicalInfo?.axles && technicalInfo.tyres && (
        <AxleTable axles={technicalInfo?.axles} tyres={technicalInfo?.tyres} />
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

export default withClientLocale('sp.vehicles')(VehicleDetail)
