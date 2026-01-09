import { defineMessages } from 'react-intl'

export const m = defineMessages({
  invalidVehicleColumnHeader: {
    id: 'api.bulk-vehicle-mileage:invalid-vehicle-column-header',
    defaultMessage:
      'Fastanúmersdálk vantar eða er skrifaður rangt. Dálkanafn þarf að vera eitt af eftirfarandi; "permno", "vehicleid", "bilnumer","okutaeki","fastanumer"',
  },
  invalidMileageColumnHeader: {
    id: 'api.bulk-vehicle-mileage:invalid-mileage-column-header',
    defaultMessage:
      'Kílómetrastöðudálkur er ekki réttur. Dálkanafn þarf að vera eitt af eftirfarandi; "kilometrastada", "mileage", "odometer"',
  },
  tooManyPermno: {
    id: 'api.bulk-vehicle-mileage:too-many-permno',
    defaultMessage: 'Sama fastanúmer birtist oft í skjali',
  },
  missingPermno: {
    id: 'api.bulk-vehicle-mileage:missing-permno',
    defaultMessage: 'Fastanúmer vantar',
  },
  dateMissing: {
    id: 'api.bulk-vehicle-mileage:date-missing',
    defaultMessage: 'Dagsetning álesturs vantar',
  },
  originMissing: {
    id: 'api.bulk-vehicle-mileage:missing-origin',
    defaultMessage: 'Uppruna álesturs vantar',
  },
  mileageMissing: {
    id: 'api.bulk-vehicle-mileage:missing-mileage',
    defaultMessage: 'Álestur vantar',
  },
  mileageTooLow: {
    id: 'api.bulk-vehicle-mileage:mileage-too-low',
    defaultMessage: 'Km staða getur ekki verið minna en 0',
  },
  mileageLowerThanBefore: {
    id: 'api.bulk-vehicle-mileage:mileage-lower-than-before',
    defaultMessage:
      'Km staða álesturs getur ekki verið minni en síðasta gildi sem skráð hefur verið á ökutækið',
  },
  originNotFound: {
    id: 'api.bulk-vehicle-mileage:origin-not-found',
    defaultMessage: 'Staðartegund í álestri finnst ekki',
  },
  carNotFound: {
    id: 'api.bulk-vehicle-mileage:car-not-found',
    defaultMessage: 'Ökutæki finnst ekki',
  },
  dateTooEarly: {
    id: 'api.bulk-vehicle-mileage:date-too-early',
    defaultMessage: 'Dagsetning færslu minni en nýjasta færsla á ökutæki',
  },
  invalidUpdate: {
    id: 'api.bulk-vehicle-mileage:invalid-update',
    defaultMessage: 'Ekki má breyta færslu sem er ekki innan dagsins í dag',
  },
  registerTooEarly: {
    id: 'api.bulk-vehicle-mileage:register-too-early',
    defaultMessage:
      'Villa við skráningu, ekki má skrá innan 30 daga frá síðustu færslu',
  },
  forbiddenUpdate: {
    id: 'api.bulk-vehicle-mileage:forbidden-update',
    defaultMessage: 'Ekki má breyta færslu sem er ekki nýjasta færsla ökutækis',
  },
  unauthorizedUpdater: {
    id: 'api.bulk-vehicle-mileage:unauthorized-updater',
    defaultMessage:
      'Tilkynnandi eða innsendur tilkynnandi er hvorki umráðamaður né eigandi ökutækis',
  },
  invalidMileage: {
    id: 'api.bulk-vehicle-mileage:invalid-mileage',
    defaultMessage: 'Tegund álesturs ekki til',
  },
  invalidDelete: {
    id: 'api.bulk-vehicle-mileage:invalid-delete',
    defaultMessage: 'Aðeins er leyfilegt að eyða nýjustu km skráningu',
  },
  notFoundDelete: {
    id: 'api.bulk-vehicle-mileage:not-found-delete',
    defaultMessage: 'Færsla til að eyða finnst ekki',
  },
  unnecessaryRegistration: {
    id: 'api.bulk-vehicle-mileage:unnecessary-registration',
    defaultMessage: 'Ökutæki krefst ekki aflesturs',
  },
  tooHighMileage: {
    id: 'api.bulk-vehicle-mileage:too-high-mileage',
    defaultMessage: 'Km staða fer yfir hámark per dag',
  },
})
