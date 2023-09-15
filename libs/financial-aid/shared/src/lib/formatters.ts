import { months } from './const'
import { AidName, AmountModal, ApplicationFiltersEnum } from './enums'
import {
  HomeCircumstances,
  ApplicationState,
  Employment,
  ApplicationEventType,
  ApplicationStateUrl,
  FileType,
  FamilyStatus,
  MartialStatusType,
} from './enums'
import {
  Aid,
  Amount,
  ApplicantEmailData,
  ApplicationEvent,
  Calculations,
  Municipality,
} from './interfaces'
import { acceptedAmountBreakDown, estimatedBreakDown } from './taxCalculator'
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
  spouseName: string,
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
    case ApplicationEventType.SPOUSEFILEUPLOAD:
      return {
        header: 'Ný gögn',
        text: 'sendi inn gögn',
        prefix: `Maki ${spouseName}`,
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

export const getActiveSectionForTimeline: KeyMapping<ApplicationState, number> =
  {
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

export const showSpouseData: KeyMapping<FamilyStatus, boolean> = {
  Cohabitation: true,
  UnregisteredCohabitation: true,
  Married: true,
  MarriedNotLivingTogether: true,
  NotCohabitation: false,
}

export const getFamilyStatus: KeyMapping<FamilyStatus, string> = {
  Cohabitation: 'Í sambúð',
  Married: 'Gift',
  MarriedNotLivingTogether: 'Hjón ekki í samvistum',
  UnregisteredCohabitation: 'Óskráð sambúð',
  NotCohabitation: 'Ekki í sambúð',
}

export const getFileTypeName: KeyMapping<FileType, string> = {
  TaxReturn: 'Skattagögn',
  Income: 'Tekjugögn',
  Other: 'Innsend gögn',
  SpouseFiles: 'Gögn frá maka',
}

export const getAidAmountModalInfo = (
  type: AmountModal,
  aidAmount = 0,
  usePersonalTaxCredit = false,
  finalAmount?: Amount,
): { headline: string; calculations: Calculations[] } => {
  switch (type) {
    case AmountModal.ESTIMATED:
      return {
        headline: 'Áætluð aðstoð',
        calculations: estimatedBreakDown(aidAmount, usePersonalTaxCredit),
      }
    case AmountModal.PROVIDED:
      return {
        headline: 'Veitt aðstoð',
        calculations: acceptedAmountBreakDown(finalAmount),
      }
  }
}

export const getApplicantEmailDataFromEventType = (
  event:
    | ApplicationEventType.NEW
    | ApplicationEventType.DATANEEDED
    | ApplicationEventType.REJECTED
    | ApplicationEventType.APPROVED
    | 'SPOUSE'
    | 'WAITINGSPOUSE',
  applicationLink: string,
  applicantEmail: string,
  municipality: Municipality,
  createdDate: Date,
  typeOfDataNeeded?: string,
  rejectionComment?: string,
): { subject: string; data: ApplicantEmailData } => {
  const getPeriod = {
    month: months[createdDate.getMonth()],
    year: createdDate.getFullYear(),
  }
  switch (event) {
    case ApplicationEventType.NEW:
      return {
        subject: 'Umsókn fyrir fjárhagsaðstoð móttekin',
        data: {
          title: 'Fjárhagsaðstoð Umsókn móttekin',
          header: `Umsókn þín fyrir ${getPeriod.month} er móttekin`,
          content: `Umsóknin verður afgreidd eins fljótt og hægt er. Þú færð annan tölvupóst þegar vinnsla klárast eða ef okkur vantar einhver frekari gögn frá þér.<br><br>Þú getur fylgst með stöðu umsóknarinnar á <a href="${applicationLink}" target="_blank"> <b>stöðusíðu umsóknarinnar</b></a>.`,
          applicationLinkText: 'Skoða stöðu umsóknar',
          applicationChange: 'Umsókn móttekin og í vinnslu',
          applicationMonth: getPeriod.month,
          applicationYear: getPeriod.year,
          applicationLink,
          applicantEmail,
          municipality,
        },
      }

    case ApplicationEventType.DATANEEDED:
      return {
        subject:
          'Þú þarft að skila gögnum svo hægt sé að klára að vinna umsóknina',
        data: {
          title: 'Fjárhagsaðstoð Umsókn vantar gögn',
          header: `Þú þarft að skila gögnum svo hægt sé að klára að vinna umsóknina`,
          content: `Til þess að hægt sé að meta umsóknina þarft þú að senda okkur <strong>${typeOfDataNeeded}</strong>. Þú getur sent okkur gögnin á <a href="${applicationLink}" target="_blank">þinni stöðusíðu</a>`,
          applicationLinkText: 'Bæta við gögnum',
          applicationChange: 'Umsóknin bíður eftir gögnum',
          applicationMonth: getPeriod.month,
          applicationYear: getPeriod.year,
          applicationLink,
          applicantEmail,
          municipality,
        },
      }

    case ApplicationEventType.REJECTED:
      return {
        subject: 'Umsókn þinni um aðstoð hefur verið synjað',
        data: {
          title: 'Fjárhagsaðstoð Umsókn synjað',
          header: 'Umsókn þinni um aðstoð hefur verið synjað',
          content: `Umsókn þinni um fjárhagsaðstoð í ${getPeriod.month} hefur verið synjað <b>${rejectionComment}</b>. Þú getur kynnt þér nánar <a href="${municipality.rulesHomepage}" target="_blank">reglur um fjárhagsaðstoð.</a> <br><br> <b>Málskot</b> <br> Bent skal á að unnt er að skjóta ákvörðun þessari til áfrýjunarnefndar þíns sveitarfélags. Skal það gert skriflega og innan fjögurra vikna. Fyrir frekari upplýsingar um málskot hafðu samband með tölvupósti á netfangið <a href="mailto:${municipality.email}">${municipality.email}</a>. <br><br> Ákvörðun ráðsins má síðan skjóta til úrskurðarnefndar velferðarmála, Katrínartúni 2, 105 Reykjavík innan þriggja mánaða.`,
          applicationLinkText: 'Opna stöðusíðu',
          applicationChange: 'Umsókn synjað',
          applicationMonth: getPeriod.month,
          applicationYear: getPeriod.year,
          applicationLink,
          applicantEmail,
          municipality,
        },
      }

    case ApplicationEventType.APPROVED:
      return {
        subject: 'Umsóknin þín er samþykkt og lokaupphæð tilbúin',
        data: {
          title: 'Fjárhagsaðstoð Umsókn samþykkt',
          header: 'Umsóknin þín er samþykkt og lokaupphæð er tilbúin',
          content: `Umsókn þín um fjárhagsaðstoð í ${getPeriod.month} er samþykkt. Þú getur skoðað lokaupphæð fjárhagsaðstoðarinnar með því að ýta á hnappinn hér að neðan. Ef þú hefur einhverjar athugasemdir hafðu samband með tölvupósti á netfangið <a href="mailto:${municipality.email}">${municipality.email}</a>.`,
          applicationLinkText: 'Skoða lokaupphæð',
          applicationChange: 'Umsóknin er samþykkt',
          applicationMonth: getPeriod.month,
          applicationYear: getPeriod.year,
          applicationLink,
          applicantEmail,
          municipality,
        },
      }

    case 'SPOUSE':
      return {
        subject: `Þú þarft að skila inn gögnum fyrir umsókn maka þíns um fjárhagsaðstoð`,
        data: {
          title: 'Fjárhagsaðstoð Umsókn móttekin',
          header: `Þú þarft að skila inn gögnum fyrir umsókn maka þíns um fjárhagsaðstoð`,
          content: `Maki þinn hefur sótt um fjárhagsaðstoð fyrir ${getPeriod.month}. Svo hægt sé að reikna út fjárhagsaðstoðina og klára umsóknina þarft þú að <a href="${applicationLink}" target="_blank">senda okkur tekju- og skattagögn.</a>`,
          applicationLinkText: 'Bæta við gögnum',
          applicationChange: 'Umsókn bíður eftir gögnum frá maka',
          applicationMonth: getPeriod.month,
          applicationYear: getPeriod.year,
          applicationLink,
          applicantEmail,
          municipality,
        },
      }

    case 'WAITINGSPOUSE':
      return {
        subject: `Umsókn þín fyrir ${getPeriod.month} bíður gagna frá maka`,
        data: {
          title: 'Fjárhagsaðstoð Beðið eftir maka',
          header: `Umsókn þín fyrir ${getPeriod.month} bíður gagna frá maka`,
          content: `Maki þinn hefur fengið sendan tölvupóst með hlekk til að hlaða upp gögnum. Umsóknin verður tekin til úrvinnslu þegar maki hefur skilað inn gögnunum. Þú færð tölvupóst þegar vinnsla klárast eða ef okkur vantar einhver frekari gögn.<br><br>Þú getur fylgst með stöðu umsóknarinnar á <a href="${applicationLink}" target="_blank">stöðusíðu umsóknarinnar</a>.`,
          applicationLinkText: 'Skoða stöðu umsóknar',
          applicationChange: 'Umsókn bíður eftir gögnum frá maka',
          applicationMonth: getPeriod.month,
          applicationYear: getPeriod.year,
          applicationLink,
          applicantEmail,
          municipality,
        },
      }
  }
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

export const aidDescriptionFromName: KeyMapping<AidName, string> = {
  ownPlace: 'Eigið húsnæði',
  registeredRenting: 'Leiga með þinglýstan leigusamning',
  unregisteredRenting: 'Leiga með óþinglýstan leigusamning',
  withOthers: 'Býr eða leigir hjá öðrum án þinglýsts leigusamnings',
  livesWithParents: 'Býr hjá foreldrum',
  unknown: 'Annað',
}

export const getNavEmploymentStatus: KeyMapping<Employment, number> = {
  Working: 1,
  Unemployed: 4,
  CannotWork: 6,
  Other: 10,
}
