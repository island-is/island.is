import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import {
  GaldurDomainModelsSettingsBanksBankDTO,
  GaldurDomainModelsSettingsLedgersLedgerDTO,
} from '@island.is/clients/vmst-unemployment'

export const getBankLedgerValues = (
  externalData: ExternalData,
  bankValue: string,
  ledgerValue: string,
) => {
  const bankOptions =
    getValueViaPath<Array<GaldurDomainModelsSettingsBanksBankDTO>>(
      externalData,
      'currentApplicationInformation.data.supportData.banks',
      [],
    ) || []

  const ledgerOptions =
    getValueViaPath<Array<GaldurDomainModelsSettingsLedgersLedgerDTO>>(
      externalData,
      'currentApplicationInformation.data.supportData.ledgers',
      [],
    ) || []

  return {
    bankId: bankOptions.find((x) => x.id === bankValue)?.bankNo,
    ledgerId: ledgerOptions.find((x) => x.id === ledgerValue)?.number,
  }
}
