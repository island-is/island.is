import { downloadCSV } from './downloadFile'
import flatten from 'lodash/flatten'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from '../screens/FinanceStatus/FinanceStatusData.types'

export const greidsluStadaHeaders = [
  'Gjaldflokkur',
  'Staða',
  'Umsjónarmaður',
  'Heimasíða',
  'Sími',
  'Netfang',
]

export const exportGreidslustadaCSV = async (data: FinanceStatusDataType) => {
  const name = 'Staða ríkissjóður stofnanir'
  const dataArrays = data.organizations.map(
    (org: FinanceStatusOrganizationType) =>
      org.chargeTypes.map((chargeType) => [
        chargeType.name,
        chargeType.totals,
        org.name,
        org.homepage,
        org.phone,
        org.email,
      ]),
  )

  await downloadCSV(name, greidsluStadaHeaders, flatten(dataArrays))
}

export const exportGreidslustadaXSLX = (data: FinanceStatusDataType) => {
  const dataArrays = data.organizations.map(
    (org: FinanceStatusOrganizationType) =>
      org.chargeTypes.map((chargeType) => [
        chargeType.name,
        chargeType.totals.toString(),
        org.name,
        org.homepage,
        org.phone,
        org.email,
      ]),
  )

  return flatten(dataArrays)
}
