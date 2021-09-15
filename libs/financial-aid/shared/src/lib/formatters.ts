import {
  HomeCircumstances,
  ApplicationState,
  Employment,
  ApplicationEventType,
} from './enums'
import type { KeyMapping } from './types'

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

export const getEventType: KeyMapping<
  ApplicationEventType,
  { header: string; text: string; isStaff: boolean }
> = {
  New: { header: 'Ný umsókn', text: 'sendi inn umsókn', isStaff: false },
  DataNeeded: {
    header: 'Vantar gögn',
    text: 'óskaði eftir gögnum',
    isStaff: true,
  },
  InProgress: { header: 'Í vinnslu', text: 'breytti stöðu', isStaff: true },
  Rejected: { header: 'Synjað', text: 'synjaði umsókn', isStaff: true },
  Approved: { header: 'Samþykkt', text: 'samþykkti umsókn', isStaff: true },
  StaffComment: {
    header: 'Athugasemd',
    text: 'skrifaði athugasemd',
    isStaff: true,
  },
  UserComment: {
    header: 'Athugasemd',
    text: 'skrifaði athugasemd',
    isStaff: false,
  },
  FileUpload: {
    header: 'Ný gögn',
    text: 'sendi inn gögn',
    isStaff: false,
  },
}

export const getActiveSectionForTimeline: KeyMapping<
  ApplicationState,
  number
> = {
  New: 0,
  DataNeeded: 1,
  InProgress: 1,
  Rejected: 2,
  Approved: 2,
}

export const getActiveTypeForStatus: KeyMapping<ApplicationState, string> = {
  New: 'InProgress',
  DataNeeded: 'InProgress',
  InProgress: 'InProgress',
  Rejected: 'Rejected',
  Approved: 'Approved',
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
