import isNumber from 'lodash/isNumber'
import React from 'react'
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
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  amountFormat,
  ErrorScreen,
  formSubmit,
  NotFound,
  TableGrid,
  UserInfoLine,
  m,
  FootNote,
  SAMGONGUSTOFA_ID,
  IntroHeader,
} from '@island.is/service-portal/core'

import OwnersTable from '../../components/DetailTable/OwnersTable'
import { vehicleMessage as messages, urls } from '../../lib/messages'
import {
  basicInfoArray,
  coOwnerInfoArray,
  feeInfoArray,
  inspectionInfoArray,
  operatorInfoArray,
  ownerInfoArray,
  registrationInfoArray,
  technicalInfoArray,
} from '../../utils/createVehicleUnits'
import { displayWithUnit } from '../../utils/displayWithUnit'
import AxleTable from '../../components/DetailTable/AxleTable'
import Dropdown from '../../components/Dropdown/Dropdown'
import { getDateLocale } from '../../utils/constants'

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
        odometer
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

type UseParams = {
  id: string
}

const VehicleDetail = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

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

  const locale = getDateLocale(lang)
  const basicArr = basicInfo && basicInfoArray(basicInfo, formatMessage)
  const feeArr = inspectionInfo && feeInfoArray(inspectionInfo, formatMessage)
  const inspectionArr =
    inspectionInfo && inspectionInfoArray(inspectionInfo, formatMessage, locale)
  const currentOwnerArr =
    currentOwnerInfo && ownerInfoArray(currentOwnerInfo, formatMessage, locale)
  const registrationArr =
    registrationInfo &&
    registrationInfoArray(registrationInfo, formatMessage, locale)
  const technicalArr =
    technicalInfo && technicalInfoArray(technicalInfo, formatMessage)

  const hasPrivateRegistration = basicInfo?.permno !== basicInfo?.regno

  const dropdownArray = [
    {
      title: formatMessage(messages.orderRegistrationLicense),
      href: formatMessage(urls.regCert),
    },
    {
      title: formatMessage(messages.addCoOwner),
      href: formatMessage(urls.coOwnerChange),
    },
    {
      title: formatMessage(messages.addOperator),
      href: formatMessage(urls.operator),
    },
  ]

  if (hasPrivateRegistration) {
    dropdownArray.unshift({
      title: formatMessage(messages.renewPrivateRegistration),
      href: formatMessage(urls.renewPrivate),
    })
  } else {
    dropdownArray.unshift({
      title: formatMessage(messages.orderRegistrationNumber),
      href: formatMessage(urls.regNumber),
    })
  }

  return (
    <>
      <Box marginBottom={[2, 2, 6]}>
        <GridRow>
          <GridColumn span={'9/9'}>
            <IntroHeader
              title={[mainInfo?.model, mainInfo?.subModel, year, color]
                .filter(Boolean)
                .join(' ')}
              intro={messages.intro}
              serviceProviderID={SAMGONGUSTOFA_ID}
              serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
              loading={loading}
            />
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
          <GridRow marginTop={0}>
            <GridColumn span="9/9">
              <Box display="flex" justifyContent="flexStart" printHidden>
                <Box paddingRight={2} marginBottom={[1, 1, 1, 0]}>
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
                  <Dropdown
                    label={formatMessage(messages.actions)}
                    dropdownItems={dropdownArray}
                  />
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        )}
      </Box>
      <Stack space={2}>
        {hasPrivateRegistration ? (
          <UserInfoLine
            label={formatMessage(messages.numberPlate)}
            content={basicInfo?.permno ?? ''}
            editLink={{
              title: messages.renewPrivateRegistration,
              url: formatMessage(urls.renewPrivate),
              external: true,
            }}
            loading={loading}
          />
        ) : (
          <UserInfoLine
            label={formatMessage(messages.numberPlate)}
            content={mainInfo?.regno ?? ''}
            editLink={{
              title: messages.orderRegistrationNumber,
              url: formatMessage(urls.regNumber),
              external: true,
            }}
            loading={loading}
          />
        )}
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
          const operatorArr = operatorInfoArray(operator, formatMessage, locale)
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

      <FootNote
        serviceProviderID={SAMGONGUSTOFA_ID}
        notes={[{ text: formatMessage(messages.infoNote) }]}
      />
    </>
  )
}

export default VehicleDetail
