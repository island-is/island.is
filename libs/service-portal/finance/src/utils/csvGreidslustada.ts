import { downloadCSV } from './downloadCSV'
import flatten from 'lodash/flatten'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from '../screens/FinanceStatus/FinanceStatusData.types'

const greidsluStadaHeaders = [
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
        org['e-mail'],
      ]),
  )

  await downloadCSV(name, greidsluStadaHeaders, flatten(dataArrays))
}
