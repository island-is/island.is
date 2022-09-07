import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.ASSIGN }

export enum States {
  DRAFT = 'draft',
  PAYMENT = 'payment',
  SPOUSE_CONFIRM = 'spouse_confirm',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNED_SPOUSE = 'assigned_spouse',
}

export const YES = 'yes'
export const NO = 'no'

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
  assignSpouse = 'assignSpouse',
}

export enum MarriageTermination {
  divorce = 'divorce',
  lostSpouse = 'lostSpouse',
  annulment = 'annulment',
}

export type DistrictCommissionerAgencies = {
  name: string
  place: string
  address: string
  id: string
}

export const ReligiousLifeViewingSocieties = [
  'Alþjóðleg kirkja guðs og embætti Jesú Krists',
  'Ananda Marga',
  'Ashutosh jóga á Íslandi',
  'Ásatrúarfélagið',
  'Baháí samfélagið',
  'Betanía, kristið samfélag',
  'Boðunarkirkjan',
  'Búddistafélag Íslands',
  'Búddistasamtökin SGI á Íslandi',
  'Bænahúsið',
  'Catch The Fire',
  'Demantsleið Búddismans',
  'DíaMat',
  'Loftstofan baptistakirkja',
  'Endurfædd kristin kirkja af guði',
  'Eþíópíska Tewahedo rétttrúnaðarkirkjan á Íslandi',
  'Félag múslima á Íslandi',
  'Félag Tibet búddista á Íslandi',
  'Heimsfriðarsamtök Fjölskyldna',
  'Fríkirkjan í Hafnarfirði',
  'Fríkirkjan Kefas',
  'Fríkirkjan í Reykjavík',
  'Fyrsta baptistakirkjan',
  'Heimakirkja',
  'Himinn á jörðu',
  'Hjálpræðisherinn trúfélag',
  'Hvítasunnukirkjan á Íslandi',
  'ICCI (Islamic Cultural Centre of Iceland)',
  'Ísland kristin þjóð',
  'Íslenska Kristkirkjan',
  'Kaþólska kirkjan',
  'Kirkja hins upprisna lífs',
  'Kirkja Jesú Krists hinna síðari daga heilögu',
  'Kirkja sjöunda dags aðventista á Íslandi',
  'Menningarfélag gyðinga',
  'Nýja Avalon miðstöðin',
  'Óháði söfnuðurinn',
  'Reykjavíkurgoðorð',
  'Rússneska rétttrúnaðarkirkjan',
  'Samfélag trúaðra',
  'Serbneska rétttrúnaðarkirkjan',
  'Siðmennt',
  'Sjónarhæðarsöfnuðurinn',
  'Smárakirkja',
  'Stofnun múslima á Íslandi',
  'Vonarhöfn, kristilegt félag',
  'Vottar Jehóva',
  'Vegurinn, kirkja fyrir þig',
  'Vitund',
  'Wat Phra Dhammakaya búddistasamtökin á Íslandi',
  'Zen á Íslandi - Nátthagi',
  'Zuism',
]

export const twoDays = 24 * 3600 * 1000 * 2
export const sixtyDays = 24 * 3600 * 1000 * 60

const married = 'Gift/ur'

export const maritalStatuses: {
  [key: string]: string
} = {
  '1': 'Ógift/ur',
  '3': married,
  '4': 'Ekkja/Ekkill',
  '5': 'Skilin/nn/ð að borði og sæng',
  '6': 'Fráskilin/nn/ð',
  '7': married,
  '8': married,
  '9': 'Óupplýst',
  '0': married,
  L: married,
}
