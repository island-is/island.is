import { ApplicationWithAttachments } from '@island.is/application/types'
import { OperatingLicenseAnswers } from '@island.is/application/templates/operating-license/types'
import {
  APPLICATION_TYPES,
  OPERATION_CATEGORY,
  CATEGORIES,
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
  const category = isHotel
    ? getHotelCategory(answers.applicationInfo.hotel?.category)
    : answers.applicationInfo.resturant?.category === OPERATION_CATEGORY.ONE
    ? 'Flokkur II'
    : 'Flokkur III'

  const type: { [key: string]: string } = isHotel
    ? { tegundGististadar: answers.applicationInfo.hotel?.type || '' }
    : { tegundVeitingastadar: answers.applicationInfo.resturant?.type || '' }

  const extraData: { [key: string]: string } = {
    kallast: answers.info.operationName,
    tegund: 'Rekstrarleyfi gist/veit',
    tegund2: isHotel ? 'Gististaðir' : 'Veitingaleyfi',
    ...type,
    flokkur: category,
    leyfiTilUtiveitinga: getYesNo(answers.openingHours.willServe),
    afgrAfgengisVirkirdagarFra: formatOpeningHours(
      answers.openingHours.alcohol.weekdays.from,
    ),
    afgrAfgengisVirkirdagarTo: formatOpeningHours(
      answers.openingHours.alcohol.weekdays.to,
    ),
    afgrAfgengisAdfaranottFridagaFra: formatOpeningHours(
      answers.openingHours.alcohol.weekends.from,
    ),
    afgrAfgengisAdfaranottFridagaTil: formatOpeningHours(
      answers.openingHours.alcohol.weekends.to,
    ),
    afgrAfgengisVirkirdagarUtiveitingarFra: formatOpeningHours(
      answers.openingHours.outside?.weekdays?.from,
    ),
    afgrAfgengisVirkirdagarUtiveitingarTil: formatOpeningHours(
      answers.openingHours.outside?.weekdays?.to,
    ),
    afgrAfgengisAdfaranottFridagaUtiveitingarFra: formatOpeningHours(
      answers.openingHours.outside?.weekends?.from,
    ),
    afgrAfgengisAdfaranottFridagaUtiveitingarTil: formatOpeningHours(
      answers.openingHours.outside?.weekends?.to,
    ),
    rymi: JSON.stringify(
      answers.properties.map((property) => ({
        stadur: property.address,
        fasteignanumer: property.propertyNumber,
        rymisnumer: property.spaceNumber,
        hamarksfjoldiGesta: property.customerCount,
      })),
    ),
    bradabirgdarleyfi: getYesNo(answers.temporaryLicense),
    skuldastada: getYesNo(answers.debtClaim),
    annad: answers.otherInfoText || '',
    vskNr: answers.info.vskNr,
    upphaed: charge,
  }
  return extraData
}

const getHotelCategory = (category?: OPERATION_CATEGORY[]) => {
  if (!category) {
    return CATEGORIES.HOTEL
  } else if (category.includes(OPERATION_CATEGORY.TWO)) {
    return CATEGORIES.HOTEL_ALCOHOL
  } else if (category.includes(OPERATION_CATEGORY.ONE)) {
    return CATEGORIES.HOTEL_FOOD
  } else {
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

const getYesNo = (arr: string[]) => {
  return arr.includes(YES) ? 'Já' : 'Nei'
}
