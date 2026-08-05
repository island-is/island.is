export const COURT_OF_APPEAL = 'landsrettur'
export const SUPREME_COURT = 'Hæstiréttur'
export const RETRIAL_COURT = 'Endurupptokudomur'
export const ALL_DISTRICT_COURTS = [
  'hd-reykjavik',
  'hd-vesturland',
  'hd-vestfirdir',
  'hd-nordurland-vestra',
  'hd-nordurland-eystra',
  'hd-austurland',
  'hd-sudurland',
  'hd-reykjanes',
]

/** All non–supreme courts exposed on the web court-agendas filters (matches "Sjá allt" on GoPro). */
export const ALL_COURT_AGENDA_GOPRO_SLUGS = [
  ...ALL_DISTRICT_COURTS,
  COURT_OF_APPEAL,
]

/** All non–supreme courts on the web verdict list filters (includes retrial court). */
export const ALL_VERDICT_LIST_GOPRO_SLUGS = [
  ...ALL_DISTRICT_COURTS,
  COURT_OF_APPEAL,
  RETRIAL_COURT,
]
