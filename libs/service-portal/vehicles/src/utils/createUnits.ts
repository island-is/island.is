import chunk from 'lodash/chunk'
import isNumber from 'lodash/isNumber'
import {
  amountFormat,
  ExcludesFalse,
  formatNationalId,
} from '@island.is/service-portal/core'
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
import isValid from 'date-fns/isValid/index.js'

type LocaleLang = 'en-US' | 'is-IS'

const basicInfoArray = (
  data: VehiclesBasicInfo,
  formatMessage: FormatMessage,
) => {
  return {
    header: { title: formatMessage(messages.baseInfoTitle) },
    rows: chunk(
      [
        data.model && {
          title: formatMessage(messages.type),
          value: data.model,
        },
        data.regno && {
          title: formatMessage(messages.regno),
          value: data.regno,
        },
        data.subModel && {
          title: formatMessage(messages.subType),
          value: data.subModel,
        },
        data.permno && {
          title: formatMessage(messages.permno),
          value: data.permno,
        },
        data.verno && {
          title: formatMessage(messages.verno),
          value: data.verno,
        },
        data.year?.toString() && {
          title: formatMessage(messages.year),
          value: data.year?.toString(),
        },
        data.country && {
          title: formatMessage(messages.country),
          value: data.country,
        },
        data.preregDateYear && {
          title: formatMessage(messages.productYear),
          value: data.preregDateYear,
        },
        data.formerCountry && {
          title: formatMessage(messages.preCountry),
          value: data.formerCountry,
        },
        data.importStatus && {
          title: formatMessage(messages.importStatus),
          value: data.importStatus,
        },
      ].filter(Boolean as unknown as ExcludesFalse),
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
        data.owner && {
          title: formatMessage(messages.name),
          value: data.owner,
        },
        data.nationalId && {
          title: formatMessage(messages.nationalId),
          value: data.nationalId ? formatNationalId(data.nationalId) : '',
        },
      ].filter(Boolean as unknown as ExcludesFalse),
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
          value: isNumber(data?.mortages) && data?.mortages > 0 ? 'Já' : 'Nei',
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
      ].filter(Boolean as unknown as ExcludesFalse),
      2,
    ),
  }
}

const inspectionInfoArray = (
  data: VehiclesInspectionInfo,
  formatMessage: FormatMessage,
  locale: LocaleLang,
) => {
  return {
    header: {
      title: formatMessage(messages.inspectionTitle),
    },
    rows: chunk(
      [
        data.type && {
          title: formatMessage(messages.inspectionType),
          value: data.type,
        },
        data.result && {
          title: formatMessage(messages.result),
          value: data.result,
        },
        data.odometer && {
          title: formatMessage(messages.odometer),
          value: displayWithUnit(data.odometer, 'km', true),
        },
        data.date && {
          title: formatMessage(messages.date),
          value: isValid(new Date(data.date))
            ? new Date(data.date).toLocaleDateString(locale)
            : '',
        },
        data.nextInspectionDate && {
          title: formatMessage(messages.nextInspection),
          value: isValid(new Date(data.nextInspectionDate))
            ? new Date(data.nextInspectionDate).toLocaleDateString(locale)
            : '',
        },
      ].filter(Boolean as unknown as ExcludesFalse),
      2,
    ),
  }
}

const operatorInfoArray = (
  data: VehiclesOperator,
  formatMessage: FormatMessage,
  locale: LocaleLang,
) => {
  return {
    header: {
      title: formatMessage(messages.operator),
    },
    rows: chunk(
      [
        data.name && {
          title: formatMessage(messages.name),
          value: data.name,
        },
        data.nationalId && {
          title: formatMessage(messages.nationalId),
          value: formatNationalId(data.nationalId),
        },
        data.startDate && {
          title: formatMessage(messages.dateFrom),
          value: isValid(new Date(data.startDate))
            ? new Date(data.startDate).toLocaleDateString(locale)
            : '',
        },
      ].filter(Boolean as unknown as ExcludesFalse),
      2,
    ),
  }
}

const ownerInfoArray = (
  data: VehiclesCurrentOwnerInfo,
  formatMessage: FormatMessage,
  locale: LocaleLang,
) => {
  return {
    header: {
      title: formatMessage(messages.owner),
    },
    rows: chunk(
      [
        data.owner && {
          title: formatMessage(messages.owner),
          value: data.owner,
        },
        data.nationalId && {
          title: formatMessage(messages.nationalId),
          value: formatNationalId(data.nationalId),
        },
        data.dateOfPurchase && {
          title: formatMessage(messages.purchaseDate),
          value: isValid(new Date(data.dateOfPurchase))
            ? new Date(data.dateOfPurchase).toLocaleDateString(locale)
            : '',
        },
      ].filter(Boolean as unknown as ExcludesFalse),
      2,
    ),
  }
}

const registrationInfoArray = (
  data: VehiclesRegistrationInfo,
  formatMessage: FormatMessage,
  locale: LocaleLang,
) => {
  return {
    header: {
      title: formatMessage(messages.regTitle),
    },
    rows: chunk(
      [
        data.firstRegistrationDate && {
          title: formatMessage(messages.firstReg),
          value: isValid(new Date(data.firstRegistrationDate))
            ? new Date(data.firstRegistrationDate).toLocaleDateString(locale)
            : '',
        },
        data.preRegistrationDate && {
          title: formatMessage(messages.preReg),
          value: isValid(new Date(data.preRegistrationDate))
            ? new Date(data.preRegistrationDate).toLocaleDateString(locale)
            : '',
        },
        data.newRegistrationDate && {
          title: formatMessage(messages.newReg),
          value: isValid(new Date(data.newRegistrationDate))
            ? new Date(data.newRegistrationDate).toLocaleDateString(locale)
            : '',
        },
        data.vehicleGroup && {
          title: formatMessage(messages.vehGroup),
          value: data.vehicleGroup,
        },
        data.specialName && {
          title: formatMessage(messages.specialName),
          value: data.specialName,
        },
        data.reggroupName && {
          title: formatMessage(messages.regType),
          value: data.reggroupName,
        },
        data.passengers?.toString() && {
          title: formatMessage(messages.passengers),
          value: data.passengers?.toString(),
        },
        data.color && {
          title: formatMessage(messages.color),
          value: data.color,
        },
        {
          title: formatMessage(messages.driversPassengers),
          value: data.driversPassengers
            ? formatMessage(messages.yes)
            : formatMessage(messages.no),
        },
        data.plateStatus && {
          title: formatMessage(messages.plateStatus),
          value: data.plateStatus,
        },
        data.useGroup && {
          title: formatMessage(messages.useGroup),
          value: data.useGroup,
        },
        data.plateLocation && {
          title: formatMessage(messages.plateLocation),
          value: data.plateLocation,
        },
        data.standingPassengers?.toString() && {
          title: formatMessage(messages.standingPassengers),
          value: data.standingPassengers?.toString(),
        },
      ].filter(Boolean as unknown as ExcludesFalse),
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
        data.engine && {
          title: formatMessage(messages.engineType),
          value: data.engine,
        },
        data.vehicleWeight?.toString() && {
          title: formatMessage(messages.vehicleWeight),
          value: displayWithUnit(data.vehicleWeight?.toString(), 'kg'),
        },
        data.cubicCapacity?.toString() && {
          title: formatMessage(messages.capacity),
          value: displayWithUnit(data.cubicCapacity?.toString(), 'cc'),
        },
        data.capacityWeight?.toString() && {
          title: formatMessage(messages.capacityWeight),
          value: data.capacityWeight
            ? displayWithUnit(data.capacityWeight?.toString(), 'kg')
            : '',
        },
        data.length?.toString() && {
          title: formatMessage(messages.length),
          value: displayWithUnit(data.length?.toString(), 'mm'),
        },
        data.totalWeight?.toString() && {
          title: formatMessage(messages.totalWeight),
          value: displayWithUnit(data.totalWeight?.toString(), 'kg'),
        },
        data.width?.toString() && {
          title: formatMessage(messages.width),
          value: displayWithUnit(data.width?.toString(), 'mm'),
        },
        data.trailerWithoutBrakesWeight?.toString() && {
          title: formatMessage(messages.trailerWithoutBrakes),
          value: displayWithUnit(
            data.trailerWithoutBrakesWeight?.toString(),
            'kg',
          ),
        },
        data.horsepower?.toString() && {
          title: formatMessage(messages.horsePower),
          value: displayWithUnit(data.horsepower?.toString(), 'hö'),
        },
        data.trailerWithBrakesWeight?.toString() && {
          title: formatMessage(messages.trailerWithBrakes),
          value: displayWithUnit(
            data.trailerWithBrakesWeight?.toString(),
            'kg',
          ),
        },
        data.carryingCapacity?.toString() && {
          title: formatMessage(messages.carryingCapacity),
          value: displayWithUnit(data.carryingCapacity?.toString(), 'kg'),
        },
      ].filter(Boolean as unknown as ExcludesFalse),
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
