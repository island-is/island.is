import { defineMessages } from 'react-intl'

export const t = {
  nameOfProcess: defineMessages({
    heading: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:nameOfProcess.heading',
      defaultMessage: 'Nafn ferils',
      description: 'Heading á "nafn ferils" reit',
    },
    label: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:nameOfProcess.label',
      defaultMessage: 'Nafn ferils',
      description: 'Label á "nafn ferils" reit',
    },
    placeholder: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:nameOfProcess.placeholder',
      defaultMessage: ' ',
      description: 'Placeholder á "nafn ferils" reit',
    },
  }),
  amountPerYear: defineMessages({
    heading: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:amountPerYear.heading',
      defaultMessage: 'Magn á ári',
      description: 'Heading á "Fjöldi afgreiðslna á ári" reit',
    },
    label: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:amountPerYear.label',
      defaultMessage: 'Fjöldi afgreiðslna á ári',
      description: 'Label á "magn á ári" reit',
    },
    placeholder: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:amountPerYear.placeholder',
      defaultMessage: ' ',
      description: 'Placeholder á "magn á ári" reit',
    },
    description: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:amountPerYear.description',
      defaultMessage: 'Fjöldi afgreiðslna á ákveðinni þjónustu á einu ári',
      description: 'Lýsing á "magn á ári" reit',
    },
  }),
  processDurationInMinutes: defineMessages({
    heading: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:processDurationInMinutes.heading',
      defaultMessage: 'Lengd afgreiðslu í mínútum',
      description: 'Heading á "Lengd afgreiðslu í mínútum" reit',
    },
    label: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:processDurationInMinutes.label',
      defaultMessage: 'Lengd afgreiðslu í mínútum',
      description: 'Label á "Lengd afgreiðslu í mínútum" reit',
    },
    placeholder: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:processDurationInMinutes.placeholder',
      defaultMessage: ' ',
      description: 'Placeholder á "Lengd afgreiðslu í mínútum"',
    },
    description: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:processDurationInMinutes.description',
      defaultMessage:
        'Áætluð lengd afgreiðslu. Biðtími þjónustuþega er ekki meðtalinn.',
      description: 'Lýsing á "Lengd afgreiðslu í mínútum"',
    },
  }),
  visitCountToCompleteProcess: defineMessages({
    heading: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:visitCountToCompleteProcess.heading',
      defaultMessage: 'Fjöldi heimsókna',
      description: 'Heading á "Fjöldi heimsókna" reit',
    },
    label: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:visitCountToCompleteProcess.label',
      defaultMessage: 'Fjöldi heimsókna',
      description: 'Label á "Fjöldi heimsókna" reit',
    },
    placeholder: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:visitCountToCompleteProcess.placeholder',
      defaultMessage: ' ',
      description: 'Placeholder á "Fjöldi heimsókna" reit',
    },
    description: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:visitCountToCompleteProcess.description',
      defaultMessage:
        'Fjöldi heimsókna sem þarf til að ljúka afgreiðslu. Ef það þarf að mæta á staðinn til þess að sækja um og koma svo aftur til þess að sækja t.d. vottorð skal slá inn 2.',
      description: 'Lýsing á "Fjöldi heimsókna" reit',
    },
  }),
  averageDistanceToProcessInKilometers: defineMessages({
    heading: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:averageDistanceToProcessInKilometers.heading',
      defaultMessage: 'Lengd ferðar í kílómetrum',
      description: 'Heading á "Lengd ferðar í kílómetrum" reit',
    },
    label: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:averageDistanceToProcessInKilometers.label',
      defaultMessage: 'Lengd ferðar í kílómetrum',
      description: 'Label á "Lengd ferðar í kílómetrum" reit',
    },
    placeholder: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:averageDistanceToProcessInKilometers.placeholder',
      defaultMessage: ' ',
      description: 'Placeholder á "Lengd ferðar í kílómetrum" reit',
    },
    description: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:averageDistanceToProcessInKilometers.description',
      defaultMessage: 'Áætluð meðalfjarlægð frá afgreiðslustöð.',
      description: 'Lýsing á "Lengd ferðar í kílómetrum" reit',
    },
  }),
  results: defineMessages({
    calculate: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.calculate',
      defaultMessage: 'Reikna',
      description: 'Texti fyrir "Reikna" hnapp',
    },
    institutionGainDescription: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.institutionGainDescription',
      defaultMessage: 'árlegur fjárhagslegur ávinningur stofnunar',
      description: 'Lýsing á "ávinning stofnana" niðurstöðu',
    },
    staffFreeToDoOtherThings: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.staffFreeToDoOtherThings',
      defaultMessage: 'ígildi stöðugildi sem nýtast í önnur verkefni',
      description:
        'Lýsing á "hve margir starfsmenn geta gert annað" niðurstöðu',
    },
    citizenGainDescription: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.citizenGainDescription',
      defaultMessage: 'heildarábati Íslands, ríki og borgara',
      description: 'Lýsing á "ávinningur borgara" niðurstöðu',
    },
    ringRoadTripsSaved: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.ringRoadTripsSaved',
      defaultMessage: 'keyrðar ferðir í kringum Ísland sem sparast',
      description:
        'Lýsing á "keyrðar ferðir í kringum Ísland sem sparast" niðurstöðu',
    },
    savedCitizenDays: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.savedCitizenDays',
      defaultMessage:
        'sparaðir hjá fólki við að sækja sér nauðsynlega þjónustu',
      description:
        'Lýsing á "sparaðir dagar hjá fólki við að sækja sér nauðsynlega þjónustu" niðurstöðu',
    },
    c02: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.c02',
      defaultMessage: 'minni losun Co2 vegna færri bílferða',
      description: 'Lýsing á "minni losun Co2 vegna færri bílferða" niðurstöðu',
    },
    days: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.days',
      defaultMessage: 'dagar',
      description: 'Dagar',
    },
    currencyPostfix: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.currencyPostfix',
      defaultMessage: ' kr.',
      description: 'Viðskeyti eftir krónutölu',
    },
    kgPostfix: {
      id: 'web.digitalIceland.benefitsOfDigitalProcesses:results.kgPostfix',
      defaultMessage: ' kg',
      description: 'Viðskeyti eftir kílometratölu í niðurstöuspjöldum',
    },
  }),
}
