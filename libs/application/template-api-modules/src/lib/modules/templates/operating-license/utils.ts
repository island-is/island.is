import { ApplicationWithAttachments } from '@island.is/application/types'
import { OperatingLicenseAnswers } from '@island.is/application/templates/operating-license/types'
import {
  APPLICATION_TYPES,
  ExtraData,
  Operation,
  OPERATION_CATEGORY,
  CATEGORIES,
  OpeningHour,
} from './types/application'
import { YES } from './constants'

export const getExtraData = (
  application: ApplicationWithAttachments,
) => {
  const answers: OperatingLicenseAnswers = application.answers as OperatingLicenseAnswers

  const isHotel = answers.applicationInfo.operation === APPLICATION_TYPES.HOTEL
  const outside = answers.openingHours.willServe.includes(YES)
  const category = isHotel
    ? getHotelCategory(answers.applicationInfo.hotel?.category)
    : answers.applicationInfo.resturant?.category === OPERATION_CATEGORY.ONE
    ? 'Flokkur II'
    : 'Flokkur III'
  const extraData: { [key: string]: string }  = {
    kallast: answers.info.operationName,
    netfang: answers.info.email,
    simanumer: answers.info.phoneNumber,
    tegund: 'Rekstrarleyfi gist/veit',
    tegund2: isHotel ? 'Gististaðir' : 'Veitingaleyfi',
    tegundReksturs:
      (isHotel
        ? answers.applicationInfo.hotel?.type
        : answers.applicationInfo.resturant?.type) || '',
    flokkur: category,
    leyfiTilUtiveitinga: outside ? 'Já' : 'Nei',
    afgrAfgengisVirkirdagar: formatOpeningHours(
      answers.openingHours.alcohol.weekdays,
    ),
    afgrAfgengisAdfaranottFridaga: formatOpeningHours(
      answers.openingHours.alcohol.weekends,
    ),
    afgrAfgengisVirkirdagarUtiveitingar:
      outside && answers.openingHours.outside?.weekends
        ? formatOpeningHours(answers.openingHours.outside?.weekdays)
        : '',
    afgrAfgengisAdfaranottFridagaUtiveitingar:
      outside && answers.openingHours.outside?.weekends
        ? formatOpeningHours(answers.openingHours.outside?.weekends)
        : '',
    rymi: JSON.stringify(answers.properties.map((property) => ({
      stadur: property.address,
      fasteignanumer: property.propertyNumber,
      rymisnumer: property.spaceNumber,
      hamarksfjoldiGesta: property.customerCount,
    }))),
    bradabirgdarleyfi: answers.temporaryLicense.includes(YES) ? 'Já' : 'Nei',
    skuldastada: answers.debtClaim.includes(YES) ? 'Já' : 'Nei',
    annad: answers.otherInfoText || '',
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

const formatOpeningHours = ({ to, from }: OpeningHour) => {
  const { hours: toHours, minutes: toMinutes } = getHoursMinutes(to)
  const { hours: fromHours, minutes: fromMinutes } = getHoursMinutes(from)

  return `${toHours}:${toMinutes} - ${fromHours}:${fromMinutes}`
}
