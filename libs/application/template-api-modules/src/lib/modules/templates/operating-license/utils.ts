import { ApplicationWithAttachments } from '@island.is/application/types'
import { OperatingLicenseAnswers } from '@island.is/application/templates/operating-license/types'
import {
  APPLICATION_TYPES,
  OPERATION_CATEGORY,
  CATEGORIES,
  Operation,
  Property,
} from './types/application'
import { YES } from './constants'
import { getValueViaPath } from '@island.is/application/core'

export const getExtraData = (application: ApplicationWithAttachments) => {
  const answers: OperatingLicenseAnswers = application.answers as OperatingLicenseAnswers
  const charge = getValueViaPath(
    application.externalData,
    'payment.data.priceAmount',
  ) as string
  const isHotel = answers.applicationInfo.operation === APPLICATION_TYPES.HOTEL
  const category = getHotelCategory(answers.applicationInfo.category)

  const type: { [key: string]: string } = isHotel
    ? { tegundGististadar: '' } //answers.applicationInfo.type || '' }
    : { tegundVeitingastadar: '' } // answers.applicationInfo.type || '' }

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
    rymi: JSON.stringify(
      [
        answers.properties.stay,
        answers.properties.dining,
        answers.properties.outside,
      ].map((selection: Property[]) =>
        selection.map((property: Property) => ({
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
  }
  return extraData
}

const getHotelCategory = (category?: OPERATION_CATEGORY) => {
  switch (category) {
    case OPERATION_CATEGORY.TWO:
      return CATEGORIES.HOTEL
    case OPERATION_CATEGORY.THREE:
      return CATEGORIES.HOTEL_FOOD
    case OPERATION_CATEGORY.FOUR:
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

  return `${hours}:${minutes}`
}

export const displayOpeningHours = (answers: any) => {
  return (
    (answers.applicationInfo as Operation)?.operation ===
      APPLICATION_TYPES.RESTURANT ||
    (answers.applicationInfo as Operation)?.hotel?.category?.includes(
      OPERATION_CATEGORY.TWO,
    ) ||
    false
  )
}
