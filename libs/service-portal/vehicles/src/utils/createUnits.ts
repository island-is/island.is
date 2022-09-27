import chunk from 'lodash/chunk'
import isNumber from 'lodash/isNumber'
import { amountFormat, formatNationalId } from '@island.is/service-portal/core'
import { messages } from '../lib/messages'
import { FormatMessage } from '@island.is/localization'

import {
  VehiclesBasicInfo,
  VehiclesCurrentOwnerInfo,
  VehiclesInspectionInfo,
  VehiclesOperator,
  VehiclesRegistrationInfo,
  VehiclesTechnicalInfo,
} from '@island.is/api/schema'

import { displayWithUnit } from './displayWithUnit'

const basicInfoArray = (
  data: VehiclesBasicInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: { title: formatMessage(messages.baseInfoTitle) },
    rows: chunk(
      [
        {
          title: formatMessage(messages.type),
          value: data.model || '',
        },
        {
          title: formatMessage(messages.regno),
          value: data.regno || '',
        },
        {
          title: formatMessage(messages.subType),
          value: data.subModel || '',
        },
        {
          title: formatMessage(messages.permno),
          value: data.permno || '',
        },
        {
          title: formatMessage(messages.verno),
          value: data.verno || '',
        },
        {
          title: formatMessage(messages.year),
          value: data.year?.toString() || '',
        },
        {
          title: formatMessage(messages.country),
          value: data.country || '',
        },
        {
          title: formatMessage(messages.preRegYear),
          value: data.preregDateYear || '',
        },
        {
          title: formatMessage(messages.preCountry),
          value: data.formerCountry || '',
        },
        {
          title: formatMessage(messages.importStatus),
          value: data.importStatus || '',
        },
      ],
      2,
    ),
  }
}

const coOwnerInfoArray = (
  data: VehiclesCurrentOwnerInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: {
      title: formatMessage(messages.coOwner),
    },
    rows: chunk(
      [
        {
          title: formatMessage(messages.name),
          value: data.owner || '',
        },
        {
          title: formatMessage(messages.nationalId),
          value: data.nationalId ? formatNationalId(data.nationalId) : '',
        },
      ],
      2,
    ),
  }
}

const feeInfoArray = (
  data: VehiclesInspectionInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: {
      title: formatMessage(messages.feeTitle),
    },
    rows: chunk(
      [
        {
          title: formatMessage(messages.mortages),
          value: isNumber(data?.mortages)
            ? amountFormat(Number(data.mortages))
            : '',
        },
        {
          title: formatMessage(messages.insured),
          value:
            data.insuranceStatus === true
              ? formatMessage(messages.yes)
              : data.insuranceStatus === false
              ? formatMessage(messages.no)
              : '',
        },
        {
          title: formatMessage(messages.negligence),
          value: isNumber(data?.inspectionFine)
            ? amountFormat(Number(data.inspectionFine))
            : '',
        },
        {
          title: formatMessage(messages.vehicleFee),
          value: isNumber(data?.carTax)
            ? amountFormat(Number(data.carTax))
            : '',
        },
      ],
      2,
    ),
  }
}

const inspectionInfoArray = (
  data: VehiclesInspectionInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: {
      title: formatMessage(messages.inspectionTitle),
    },
    rows: chunk(
      [
        {
          title: formatMessage(messages.inspectionType),
          value: data.type || '',
        },
        {
          title: formatMessage(messages.result),
          value: data.result || '',
        },
        {
          title: formatMessage(messages.date),
          value: data.date ? new Date(data.date).toLocaleDateString() : '',
        },
        {
          title: formatMessage(messages.nextInspection),
          value: data.nextInspectionDate
            ? new Date(data.nextInspectionDate).toLocaleDateString()
            : '',
        },
      ],
      2,
    ),
  }
}

const operatorInfoArray = (
  data: VehiclesOperator,
  formatMessage: FormatMessage,
) => {
  return {
    header: {
      title: formatMessage(messages.operator),
    },
    rows: chunk(
      [
        {
          title: formatMessage(messages.name),
          value: data.name || '',
        },
        {
          title: formatMessage(messages.nationalId),
          value: data.nationalId ? formatNationalId(data.nationalId) : '',
        },
        {
          title: formatMessage(messages.dateFrom),
          value: data.startDate
            ? new Date(data.startDate).toLocaleDateString()
            : '',
        },
      ],
      2,
    ),
  }
}

const ownerInfoArray = (
  data: VehiclesCurrentOwnerInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: {
      title: formatMessage(messages.owner),
    },
    rows: chunk(
      [
        {
          title: formatMessage(messages.owner),
          value: data.owner || '',
        },
        {
          title: formatMessage(messages.nationalId),
          value: data.nationalId ? formatNationalId(data.nationalId) : '',
        },
        {
          title: formatMessage(messages.purchaseDate),
          value: data.dateOfPurchase
            ? new Date(data.dateOfPurchase).toLocaleDateString()
            : '',
        },
      ],
      2,
    ),
  }
}

const registrationInfoArray = (
  data: VehiclesRegistrationInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: {
      title: formatMessage(messages.regTitle),
    },
    rows: chunk(
      [
        {
          title: formatMessage(messages.firstReg),
          value: data.firstRegistrationDate
            ? new Date(data.firstRegistrationDate).toLocaleDateString()
            : '',
        },
        {
          title: formatMessage(messages.preReg),
          value: data.preRegistrationDate
            ? new Date(data.preRegistrationDate).toLocaleDateString()
            : '',
        },
        {
          title: formatMessage(messages.newReg),
          value: data.newRegistrationDate
            ? new Date(data.newRegistrationDate).toLocaleDateString()
            : '',
        },
        {
          title: formatMessage(messages.vehGroup),
          value: data.vehicleGroup || '',
        },
        {
          title: formatMessage(messages.specialName),
          value: data.specialName || '',
        },
        {
          title: formatMessage(messages.regType),
          value: data.reggroupName || '',
        },
        {
          title: formatMessage(messages.passengers),
          value: data.passengers?.toString() || '',
        },
        {
          title: formatMessage(messages.color),
          value: data.color || '',
        },
        {
          title: formatMessage(messages.driversPassengers),
          value: data.driversPassengers
            ? formatMessage(messages.yes)
            : formatMessage(messages.no),
        },
        {
          title: formatMessage(messages.plateStatus),
          value: data.plateStatus || '',
        },
        {
          title: formatMessage(messages.useGroup),
          value: data.useGroup || '',
        },
        {
          title: formatMessage(messages.plateLocation),
          value: data.plateLocation || '',
        },
        {
          title: formatMessage(messages.standingPassengers),
          value: data.standingPassengers?.toString() || '',
        },
      ],
      2,
    ),
  }
}

const technicalInfoArray = (
  data: VehiclesTechnicalInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: {
      title: formatMessage(messages.techTitle),
    },
    rows: chunk(
      [
        {
          title: formatMessage(messages.engineType),
          value: data.engine || '',
        },
        {
          title: formatMessage(messages.vehicleWeight),
          value: displayWithUnit(data.vehicleWeight?.toString(), 'kg'),
        },
        {
          title: formatMessage(messages.capacity),
          value: displayWithUnit(data.cubicCapacity?.toString(), 'cc'),
        },
        {
          title: formatMessage(messages.capacityWeight),
          value: data.capacityWeight
            ? displayWithUnit(data.capacityWeight?.toString(), 'kg')
            : '',
        },
        {
          title: formatMessage(messages.length),
          value: displayWithUnit(data.length?.toString(), 'mm'),
        },
        {
          title: formatMessage(messages.totalWeight),
          value: displayWithUnit(data.totalWeight?.toString(), 'kg'),
        },
        {
          title: formatMessage(messages.width),
          value: displayWithUnit(data.width?.toString(), 'mm'),
        },
        {
          title: formatMessage(messages.trailerWithoutBrakes),
          value: displayWithUnit(
            data.trailerWithoutBrakesWeight?.toString(),
            'kg',
          ),
        },
        {
          title: formatMessage(messages.horsePower),
          value: displayWithUnit(data.horsepower?.toString(), 'hö'),
        },
        {
          title: formatMessage(messages.trailerWithBrakes),
          value: displayWithUnit(
            data.trailerWithBrakesWeight?.toString(),
            'kg',
          ),
        },
        {
          title: formatMessage(messages.carryingCapacity),
          value: displayWithUnit(data.carryingCapacity?.toString(), 'kg'),
        },
        {
          title: formatMessage(messages.axleTotalWeight),
          value: displayWithUnit(data.axleTotalWeight?.toString(), 'kg'),
        },
      ],
      2,
    ),
  }
}

export {
  basicInfoArray,
  feeInfoArray,
  coOwnerInfoArray,
  inspectionInfoArray,
  operatorInfoArray,
  ownerInfoArray,
  registrationInfoArray,
  technicalInfoArray,
}
