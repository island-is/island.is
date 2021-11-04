import { ApplicationFiltersEnum } from './enums'
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
  UnregisteredLease: 'Ég leigi með óþinglýstan leigusamning',
  Other: 'Annað',
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
  MyCases: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
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
  '/vinnslu': ApplicationStateUrl.MYCASES,
  '/teymid': ApplicationStateUrl.INPROGRESS,
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

export const showSpouseData: KeyMapping<FamilyStatus, boolean> = {
  Unknown: false,
  Single: false,
  Cohabitation: true,
  UnregisteredCohabitation: true,
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
  UnregisteredCohabitation: 'Ég er ekki í sambúð',
}

export const getFileTypeName: KeyMapping<FileType, string> = {
  TaxReturn: 'Skattagögn',
  Income: 'Tekjugögn',
  Other: 'Innsend gögn',
  SpouseFiles: 'Gögn frá maka',
}

export const getEmailTextFromState: KeyMapping<ApplicationState, string> = {
  New: 'Umsókn þín er móttekin',
  DataNeeded: 'Okkur vantar gögn til að klára að vinna úr umsókninni',
  InProgress: 'Umsókn þín er móttekin og er nú í vinnslu',
  Rejected: 'Umsókn þinni um aðstoð hefur verið synjað',
  Approved: 'Umsóknin þín er samþykkt og áætlun er tilbúin',
}

export const applicationStateToFilterEnum: KeyMapping<
  ApplicationState,
  ApplicationFiltersEnum
> = {
  New: ApplicationFiltersEnum.NEW,
  DataNeeded: ApplicationFiltersEnum.INPROGRESS,
  InProgress: ApplicationFiltersEnum.INPROGRESS,
  Rejected: ApplicationFiltersEnum.REJECTED,
  Approved: ApplicationFiltersEnum.APPROVED,
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
      return aid.withOthers
    case 'UnregisteredLease':
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
  '': 'sambandid.svg',
  '5706': 'akrahreppur.svg',
  '3000': 'akranes.svg',
  '6000': 'akureyri.svg',
  '8200': 'arborg.svg',
  '4901': 'arneshreppur.svg',
  '8610': 'asahreppur.svg',
  '8721': 'blaskogabyggd.svg',
  '5604': 'blonduosbaer.svg',
  '4100': 'bolungarvik.svg',
  '3609': 'borgarbyggd.svg',
  '3811': 'dalabyggd.svg',
  '6400': 'dalvikurbyggd.svg',
  '3713': 'eyja-_og_miklaholtshreppur.svg',
  '6513': 'eyjafjardarsveit.svg',
  '6250': 'fjallabyggd.svg',
  '7300': 'fjardabyggd.svg',
  '7505': 'fljotsdalshreppur.svg',
  '8722': 'floahreppur.svg',
  '1300': 'gardabaer.svg',
  '8719': 'grimsnes-_og_grafningshreppur.svg',
  '2300': 'grindavikurbaer.svg',
  '3709': 'grundarfjardarbaer.svg',
  '6602': 'grytubakkahreppur.svg',
  '1400': 'hafnarfjordur.svg',
  '3710': 'helgafellssveit.svg',
  '6515': 'horgarsveit.svg',
  '8401': 'hornafjordur.svg',
  '8710': 'hrunamannahreppur.svg',
  '5508': 'hunathing_vestra.svg',
  '5612': 'hunavatnshreppur.svg',
  '3511': 'hvalfjardarsveit.svg',
  '8716': 'hveragerdisbaer.svg',
  '4200': 'isafjardarbaer.svg',
  '4902': 'kaldrananeshreppur.svg',
  '1606': 'kjosarhreppur.svg',
  '1000': 'kopavogur.svg',
  '6709': 'langanesbyggd.svg',
  '1604': 'mosfellsbaer.svg',
  '7400': 'mulathing.svg',
  '8508': 'myrdalshreppur.svg',
  '6100': 'nordurthing.svg',
  '8717': 'olfus.svg',
  '8613': 'rangarthing_eystra.svg',
  '8614': 'rangarthing_ytra.svg',
  '4502': 'reykholahreppur.svg',
  '2000': 'reykjanesbaer.svg',
  '1100': 'seltjarnarnes.svg',
  '8509': 'skaftarhreppur.svg',
  '5611': 'skagabyggd.svg',
  '5200': 'skagafjordur.svg',
  '5609': 'skagastrond.svg',
  '8720': 'skeida-_og_gnupverjahreppur.svg',
  '3506': 'skorradalur.svg',
  '6607': 'skutustadahreppur.svg',
  '3714': 'snaefellsbaer.svg',
  '4911': 'strandabyggd.svg',
  '3711': 'stykkisholmsbaer.svg',
  '4803': 'sudavikurhreppur.svg',
  '2510': 'sudurnesjabaer.svg',
  '6706': 'svalbardshreppur.svg',
  '6601': 'svalbardsstrandarhreppur.svg',
  '4604': 'talknafjardarhreppur.svg',
  '6612': 'thingeyjarsveit.svg',
  '6611': 'tjorneshreppur.svg',
  '8000': 'vestmannaeyjabaer.svg',
  '4607': 'vesturbyggd.svg',
  '2506': 'vogar.svg',
  '7502': 'vopnafjardarhreppur.svg',
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
    case '9':
    case '6':
    case '5':
    case '4':
    case '1':
    default:
      return MartialStatusType.SINGLE
  }
}
