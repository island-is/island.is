import {
  HomeCircumstances,
  Employment,
  KeyMapping,
  ApplicationState,
} from './types'

export const getHomeCircumstances: KeyMapping<HomeCircumstances, string> = {
  Unknown: 'Óþekkt',
  WithParents: 'Ég bý hjá foreldrum',
  WithOthers: 'Ég bý eða leigi hjá öðrum án leigusamnings',
  OwnPlace: 'Ég bý í eigin húsnæði',
  RegisteredLease: 'Ég leigi með þinglýstan leigusamning',
  Other: 'Ekkert að ofan lýsir mínum aðstæðum',
}

export const getEmploymentStatus: KeyMapping<Employment, string> = {
  Working: 'Ég er með atvinnu',
  Unemployed: 'Ég er atvinnulaus',
  CannotWork: 'Ég er ekki vinnufær',
  Other: 'Ekkert að ofan lýsir mínum aðstæðum',
}

export const getState: KeyMapping<ApplicationState, string> = {
  New: 'Ný umsókn',
  DataNeeded: 'Vantar gögn',
  InProgress: 'Í vinnslu',
  Rejected: 'Synjað',
  Approved: 'Samþykkt',
}

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatPhoneNumber = (phoneNumber: string) =>
  insertAt(phoneNumber.replace('-', ''), '-', 3) || '-'

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const translateMonth = (month: number) => {
  const months = [
    'Janúar',
    'Febrúar',
    'Mars',
    'Apríl',
    'Maí',
    'Júní',
    'Júlí',
    'Ágúst',
    'September',
    'Október',
    'Nóvember',
    'Desember',
  ]

  return months[month - 1]
}

export const aidCalculator = (
  homeCircumstances: HomeCircumstances,
  aid: {
    ownApartmentOrLease: number
    withOthersOrUnknow: number
    withParents: number
  },
): number => {
  switch (homeCircumstances) {
    case 'OwnPlace':
      return aid.ownApartmentOrLease
    case 'RegisteredLease':
      return aid.ownApartmentOrLease
    case 'WithOthers':
      return aid.ownApartmentOrLease
    case 'Other':
    case 'Unknown':
      return aid.withOthersOrUnknow
    case 'WithParents':
      return aid.withParents
    default:
      return aid.withParents
  }
}
