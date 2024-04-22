import { Application, ExternalData } from '@island.is/application/types'
import { GrindavikHousingBuyout } from '../lib/dataSchema'
import { calculateTotalLoanFromAnswers } from './loan'
import { Fasteign } from '@island.is/clients/assets'

const getHousingDataFromExternalData = (externalData: ExternalData) => {
  return externalData?.getGrindavikHousing.data as Fasteign
}

export const getFireInsuranceValue = (externalData: ExternalData) => {
  const housingData = getHousingDataFromExternalData(externalData)
  return (
    housingData.notkunareiningar?.notkunareiningar?.reduce((acc, unit) => {
      return acc + (unit.brunabotamat || 0)
    }, 0) ?? 0
  )
}

export const getPropertyOwners = (externalData: ExternalData) => {
  const housingData = getHousingDataFromExternalData(externalData)
  return housingData.thinglystirEigendur?.thinglystirEigendur || []
}

export const calculateBuyoutPrice = (application: Application) => {
  const answers = application.answers as GrindavikHousingBuyout
  const totalLoans = calculateTotalLoanFromAnswers(answers)
  const fireInsuranceValue = getFireInsuranceValue(application.externalData)
  const buyoutPrice = fireInsuranceValue * 0.95
  const buyoutPriceWithLoans = buyoutPrice - totalLoans
  const closingPayment = 0.05 * buyoutPrice
  const result = buyoutPriceWithLoans - closingPayment

  return {
    fireInsuranceValue,
    closingPayment,
    totalLoans,
    buyoutPriceWithLoans,
    buyoutPrice,
    result,
  }
}

export const getPropertyAddress = (externalData: ExternalData) => {
  const housingData = getHousingDataFromExternalData(externalData)
  return housingData.sjalfgefidStadfang?.birting ?? ''
}
