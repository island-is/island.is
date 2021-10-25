import {
  HomeCircumstances,
  ApplicationState,
  Employment,
  ApplicationEventType,
  ApplicationStateUrl,
  FileType,
  RolesRule,
  FamilyStatus,
  MartialStatusType,
} from './enums'
import { Aid, ApplicationEvent } from './interfaces'
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

export const getStateFromUrl: KeyMapping<
  ApplicationStateUrl,
  ApplicationState[]
> = {
  New: [ApplicationState.NEW],
  InProgress: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
  Processed: [ApplicationState.REJECTED, ApplicationState.APPROVED],
}

export const getEventTypesFromService: KeyMapping<
  RolesRule,
  ApplicationEventType[]
> = {
  osk: [ApplicationEventType.DATANEEDED],
  veita: Object.values(ApplicationEventType),
}

export const getStateUrlFromRoute: KeyMapping<string, ApplicationStateUrl> = {
  '/': ApplicationStateUrl.NEW,
  '/nymal': ApplicationStateUrl.NEW,
  '/vinnslu': ApplicationStateUrl.INPROGRESS,
  '/afgreidd': ApplicationStateUrl.PROCESSED,
}

export const getEventData = (
  event: ApplicationEvent,
  applicantName: string,
): { header: string; text: string; prefix: string } => {
  switch (event.eventType) {
    case ApplicationEventType.NEW:
      return {
        header: 'Ný umsókn',
        text: 'sendi inn umsókn',
        prefix: `Umsækjandi ${applicantName}`,
      }
    case ApplicationEventType.DATANEEDED:
      return {
        header: 'Vantar gögn',
        text: 'óskaði eftir gögnum',
        prefix: event.staffName ?? 'Starfsmaður',
      }
    case ApplicationEventType.INPROGRESS:
      return {
        header: 'Í vinnslu',
        text: 'breytti stöðu',
        prefix: event.staffName ?? 'Starfsmaður',
      }
    case ApplicationEventType.REJECTED:
      return {
        header: 'Synjað',
        text: 'synjaði umsókn',
        prefix: event.staffName ?? 'Starfsmaður',
      }
    case ApplicationEventType.APPROVED:
      return {
        header: 'Samþykkt',
        text: 'samþykkti umsókn',
        prefix: event.staffName ?? 'Starfsmaður',
      }
    case ApplicationEventType.STAFFCOMMENT:
      return {
        header: 'Athugasemd',
        text: 'skrifaði athugasemd',
        prefix: event.staffName ?? 'Starfsmaður',
      }
    case ApplicationEventType.USERCOMMENT:
      return {
        header: 'Athugasemd',
        text: 'skrifaði athugasemd',
        prefix: `Umsækjandi ${applicantName}`,
      }
    case ApplicationEventType.FILEUPLOAD:
      return {
        header: 'Ný gögn',
        text: 'sendi inn gögn',
        prefix: `Umsækjandi ${applicantName}`,
      }
    case ApplicationEventType.ASSIGNCASE:
      return {
        header: 'Umsjá',
        text: 'tók að sér málið',
        prefix: event.staffName ?? 'Starfsmaður',
      }
  }
}

export const eventTypeFromApplicationState: KeyMapping<
  ApplicationState,
  ApplicationEventType
> = {
  New: ApplicationEventType.NEW,
  DataNeeded: ApplicationEventType.DATANEEDED,
  InProgress: ApplicationEventType.INPROGRESS,
  Rejected: ApplicationEventType.REJECTED,
  Approved: ApplicationEventType.APPROVED,
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

export const isSpouseDataNeeded: KeyMapping<FamilyStatus, boolean> = {
  Unknown: false,
  Single: false,
  Cohabitation: true,
  UnregisteredCohabitation: false,
  Married: true,
  MarriedNotLivingTogether: true,
  NotInformed: false,
}

export const getFamilyStatus: KeyMapping<FamilyStatus, string> = {
  Unknown: 'Óþekkt',
  Cohabitation: 'Í sambúð',
  Married: 'Gift',
  Single: 'Einstæð',
  MarriedNotLivingTogether: 'Hjón ekki í samvistum',
  NotInformed: 'Óupplýst',
  UnregisteredCohabitation: 'Óstaðfestri sambúð?',
}

export const getFileTypeName: KeyMapping<FileType, string> = {
  TaxReturn: 'Skattagögn',
  Income: 'Tekjugögn',
  Other: 'Innsend gögn',
}

export const getEmailTextFromState: KeyMapping<ApplicationState, string> = {
  New: 'Umsókn þín er móttekin',
  DataNeeded: 'Okkur vantar gögn til að klára að vinna úr umsókninni',
  InProgress: 'Umsókn þín er móttekin og er nú í vinnslu',
  Rejected: 'Umsókn þinni um aðstoð hefur verið synjað',
  Approved: 'Umsóknin þín er samþykkt og áætlun er tilbúin',
}

export const aidCalculator = (
  homeCircumstances: HomeCircumstances,
  aid: Aid,
): number => {
  switch (homeCircumstances) {
    case 'OwnPlace':
      return aid.ownPlace
    case 'RegisteredLease':
      return aid.registeredRenting
    case 'WithOthers':
      return aid.unregisteredRenting
    case 'Other':
    case 'Unknown':
      return aid.unknown
    case 'WithParents':
      return aid.livesWithParents
    default:
      return aid.unknown
  }
}

export const getCommentFromLatestEvent = (
  applicationEvents: ApplicationEvent[],
  findState: ApplicationEventType,
) => {
  return applicationEvents.find((el) => el.eventType === findState)
}

export const logoKeyFromMunicipalityCode: KeyMapping<string, string> = {
  '': 'sis.svg',
  '1400': 'hfj.svg',
}

export const martialStatusTypeFromMartialCode = (
  martialCode: string | undefined,
): MartialStatusType => {
  switch (martialCode) {
    case 'L':
    case 'G':
    case '8':
    case '7':
    case '3':
    case '0':
      return MartialStatusType.MARRIED
    case 'g':
    case '6':
    case '5':
    case '4':
    case '1':
    default:
      return MartialStatusType.SINGLE
  }
}
