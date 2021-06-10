import { HomeCircumstances, Employment, KeyMapping } from './types'

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

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

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
      return aid.withOthersOrUnknow
    case 'Other':
    case 'Unknown':
      return aid.withOthersOrUnknow
    case 'WithParents':
      return aid.withParents
    default:
      return aid.withParents
  }
}
