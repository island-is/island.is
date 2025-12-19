import { defineMessages } from 'react-intl'

export const selectVehicle = {
  general: defineMessages({
    sectionTitle: {
      id: 'mcar.application:information.general.sectionTitle',
      defaultMessage: 'Ökutæki',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'mcar.application:information.general.pageTitle',
      defaultMessage: 'Veldu ökutæki sem á að skrá sem mílubíl',
      description: 'Title of information page',
    },
    description: {
      id: 'mcar.application:information.general.description',
      defaultMessage:
        'Hér að neðan er listi yfir ökutæki í þinni eigu. Veldu það ökutæki sem á að breyta skráningu á.',
      description: 'Description of information page',
    },
  }),
  labels: defineMessages({
    title: {
      id: 'mcar.application:information.labels.pickVehicle.title',
      defaultMessage: 'Veldu ökutæki til eigendaskipta',
      description: 'Pick vehicle title',
    },
    description: {
      id: 'mcar.application:information.labels.pickVehicle.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
      description: 'Pick vehicle description',
    },
    submit: {
      id: 'mcar.application:information.labels.pickVehicle.submit',
      defaultMessage: 'Breyta skráningu',
      description: 'Pick vehicle submit button',
    },
    vehicle: {
      id: 'mcar.application:information.labels.pickVehicle.vehicle',
      defaultMessage: 'Ökutæki',
      description: 'Pick vehicle label',
    },
    placeholder: {
      id: 'mcar.application:information.labels.pickVehicle.placeholder',
      defaultMessage: 'Veldu ökutæki',
      description: 'Pick vehicle placeholder',
    },
    findPlatePlaceholder: {
      id: 'mcar.application:information.labels.pickVehicle.findPlatePlaceholder',
      defaultMessage: 'Sláðu inn plötunúmer',
      description: 'Pick vehicle find plate placeholder',
    },
    findButton: {
      id: 'mcar.application:information.labels.pickVehicle.findButton',
      defaultMessage: 'Leita',
      description: 'Pick vehicle find button',
    },
    notFoundTitle: {
      id: 'mcar.application:information.labels.pickVehicle.notFoundTitle',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: 'vehicle not found',
    },
    notFoundMessage: {
      id: 'mcar.application:information.labels.pickVehicle.notFoundMessage',
      defaultMessage: 'Ökutæki með plötunúmerið {plate} fannst ekki',
      description: 'vehicle not found message',
    },
    hasErrorTitle: {
      id: 'mcar.application:information.labels.pickVehicle.hasErrorTitle',
      defaultMessage: 'Ekki er hægt að selja þessa bifreið vegna:',
      description: 'Pick vehicle has an error title',
    },
    isNotDebtLessTag: {
      id: 'mcar.application:information.labels.pickVehicle.isNotDebtLessTag',
      defaultMessage: 'Ógreidd bifreiðagjöld',
      description: 'Pick vehicle is not debt less tag',
    },
    plate: {
      id: 'mcar.application:information.labels.vehicle.plate',
      defaultMessage: 'Númer ökutækis',
      description: 'Vehicle plate number label',
    },
    type: {
      id: 'mcar.application:information.labels.vehicle.type',
      defaultMessage: 'Tegund ökutækis',
      description: 'Vehicle type label',
    },
    salePrice: {
      id: 'mcar.application:information.labels.vehicle.salePrice',
      defaultMessage: 'Söluverð (kr.)',
      description: 'Sale price for vehicle label',
    },
    purchasePrice: {
      id: 'mcar.application:information.labels.vehicle.purchasePrice',
      defaultMessage: 'Kaupverð (kr.)',
      description: 'Purchase price for vehicle label',
    },
    date: {
      id: 'mcar.application:information.labels.vehicle.date',
      defaultMessage: 'Dagsetning kaupsamnings',
      description: 'Date of purchase agreement label',
    },
    mileage: {
      id: 'mcar.application:information.labels.vehicle.mileage',
      defaultMessage: 'Kílómetrar',
      description: 'Mileage for vehicle label',
    },
  }),
  validation: defineMessages({
    alertTitle: {
      id: 'mcar.application:applicationCheck.validation.alertTitle',
      defaultMessage: 'Það kom upp villa',
      description: 'Application check validation alert title',
    },
    fallbackErrorMessage: {
      id: 'mcar.application:applicationCheck.validation.fallbackErrorMessage',
      defaultMessage: 'Það kom upp villa við að sannreyna gögn',
      description: 'Fallback error message for validation',
    },
    E2: {
      id: 'mcar.application:applicationCheck.validation.E2',
      defaultMessage:
        'Kaupdagur er á undan síðasta kaupdegi, breyta þarf kaupdegi áður en eigendaskipti fara fram.',
      description: 'Message for validation error no 2',
    },
    E43: {
      id: 'mcar.application:applicationCheck.validation.E43',
      defaultMessage:
        'Ökutækið er afskráð týnt, endurskrá þarf ökutækið áður en eigendaskipti eru framkvæmd.',
      description: 'Message for validation error no 43',
    },
    E47: {
      id: 'mcar.application:applicationCheck.validation.E47',
      defaultMessage:
        'Ekki má hafa eigandaskipti á ökutæki sem hefur verið skráð til úrvinnslu',
      description: 'Message for validation error no 47',
    },
    E48: {
      id: 'mcar.application:applicationCheck.validation.E48',
      defaultMessage:
        'Ökutæki með ferðaþjónustuleyfi, þarf að fara í breytingaskoðun og breyta í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 48',
    },
    E49: {
      id: 'mcar.application:applicationCheck.validation.E49',
      defaultMessage:
        'Ökutæki í ökutækjaleigu og með ferðaþjónustuleyfi, þarf að fara í breytingaskoðun og breyta í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 49',
    },
    E50: {
      id: 'mcar.application:applicationCheck.validation.E50',
      defaultMessage:
        'Ökutæki með ferðaþjónustuleyfi, þarf að fara í breytingaskoðun og breyta í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 50',
    },
    E58: {
      id: 'mcar.application:applicationCheck.validation.E58',
      defaultMessage:
        'Eigendaskiptaálestur hefur ekki farið fram innan sjö daga, lesa þarf af ökutækinu',
      description: 'Message for validation error no 58',
    },
    E61: {
      id: 'mcar.application:applicationCheck.validation.E61',
      defaultMessage:
        'Kaupandi er ekki fjárráða, þarf að óska eftir leyfi sýslumanns. Ekki hægt að gera rafræn eigendaskipti',
      description: 'Message for validation error no 61',
    },
    E62: {
      id: 'mcar.application:applicationCheck.validation.E62',
      defaultMessage:
        'Seljandi er ekki fjárráða, þarf að óska eftir leyfi sýslumanns. Ekki hægt að gera rafræn eigendaskipti',
      description: 'Message for validation error no 62',
    },
    E63: {
      id: 'mcar.application:applicationCheck.validation.E63',
      defaultMessage:
        'Ökutækið er á sendiráðsmerkjum, setja þarf ökutækið á almenn merki fyrir sölu',
      description: 'Message for validation error no 63',
    },
    E64: {
      id: 'mcar.application:applicationCheck.validation.E64',
      defaultMessage:
        'Ökutækið er skráð í neyðarakstur, þarf að fara í breytingaskoðun og setja í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 64',
    },
    E66: {
      id: 'mcar.application:applicationCheck.validation.E66',
      defaultMessage:
        'Skráður er rétthafi af fornmerkjum, ef merkið á að fylgja bílnum þarf rétthafinn að framvísa því til kaupanda. Ekki hægt að gera rafræn eigendaskipti.',
      description: 'Message for validation error no 66',
    },
    E67: {
      id: 'mcar.application:applicationCheck.validation.E67',
      defaultMessage:
        'Eigendaskiptaálestur fór fram í dag, ekki hægt að gera eigendaskipti samdægurs vegna álagningar þungaskatts.',
      description: 'Message for validation error no 67',
    },
    E68: {
      id: 'mcar.application:applicationCheck.validation.E68',
      defaultMessage:
        'Eigendaskiptaálestur hefur ekki farið fram innan sjö daga, lesa þarf af ökutækinu',
      description: 'Message for validation error no 68',
    },
    E69: {
      id: 'mcar.application:applicationCheck.validation.E69',
      defaultMessage:
        'Eigendaskiptaálestur hefur ekki farið fram innan sjö daga, lesa þarf af ökutækinu',
      description: 'Message for validation error no 69',
    },
    E70: {
      id: 'mcar.application:applicationCheck.validation.E70',
      defaultMessage:
        'Ökutæki með ferðaþjónustuleyfi, þarf að fara í breytingaskoðun og breyta í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 70',
    },
    E71: {
      id: 'mcar.application:applicationCheck.validation.E71',
      defaultMessage:
        'Ökutæki í ökutækjaleigu og með ferðaþjónustuleyfi, þarf að fara í breytingaskoðun og breyta í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 71',
    },
    E72: {
      id: 'mcar.application:applicationCheck.validation.E72',
      defaultMessage:
        'Ökutæki með ferðaþjónustuleyfi, þarf að fara í breytingaskoðun og breyta í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 72',
    },
    E74: {
      id: 'mcar.application:applicationCheck.validation.E74',
      defaultMessage:
        'Ökutæki í ökutækjaleigu og með ferðaþjónustuleyfi, þarf að fara í breytingaskoðun og breyta í almenna notkun fyrir sölu.',
      description: 'Message for validation error no 74',
    },
    E78: {
      id: 'mcar.application:applicationCheck.validation.E78',
      defaultMessage:
        'Ekki er hægt að framkvæma eigandaskipti af ökutæki í flokknum ökutækjaleiga nema ökutækið hafi farið í aðalskoðun á almanaksárinu. Þarf að fara með ökutækið í skoðun fyrir sölu.',
      description: 'Message for validation error no 78',
    },
    E81: {
      id: 'mcar.application:applicationCheck.validation.E81',
      defaultMessage:
        'Ökutækið verður að hafa farið í skoðun á árinu til að hægt sé að selja það.',
      description: 'Message for validation error no 81',
    },
    L1: {
      id: 'mcar.application:applicationCheck.validation.L1',
      defaultMessage: 'Lás á ökutæki, hafið samband við Samgöngustofu',
      description: 'Message for lock error no 1',
    },
    L2: {
      id: 'mcar.application:applicationCheck.validation.L2',
      defaultMessage: 'Lás á ökutæki, hafið samband við Samgöngustofu',
      description: 'Message for lock error no 2',
    },
    L4: {
      id: 'mcar.application:applicationCheck.validation.L4',
      defaultMessage: 'Lás á ökutæki, hafið samband við Samgöngustofu',
      description: 'Message for lock error no 4',
    },
    L5: {
      id: 'mcar.application:applicationCheck.validation.L5',
      defaultMessage: 'Lás á ökutæki, hafið samband við Samgöngustofu',
      description: 'Message for lock error no 5',
    },
    L6: {
      id: 'mcar.application:applicationCheck.validation.L6',
      defaultMessage: 'Lás á ökutæki, hafið samband við Samgöngustofu',
      description: 'Message for lock error no 6',
    },
    L10: {
      id: 'mcar.application:applicationCheck.validation.L10',
      defaultMessage:
        'Taka þarf einkamerki af ökutæki áður en eigendaskipti fara fram',
      description: 'Message for lock error no 10',
    },
  }),
  errors: defineMessages({
    requiredValidVehicle: {
      id: 'mcar.application:error.requiredValidVehicle',
      defaultMessage: 'Ökutæki þarf að vera gilt',
      description:
        'Error message if the vehicle chosen is invalid or not chosen',
    },
  }),
}
