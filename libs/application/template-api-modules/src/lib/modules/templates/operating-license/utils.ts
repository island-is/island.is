import {
  ApplicationWithAttachments,
  PaymentCatalogItem,
} from '@island.is/application/types'
import { OperatingLicenseAnswers } from '@island.is/application/templates/operating-license/types'
import {
  ApplicationTypes,
  OperationCategory,
  CATEGORIES,
  Operation,
  Property,
  BankruptcyHistoryResult,
} from './types/application'
import { getValueViaPath, YES } from '@island.is/application/core'

export const getExtraData = (application: ApplicationWithAttachments) => {
  const answers: OperatingLicenseAnswers =
    application.answers as OperatingLicenseAnswers
  const chargeItems = getValueViaPath<PaymentCatalogItem[]>(
    application.externalData,
    'payment.data',
  )
  const bankruptcyHistory = getValueViaPath<BankruptcyHistoryResult>(
    application.externalData,
    'courtBankruptcyCert.data',
  )
  const { chargeItemCode } = answers
  const charge =
    chargeItems
      ?.find((item) => item.chargeItemCode === chargeItemCode)
      ?.priceAmount.toString() || ''
  const isHotel = answers.applicationInfo.operation === ApplicationTypes.HOTEL
  const category = getHotelCategory(answers.applicationInfo.category)

  const type: { [key: string]: string } = isHotel
    ? { tegundGististadar: answers.applicationInfo.typeHotel || '' }
    : {
        tegundVeitingastadar:
          JSON.stringify(answers.applicationInfo.typeResturant) || '',
      }

  const extraData: { [key: string]: string } = {
    kallast: answers.info.operationName,
    tegund: 'Rekstrarleyfi gist/veit',
    tegund2: isHotel ? 'Gististaðir' : 'Veitingaleyfi',
    ...type,
    flokkur: category,
    leyfiTilUtiveitinga: answers.openingHours?.willServe?.includes(YES)
      ? 'Já'
      : 'Nei',
    ...(displayOpeningHours(answers)
      ? {
          afgrAfgengisVirkirdagarFra: formatOpeningHours(
            answers.openingHours?.alcohol?.weekdays?.from,
          ),
          afgrAfgengisVirkirdagarTo: formatOpeningHours(
            answers.openingHours?.alcohol?.weekdays?.to,
          ),
          afgrAfgengisAdfaranottFridagaFra: formatOpeningHours(
            answers.openingHours?.alcohol?.weekends?.from,
          ),
          afgrAfgengisAdfaranottFridagaTil: formatOpeningHours(
            answers.openingHours?.alcohol?.weekends?.to,
          ),
          afgrAfgengisVirkirdagarUtiveitingarFra: formatOpeningHours(
            answers.openingHours?.outside?.weekdays?.from,
          ),
          afgrAfgengisVirkirdagarUtiveitingarTil: formatOpeningHours(
            answers.openingHours?.outside?.weekdays?.to,
          ),
          afgrAfgengisAdfaranottFridagaUtiveitingarFra: formatOpeningHours(
            answers.openingHours?.outside?.weekends?.from,
          ),
          afgrAfgengisAdfaranottFridagaUtiveitingarTil: formatOpeningHours(
            answers.openingHours?.outside?.weekends?.to,
          ),
        }
      : {}),
    gistirymi: JSON.stringify(
      [answers.properties.stay as Property[]].map((selection: Property[]) =>
        selection?.map((property: Property) => ({
          stadur: property.address,
          fasteignanumer: property.propertyNumber,
          rymisnumer: property.spaceNumber,
          hamarksfjoldiGesta: property.customerCount,
        })),
      ),
    ),
    veitingarymi: JSON.stringify(
      [answers.properties.dining as Property[]].map((selection: Property[]) =>
        selection?.map((property: Property) => ({
          stadur: property.address,
          fasteignanumer: property.propertyNumber,
          rymisnumer: property.spaceNumber,
          hamarksfjoldiGesta: property.customerCount,
        })),
      ),
    ),
    utirymi: JSON.stringify(
      [answers.properties.outside as Property[]].map((selection: Property[]) =>
        selection?.map((property: Property) => ({
          stadur: property.address,
          fasteignanumer: property.propertyNumber,
          rymisnumer: property.spaceNumber,
          hamarksfjoldiGesta: property.customerCount,
        })),
      ),
    ),
    bradabirgdarleyfi: answers.temporaryLicense?.includes(YES) ? 'Já' : 'Nei',
    skuldastada: answers.debtClaim?.includes(YES) ? 'Já' : 'Nei',
    annad: answers.otherInfoText || '',
    vskNr: answers.info.vskNr,
    upphaed: charge,
    busforraedisvottord: JSON.stringify(bankruptcyHistory),
  }
  return extraData
}

const getHotelCategory = (category?: OperationCategory) => {
  switch (category) {
    case OperationCategory.TWO:
      return CATEGORIES.HOTEL
    case OperationCategory.THREE:
      return CATEGORIES.HOTEL_FOOD
    case OperationCategory.FOUR:
      return CATEGORIES.HOTEL_ALCOHOL
    default:
      return CATEGORIES.HOTEL
  }
}
const getHoursMinutes = (value: string) => {
  return {
    hours: parseInt(value.slice(0, 2)),
    minutes: parseInt(value.slice(2, 4)),
  }
}

const formatOpeningHours = (value?: string) => {
  if (!value) {
    return ''
  }
  const { hours, minutes } = getHoursMinutes(value)

  return `${hours > 10 ? hours : '0' + hours}:${
    minutes > 10 ? minutes : '0' + minutes
  }`
}

export const displayOpeningHours = (answers: any) => {
  return (
    (answers.applicationInfo as Operation)?.operation ===
      ApplicationTypes.RESTURANT ||
    !(answers.applicationInfo as Operation)?.category?.includes(
      OperationCategory.TWO,
    ) ||
    false
  )
}
