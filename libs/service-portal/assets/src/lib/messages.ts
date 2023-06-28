import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  legalOwners: {
    id: 'sp.assets:legal-owners',
    defaultMessage: 'Þinglýstir eigendur',
  },
  ssn: {
    id: 'sp.assets:ssn',
    defaultMessage: 'Kennitala',
  },
  authorization: {
    id: 'sp.assets:authorization',
    defaultMessage: 'Heimild',
  },
  holdings: {
    id: 'sp.assets:holdings',
    defaultMessage: 'Eignarhlutfall',
  },
  status: {
    id: 'sp.assets:status',
    defaultMessage: 'Staða',
  },
  location: {
    id: 'sp.assets:location',
    defaultMessage: 'Staðfang',
  },
  locationNumber: {
    id: 'sp.assets:location-number',
    defaultMessage: 'Staðfanganúmer',
  },
  housing: {
    id: 'sp.assets:housing',
    defaultMessage: 'Íbúðarhúsnæði',
  },
  appraisal: {
    id: 'sp.assets:appraisal',
    defaultMessage: 'Fasteignamat',
  },
  description: {
    id: 'sp.assets:description',
    defaultMessage: 'Lýsing',
  },
  unitsOfUse: {
    id: 'sp.assets:units-of-use',
    defaultMessage: 'Notkunareiningar',
  },
  unitsOfUseNr: {
    id: 'sp.assets:units-of-use-number',
    defaultMessage: 'Notkunareiningarnúmer',
  },
  marking: {
    id: 'sp.assets:marking',
    defaultMessage: 'Merking',
  },
  municipality: {
    id: 'sp.assets:municipality',
    defaultMessage: 'Sveitarfélag',
  },
  purchaseDate: {
    id: 'sp.assets:purchase-date',
    defaultMessage: 'Dagsetning eignarheimildar',
  },
  siteAssessment: {
    id: 'sp.assets:site-assessment',
    defaultMessage: 'Lóðarmat',
  },
  landSize: {
    id: 'sp.assets:land-size',
    defaultMessage: 'Flatarmál',
  },
  land: {
    id: 'sp.assets:land',
    defaultMessage: 'Landeign',
  },
  landNumber: {
    id: 'sp.assets:land-number',
    defaultMessage: 'Landeignarnúmer',
  },
  landAppraisal: {
    id: 'sp.assets:land-appraisal',
    defaultMessage: 'Lóðarmat',
  },
  usage: {
    id: 'sp.assets:usage',
    defaultMessage: 'Notkun',
  },
  fireAssessment: {
    id: 'sp.assets:fire-assessment',
    defaultMessage: 'Brunabótamat',
  },
  fireCompAssessment: {
    id: 'sp.assets:fire-comp-assessment',
    defaultMessage: 'Brunabótamat',
  },
  operation: {
    id: 'sp.assets:operation',
    defaultMessage: 'Starfsemi',
  },
  disclaimerA: {
    id: 'sp.assets:disclaimer-a',
    defaultMessage: `22. gr. laga nr. 6/2001 um skráningu og mat fasteigna segir að skráður
    eigandi fasteignar sé sá sem hefur þinglýsta eignarheimild hverju sinni
    og skal eigendaskráning Þjóðskrár Íslands þar af leiðandi byggja á
    þinglýstum heimildum. Það athugist því ef misræmi er á eigendaskráningu
    í fasteignaskrá annars vegar og þinglýsingabók hins vegar gildir
    skráning þinglýsingabókar.`,
  },
  disclaimerB: {
    id: 'sp.assets:disclaimer-b',
    defaultMessage: `Þjóðskrá Íslands hefur umsjón með fasteignaskrá. Í skránni er að finna
    grunnupplýsingar um lönd og lóðir auk mannvirkja sem á þeim standa. Þar
    er meðal annars að finna upplýsingar um fasteigna- og brunabótamat,
    stærðir, byggingarár, byggingarefni, notkun og auðkennisnúmer eigna.`,
  },
  size: {
    id: 'sp.assets:size',
    defaultMessage: 'Stærð',
  },
  buildYear: {
    id: 'sp.assets:build-year',
    defaultMessage: 'Byggingarár',
  },
  seeInfo: {
    id: 'sp.vehicles:see-info',
    defaultMessage: 'Skoða nánar',
  },
  workMachinesTitle: {
    id: 'sp.work-machines:title',
    defaultMessage: 'Vinnuvélar',
  },
  workMachinesDescription: {
    id: 'sp.work-machines:description',
    defaultMessage:
      'Hér finnur þú upplýsingar um þínar vinnuvélar úr skrá Vinnueftirlit ríkisins. Einnig er hægt að sjá yfirlit yfir eigendaskipti.',
  },
  baseInfoWorkMachineTitle: {
    id: 'sp.work-machines:base-info',
    defaultMessage: 'Grunnupplýsingar tækis',
  },
  showDeregisteredWorkMachines: {
    id: 'sp.work-machines:show-deregistered',
    defaultMessage: 'Sýna afskráð tæki',
  },
  showOwnerChangingWorkMachines: {
    id: 'sp.work-machines:show-owner-change',
    defaultMessage: 'Í eigendaskiptum',
  },
  showOwnerSupervisorRegisteredWorkMachines: {
    id: 'sp.work-machines:show-supervisor',
    defaultMessage: 'Með skráðan umráðamann',
  },
  workMachinesSearchPlaceholder: {
    id: 'sp.work-machines:search-placeholder',
    defaultMessage: 'Leita',
  },
})

export const vehicleMessage = defineMessages({
  foundSingular: {
    id: 'sp.transports:found-singular',
    defaultMessage: 'ökutæki fannst',
  },
  found: {
    id: 'sp.transports:found',
    defaultMessage: 'ökutæki fundust',
  },
  title: {
    id: 'sp.transports:vehicles-title',
    defaultMessage: 'Ökutæki',
  },
  historyTitle: {
    id: 'sp.transports:vehicles-history-title',
    defaultMessage: 'Ökutækjaferill',
  },
  intro: {
    id: 'sp.transports:vehicles-intro',
    defaultMessage: `Hér má nálgast upplýsingar um þín ökutæki úr ökutækjaskrá Samgöngustofu.`,
  },
  historyIntro: {
    id: 'sp.transports:vehicles-history-intro',
    defaultMessage: `Hér má nálgast upplýsingar um þinn ökutækjaferil úr ökutækjaskrá Samgöngustofu.`,
  },
  clearFilter: {
    id: 'sp.transports:clear-filters',
    defaultMessage: 'Hreinsa síu',
  },
  notFound: {
    id: 'sp.transports:not-found',
    defaultMessage: 'Ökutæki fannst ekki',
  },
  infoNote: {
    id: 'sp.transports:detail-info-note',
    defaultMessage:
      'Samgöngustofa hefur umsjón með ökutækjaskrá. Í skránni er að finna upplýsingar um ökutæki sem þú er skráð/ur eigandi, meðeigandi og umráðamaður að.',
  },
  category: {
    id: 'sp.vehicles:category',
    defaultMessage: 'flokkur',
  },
  type: {
    id: 'sp.transports:type',
    defaultMessage: 'Tegund',
  },
  subType: {
    id: 'sp.transports:subtype',
    defaultMessage: 'Undirtegund',
  },
  numberPlate: {
    id: 'sp.transports:number-plate',
    defaultMessage: 'Skráningarnúmer',
  },
  capacity: {
    id: 'sp.transports:capacity',
    defaultMessage: 'Slagrými',
  },
  trailerWithBrakes: {
    id: 'sp.transports:trailer-with-brakes',
    defaultMessage: 'Hemlaður eftirvagn',
  },
  trailerWithoutBrakes: {
    id: 'sp.transports:trailer-without-brakes',
    defaultMessage: 'Óhemlaður eftirvagn',
  },
  ownersTitle: {
    id: 'sp.transports:operators-title',
    defaultMessage: 'Eigendaferill',
  },
  baseInfoTitle: {
    id: 'sp.transports:basic-info-vehicle',
    defaultMessage: 'Grunnupplýsingar ökutækis',
  },
  inspectionTitle: {
    id: 'sp.transports:insp-title',
    defaultMessage: 'Síðasta skoðun ökutækis',
  },
  feeTitle: {
    id: 'sp.transports:fee-title',
    defaultMessage: 'Gjöld',
  },
  regTitle: {
    id: 'sp.transports:reg-title',
    defaultMessage: 'Skráning',
  },
  techTitle: {
    id: 'sp.transports:tech-title',
    defaultMessage: 'Tæknilegar upplýsingar',
  },
  regno: {
    id: 'sp.transports:regno',
    defaultMessage: 'Skráningarnúmer',
  },
  permno: {
    id: 'sp.transports:permno',
    defaultMessage: 'Fastanúmer',
  },
  verno: {
    id: 'sp.transports:verno',
    defaultMessage: 'Verksmiðjunúmer',
  },
  year: {
    id: 'sp.transports:year',
    defaultMessage: 'Árgerð',
  },
  country: {
    id: 'sp.transports:country',
    defaultMessage: 'Framleiðsluland',
  },
  productYear: {
    id: 'sp.transports:pre-reg-year',
    defaultMessage: 'Framleiðsluár',
  },
  preCountry: {
    id: 'sp.transports:pre-country',
    defaultMessage: 'Fyrra skráningarland',
  },
  importStatus: {
    id: 'sp.transports:import-status',
    defaultMessage: 'Innflutningsástand',
  },
  firstReg: {
    id: 'sp.transports:first-reg',
    defaultMessage: 'Fyrsta skráning',
  },
  preReg: {
    id: 'sp.transports:pre-reg',
    defaultMessage: 'Forskráning',
  },
  newReg: {
    id: 'sp.transports:new-reg',
    defaultMessage: 'Nýskráning',
  },
  vehGroup: {
    id: 'sp.transports:vehicle-group',
    defaultMessage: 'Ökutækisflokkur',
  },
  color: {
    id: 'sp.transports:color',
    defaultMessage: 'Litur',
  },
  regType: {
    id: 'sp.transports:reg-type',
    defaultMessage: 'Skráningarflokkur',
  },
  passengers: {
    id: 'sp.transports:passengers',
    defaultMessage: 'Farþegar án ökumanns',
  },
  specialName: {
    id: 'sp.transports:special-name',
    defaultMessage: 'Sérheiti',
  },
  driversPassengers: {
    id: 'sp.transports:drivers-passengers',
    defaultMessage: 'Farþegar hjá ökumanni',
  },
  standingPassengers: {
    id: 'sp.transports:standing-passengers',
    defaultMessage: 'Farþegar í stæði',
  },
  useGroup: {
    id: 'sp.transports:use-group',
    defaultMessage: 'Notkunarflokkur',
  },
  owner: {
    id: 'sp.transports:owner',
    defaultMessage: 'Eigandi',
  },
  coOwner: {
    id: 'sp.transports:co-owner',
    defaultMessage: 'Meðeigandi',
  },
  operator: {
    id: 'sp.transports:operator',
    defaultMessage: 'Umráðamaður',
  },
  name: {
    id: 'sp.transports:name',
    defaultMessage: 'Nafn',
  },
  nationalId: {
    id: 'sp.transports:national-id',
    defaultMessage: 'Kennitala',
  },
  address: {
    id: 'sp.transports:address',
    defaultMessage: 'Heimilisfang',
  },
  postalCode: {
    id: 'sp.transports:postalcode',
    defaultMessage: 'Póstnúmer',
  },
  city: {
    id: 'sp.transports:city',
    defaultMessage: 'Borg/bær',
  },
  purchaseDate: {
    id: 'sp.transports:purchase-date',
    defaultMessage: 'Kaupdagur',
  },
  inspectionType: {
    id: 'sp.transports:insp-type',
    defaultMessage: 'Tegund skoðunar',
  },
  date: {
    id: 'sp.transports:date',
    defaultMessage: 'Dagsetning',
  },
  dateFrom: {
    id: 'sp.transports:date-from',
    defaultMessage: 'Dagsetning frá',
  },
  result: {
    id: 'sp.transports:result',
    defaultMessage: 'Niðurstaða',
  },
  plateStatus: {
    id: 'sp.transports:plate-status',
    defaultMessage: 'Staða plötu',
  },
  plateLocation: {
    id: 'sp.transports:plate-location',
    defaultMessage: 'Geymslustaður plötu',
  },
  vehicleFee: {
    id: 'sp.transports:vehicle-fee',
    defaultMessage: 'Bifreiðagjöld',
  },
  unpaidVehicleFee: {
    id: 'sp.transports:vehicle-fee-unpaid',
    defaultMessage: 'Ógreidd Bifreiðagjöld',
  },
  unpaidVehicleFeeText: {
    id: 'sp.transports:vehicle-fee-text',
    defaultMessage:
      'Fjárhæð bifreiðagjalds fer eftir eigin þyngd bifreiðar og losun koltvísýrings, svokallað CO2. Séu upplýsingar um CO2 ekki tiltækar í Ökutækjaskrá Samgöngustofu miðast bifreiðagjald eingöngu við eigin þyngd.',
  },
  nedc: {
    id: 'sp.transports:nedc',
    defaultMessage: 'Útblástursgildi (NEDC)',
  },
  nedcWeighted: {
    id: 'sp.transports:nedc-weighted',
    defaultMessage: 'Vegið útblástursgildi (NEDC)',
  },
  wltp: {
    id: 'sp.transports:wltp',
    defaultMessage: 'Útblástursgildi (WLTP)',
  },
  wltpWeighted: {
    id: 'sp.transports:wltp-weighted',
    defaultMessage: 'Vegið útblástursgildi (WLTP)',
  },
  insured: {
    id: 'sp.transports:insured',
    defaultMessage: 'Tryggt',
  },
  nextInspection: {
    id: 'sp.transports:next-insp',
    defaultMessage: 'Næsta aðalskoðun',
  },
  nextAnyInspection: {
    id: 'sp.transports:next-any-insp',
    defaultMessage: 'Næsta skoðun',
  },
  lastInspection: {
    id: 'sp.transports:last-insp',
    defaultMessage: 'Síðasta skoðun',
  },
  mortages: {
    id: 'sp.transports:mortages',
    defaultMessage: 'Veðbönd',
  },
  negligence: {
    id: 'sp.transports:negligence',
    defaultMessage: 'Vanrækslugjald',
  },
  negligenceText: {
    id: 'sp.transports:negligence-text',
    defaultMessage:
      'Vinsamlegast athugið, á þessu ökutæki hvíla vanrækslugjöld.',
  },
  engineType: {
    id: 'sp.transports:engine',
    defaultMessage: 'Vélargerð',
  },
  vehicleWeight: {
    id: 'sp.transports:vehicle-weight',
    defaultMessage: 'Eiginþyngd',
  },
  capacityWeight: {
    id: 'sp.transports:capacity-weight',
    defaultMessage: 'Þyngd vagnlestar',
  },
  length: {
    id: 'sp.transports:length',
    defaultMessage: 'Lengd',
  },
  totalWeight: {
    id: 'sp.transports:total-weight',
    defaultMessage: 'Heildarþyngd',
  },
  width: {
    id: 'sp.transports:width',
    defaultMessage: 'Breidd',
  },
  horsePower: {
    id: 'sp.transports:horsepower',
    defaultMessage: 'Afl (hö)',
  },
  carryingCapacity: {
    id: 'sp.transports:carrying-capacity',
    defaultMessage: 'Burðargeta',
  },
  axleTotalWeight: {
    id: 'sp.transports:axle-total-weight',
    defaultMessage: 'Leyfð ásþyngd',
  },
  axle: {
    id: 'sp.transports:axle',
    defaultMessage: 'Ás',
  },
  axleWheel: {
    id: 'sp.transports:axle-wheel',
    defaultMessage: 'Stærð hjólbarða',
  },
  yes: {
    id: 'sp.transports:yes',
    defaultMessage: 'Já',
  },
  no: {
    id: 'sp.transports:no',
    defaultMessage: 'Nei',
  },
  baught: {
    id: 'sp.transports:baught',
    defaultMessage: 'Keypt',
  },
  sold: {
    id: 'sp.transports:sold',
    defaultMessage: 'Selt',
  },
  innlogn: {
    id: 'sp.transports:innlogn',
    defaultMessage: 'Innlögn',
  },
  status: {
    id: 'sp.transports:status',
    defaultMessage: 'Staða',
  },
  ownersHistory: {
    id: 'sp.transports:owners-history',
    defaultMessage: 'Eignarferill',
  },
  operatorHistory: {
    id: 'sp.transports:operator-history',
    defaultMessage: 'Umráðaferill',
  },
  coOwnerHistory: {
    id: 'sp.transports:co-owner-history',
    defaultMessage: 'Meðeigendaferill',
  },

  vehiclesLookup: {
    id: 'sp.transports:vehicles-lookup',
    defaultMessage: 'Uppfletting í ökutækjaskrá',
  },
  showDeregistered: {
    id: 'sp.transports:show-deregistered',
    defaultMessage: 'Sýna afskráð ökutæki',
  },
  search: {
    id: 'sp.transports:search-button',
    defaultMessage: 'Leita',
  },
  searchPlaceholder: {
    id: 'sp.transports:search-placeholder',
    defaultMessage: 'Leita',
  },
  searchLabel: {
    id: 'sp.transports:search-label',
    defaultMessage: `Uppfletting ökutækis`,
  },
  termsAccepted: {
    id: 'sp.transports:terms-accepted',
    defaultMessage: `Þú hefur samþykkt skilmála`,
  },
  acceptTerms: {
    id: 'sp.transports:accept-terms',
    defaultMessage: `Samþykkja skilmála`,
  },
  termsBulletOne: {
    id: 'sp.transports:search-terms-intro-1',
    defaultMessage: `Við uppflettingu í og vinnslu upplýsinga úr ökutækjaskrá skal farið eftir lögum um persónuvernd og meðferð persónuupplýsinga.`,
  },
  termsBulletTwo: {
    id: 'sp.transports:search-terms-intro-2',
    defaultMessage: `Vakin er athygli á að uppflettingar upplýsinga í ökutækjaskrá eru færðar í aðgerðaskrár (log –skrár).`,
  },
  termsBulletThree: {
    id: 'sp.transports:search-terms-intro-3',
    defaultMessage: `Þeim er flettir upp er heimilt að skrá upplýsingar úr ökutækjaskrá í eigið kerfi eftir því sem við á en óheimilt að safna þeim í sérstakan gagnagrunn yfir ökutæki.`,
  },
  termsBulletFour: {
    id: 'sp.transports:search-terms-intro-4',
    defaultMessage: `Óheimilt er að breyta upplýsingum úr ökutækjaskrá.`,
  },
  termsBulletFive: {
    id: 'sp.transports:search-terms-intro-5',
    defaultMessage: `Sá er flettir upp er aðeins heimilt að nota upplýsingarnar í eigin þágu. Óheimilt er að miðla upplýsingum úr ökutækjaskrá til þriðja aðila eða birta þær opinberlega nema að því leyti sem það getur talist eðlilegur þáttur í starfsemi viðtakanda. Persónuupplýsingar má þó aldrei birta opinberlega.`,
  },
  termsTitle: {
    id: 'sp.transports:terms-title',
    defaultMessage: `Skilmálar fyrir leit í ökutækjaskrá`,
  },
  searchIntro: {
    id: 'sp.transports:search-intro',
    defaultMessage: `Þú getur flett upp allt að 5 ökutækjum á dag.`,
  },
  searchLimitExceeded: {
    id: 'sp.transports:search-limit-exceeded',
    defaultMessage: `Þú ert búin(n) að nota öll leitartilvikin fyrir daginn í dag. Vinsamlegast reyndu aftur að sama tíma á morgun.`,
  },

  searchLimitExceededTitle: {
    id: 'sp.transports:search-limit-exceeded-title',
    defaultMessage: `Leitartilvik búin`,
  },
  co2: {
    id: 'sp.transports:co2',
    defaultMessage: `Co2`,
  },
  weightedWLTPCo2: {
    id: 'sp.transports:weighted-wltp-co2',
    defaultMessage: `Vegið WLTP Co2`,
  },
  WLTPCo2: {
    id: 'sp.transports:wltp-co2',
    defaultMessage: `WLTP Co2`,
  },
  vehicleWeightLong: {
    id: 'sp.transports:vehicle-weight-long',
    defaultMessage: `Þyngd ökutækis`,
  },
  vehicleTotalWeightLong: {
    id: 'sp.transports:vehicle-total-weight-long',
    defaultMessage: `Leyfð heildarþyngd ökut.`,
  },
  vehicleStatus: {
    id: 'sp.transports:vehicle-status',
    defaultMessage: `Skoðunarstaða ökutækis`,
  },
  searchResults: {
    id: 'sp.transports:search-results',
    defaultMessage: 'Eftirfarandi upplýsingar fundust um ökutækið',
  },
  chooseHistoryType: {
    id: 'sp.transports:choose-history-type',
    defaultMessage: 'Veldu feril',
  },
  noVehiclesFound: {
    id: 'sp.transports:no-vehicles-found',
    defaultMessage: 'Engin ökutæki fundust',
  },
  noVehicleFound: {
    id: 'sp.transports:no-vehicle-found',
    defaultMessage: 'Ekkert ökutæki fannst',
  },
  dateOfPurchase: {
    id: 'sp.transports:date-of-purchase-from',
    defaultMessage: 'Kaupdagsetning frá',
  },
  dateOfSale: {
    id: 'sp.transports:date-of-sold-to',
    defaultMessage: 'Söludagsetning til',
  },
  recycleCar: {
    id: 'sp.transports:recycle-car',
    defaultMessage: 'Skilavottorð',
  },
  myCarsFiles: {
    id: 'sp.transports:my-cars-files',
    defaultMessage: 'Eignastöðuvottorð',
  },

  myCarsFilesPDF: {
    id: 'sp.transports:my-cars-files-pdf',
    defaultMessage: 'Sækja PDF',
  },

  myCarsFilesCSV: {
    id: 'sp.transports:my-cars-files-csv',
    defaultMessage: 'Sækja CSV',
  },
  myCarsFilesExcel: {
    id: 'sp.transports:my-cars-files-excel',
    defaultMessage: 'Sækja Excel',
  },
  vehicleHistoryReport: {
    id: 'sp.transports:vehicle-history-report',
    defaultMessage: 'Ferilskýrsla',
  },
  vehicleNameSecret: {
    id: 'sp.transports:vehicle-name-secret',
    defaultMessage: 'Nafnleynd í ökutækjaskrá',
  },
  vehicleDrivingLessonsTitle: {
    id: 'sp.transports:vehicle-driving-lessons-title',
    defaultMessage: 'Ökunám',
  },
  vehicleDrivingLessonsText: {
    id: 'sp.transports:vehicle-driving-lessons-text',
    defaultMessage:
      'Hér birtast upplýsingar sem hafa verið skráðar í stafræna ökunámsbók.',
  },
  vehicleDrivingLessonsLabel: {
    id: 'sp.transports:vehicle-driving-lessons-label',
    defaultMessage: 'Grunnupplýsingar ökunáms',
  },
  vehicleDrivingLessonsStartDate: {
    id: 'sp.transports:vehicle-driving-lessons-start-date',
    defaultMessage: 'Ökunám hófst',
  },
  vehicleDrivingLessonsClassOfRight: {
    id: 'sp.transports:vehicle-driving-lessons-rights',
    defaultMessage: 'Réttindaflokkur',
  },
  vehicleDrivingLessonsTeacher: {
    id: 'sp.transports:vehicle-driving-lessons-teacher',
    defaultMessage: 'Ökukennari',
  },
  vehicleDrivingLessonsCount: {
    id: 'sp.transports:vehicle-driving-lessons-count',
    defaultMessage: 'Fjöldi ökutíma',
  },
  vehicleDrivingLessonsTotalTime: {
    id: 'sp.transports:vehicle-driving-lessons-total-time',
    defaultMessage: 'Heildartími',
  },
  vehicleDrivingLessonsStatus: {
    id: 'sp.transports:vehicle-driving-lessons-status',
    defaultMessage: 'Staða',
  },
  vehicleDrivingLessonsHasPassed: {
    id: 'sp.transports:vehicle-driving-lessons-has-passed',
    defaultMessage: 'Staðið',
  },
  vehicleDrivingLessonsPhysical: {
    id: 'sp.transports:vehicle-driving-lessons-physical',
    defaultMessage: 'Verklegir ökutímar',
  },
  vehicleDrivingLessonsMinuteCount: {
    id: 'sp.transports:vehicle-driving-lessons-minute-count',
    defaultMessage: 'Fjöldi mín',
  },
  vehicleDrivingLessonsSchools: {
    id: 'sp.transports:vehicle-driving-lessons-schools',
    defaultMessage: 'Ökuskólar',
  },
  vehicleDrivingLessonsSchool: {
    id: 'sp.transports:vehicle-driving-lessons-school',
    defaultMessage: 'Ökuskóli',
  },
  vehicleDrivingLessonsCourseTitle: {
    id: 'sp.transports:vehicle-driving-lessons-course-title',
    defaultMessage: 'Heiti áfanga',
  },
  vehicleDrivingLessonsExam: {
    id: 'sp.transports:vehicle-driving-lessons-exam',
    defaultMessage: 'Próf',
  },
  vehicleDrivingLessonsChangeTeacher: {
    id: 'sp.transports:vehicle-driving-lessons-change-teacher',
    defaultMessage: 'Breyta um ökukennara',
  },
  vehicleDrivingLessonsMin: {
    id: 'sp.transports:vehicle-driving-lessons-min',
    defaultMessage: 'mín.',
  },
  vehicleDrivingLessonsInfoNote: {
    id: 'sp.transports:vehicle-driving-lessons-info-note',
    defaultMessage: 'Samgöngustofa hefur umsjón með ökunámsbók.',
  },
  vehicleDrivingLessonsComments: {
    id: 'sp.transports:vehicle-driving-lessons-comments',
    defaultMessage: 'Athugasemdir',
  },
  changeOfOwnership: {
    id: 'sp.transports:change-of-ownership',
    defaultMessage: 'Tilkynna eigendaskipti',
  },
  more: {
    id: 'sp.transports:more',
    defaultMessage: 'Meira',
  },
  orderRegistrationNumber: {
    id: 'sp.transports:order-registration-number',
    defaultMessage: 'Panta skráningarmerki',
  },
  orderRegistrationLicense: {
    id: 'sp.transports:orderRegistrationLicense',
    defaultMessage: 'Panta skráningarskírteini',
  },
  addCoOwner: {
    id: 'sp.transports:add-co-owner',
    defaultMessage: 'Breyta meðeiganda',
  },
  addOperator: {
    id: 'sp.vehicles:add-operator',
    defaultMessage: 'Breyta umráðamanni',
  },
  renewPrivateRegistration: {
    id: 'sp.vehicles:renew-private-registration',
    defaultMessage: 'Endurnýja einkamerki',
  },
  changeInstructor: {
    id: 'sp.vehicles:change-driving-instructor',
    defaultMessage: 'Skipta um ökukennara',
  },
  signupToDrivingSchool: {
    id: 'sp.vehicles:signup-to-driving-school',
    defaultMessage: 'Skrá mig í ökunám',
  },
})

export const urls = defineMessages({
  ownerChange: {
    id: 'sp.vehicles:url-owner-change',
    defaultMessage: 'https://island.is/umsoknir/eigendaskipti-okutaekis',
  },
  coOwnerChange: {
    id: 'sp.vehicles:url-co-owner-change',
    defaultMessage: 'https://island.is/umsoknir/medeigandi-okutaekis',
  },
  operator: {
    id: 'sp.vehicles:url-operator',
    defaultMessage: 'https://island.is/umsoknir/umradamadur-okutaekis',
  },
  regNumber: {
    id: 'sp.vehicles:url-registration-number',
    defaultMessage: 'https://island.is/umsoknir/panta-numeraplotu',
  },
  regCert: {
    id: 'sp.vehicles:url-registration-cert',
    defaultMessage: 'https://island.is/umsoknir/panta-skraningarskirteini',
  },
  renewPrivate: {
    id: 'sp.vehicles:url-renew-private',
    defaultMessage: 'https://island.is/endurnyjun-a-einkamerki',
  },
  hideName: {
    id: 'sp.vehicles:url-hide-private-name',
    defaultMessage: 'https://island.is/umsoknir/nafnleynd-i-okutaekjaskra',
  },
  instructorApplication: {
    id: 'sp.vehicles:url-instructor-application',
    defaultMessage: 'https://island.is/umsoknir/okunam-okukennari',
  },
  licenseApplication: {
    id: 'sp.vehicles:url-license-application',
    defaultMessage: 'https://island.is/umsoknir/okuskirteini',
  },
})
