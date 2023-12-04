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
    id: 'sp.vehicles:found-singular',
    defaultMessage: 'ökutæki fannst',
  },
  found: {
    id: 'sp.vehicles:found',
    defaultMessage: 'ökutæki fundust',
  },
  title: {
    id: 'sp.vehicles:vehicles-title',
    defaultMessage: 'Ökutæki',
  },
  historyTitle: {
    id: 'sp.vehicles:vehicles-history-title',
    defaultMessage: 'Ökutækjaferill',
  },
  intro: {
    id: 'sp.vehicles:vehicles-intro',
    defaultMessage: `Hér má nálgast upplýsingar um þín ökutæki úr ökutækjaskrá Samgöngustofu.`,
  },
  vehicleMileageIntro: {
    id: 'sp.vehicles:vehicle-mileage-intro',
    defaultMessage: `Sýnir kílómetrastöðu fyrir hvert ár. Athugið að einungis er hægt að skrá einu sinni fyrir hvert tímabil, <href>sjá nánar um það hér.</href>`,
  },
  historyIntro: {
    id: 'sp.vehicles:vehicles-history-intro',
    defaultMessage: `Hér má nálgast upplýsingar um þinn ökutækjaferil úr ökutækjaskrá Samgöngustofu.`,
  },
  clearFilter: {
    id: 'sp.vehicles:clear-filters',
    defaultMessage: 'Hreinsa síu',
  },
  notFound: {
    id: 'sp.vehicles:not-found',
    defaultMessage: 'Ökutæki fannst ekki',
  },
  infoNote: {
    id: 'sp.vehicles:detail-info-note',
    defaultMessage:
      'Samgöngustofa hefur umsjón með ökutækjaskrá. Í skránni er að finna upplýsingar um ökutæki sem þú er skráð/ur eigandi, meðeigandi og umráðamaður að.',
  },
  category: {
    id: 'sp.vehicles:category',
    defaultMessage: 'flokkur',
  },
  postSuccess: {
    id: 'sp.vehicles:post-mileage-success',
    defaultMessage: 'Skráning tókst!',
  },
  type: {
    id: 'sp.vehicles:type',
    defaultMessage: 'Tegund',
  },
  subType: {
    id: 'sp.vehicles:subtype',
    defaultMessage: 'Undirtegund',
  },
  numberPlate: {
    id: 'sp.vehicles:number-plate',
    defaultMessage: 'Skráningarnúmer',
  },
  capacity: {
    id: 'sp.vehicles:capacity',
    defaultMessage: 'Slagrými',
  },
  trailerWithBrakes: {
    id: 'sp.vehicles:trailer-with-brakes',
    defaultMessage: 'Hemlaður eftirvagn',
  },
  trailerWithoutBrakes: {
    id: 'sp.vehicles:trailer-without-brakes',
    defaultMessage: 'Óhemlaður eftirvagn',
  },
  ownersTitle: {
    id: 'sp.vehicles:operators-title',
    defaultMessage: 'Eigendaferill',
  },
  baseInfoTitle: {
    id: 'sp.vehicles:basic-info-vehicle',
    defaultMessage: 'Grunnupplýsingar ökutækis',
  },
  inspectionTitle: {
    id: 'sp.vehicles:insp-title',
    defaultMessage: 'Síðasta skoðun ökutækis',
  },
  feeTitle: {
    id: 'sp.vehicles:fee-title',
    defaultMessage: 'Gjöld',
  },
  regTitle: {
    id: 'sp.vehicles:reg-title',
    defaultMessage: 'Skráning',
  },
  techTitle: {
    id: 'sp.vehicles:tech-title',
    defaultMessage: 'Tæknilegar upplýsingar',
  },
  regno: {
    id: 'sp.vehicles:regno',
    defaultMessage: 'Skráningarnúmer',
  },
  permno: {
    id: 'sp.vehicles:permno',
    defaultMessage: 'Fastanúmer',
  },
  verno: {
    id: 'sp.vehicles:verno',
    defaultMessage: 'Verksmiðjunúmer',
  },
  year: {
    id: 'sp.vehicles:year',
    defaultMessage: 'Árgerð',
  },
  country: {
    id: 'sp.vehicles:country',
    defaultMessage: 'Framleiðsluland',
  },
  productYear: {
    id: 'sp.vehicles:pre-reg-year',
    defaultMessage: 'Framleiðsluár',
  },
  preCountry: {
    id: 'sp.vehicles:pre-country',
    defaultMessage: 'Fyrra skráningarland',
  },
  importStatus: {
    id: 'sp.vehicles:import-status',
    defaultMessage: 'Innflutningsástand',
  },
  firstReg: {
    id: 'sp.vehicles:first-reg',
    defaultMessage: 'Fyrsta skráning',
  },
  preReg: {
    id: 'sp.vehicles:pre-reg',
    defaultMessage: 'Forskráning',
  },
  newReg: {
    id: 'sp.vehicles:new-reg',
    defaultMessage: 'Nýskráning',
  },
  vehGroup: {
    id: 'sp.vehicles:vehicle-group',
    defaultMessage: 'Ökutækisflokkur',
  },
  color: {
    id: 'sp.vehicles:color',
    defaultMessage: 'Litur',
  },
  regType: {
    id: 'sp.vehicles:reg-type',
    defaultMessage: 'Skráningarflokkur',
  },
  passengers: {
    id: 'sp.vehicles:passengers',
    defaultMessage: 'Farþegar án ökumanns',
  },
  specialName: {
    id: 'sp.vehicles:special-name',
    defaultMessage: 'Sérheiti',
  },
  driversPassengers: {
    id: 'sp.vehicles:drivers-passengers',
    defaultMessage: 'Farþegar hjá ökumanni',
  },
  standingPassengers: {
    id: 'sp.vehicles:standing-passengers',
    defaultMessage: 'Farþegar í stæði',
  },
  useGroup: {
    id: 'sp.vehicles:use-group',
    defaultMessage: 'Notkunarflokkur',
  },
  owner: {
    id: 'sp.vehicles:owner',
    defaultMessage: 'Eigandi',
  },
  coOwner: {
    id: 'sp.vehicles:co-owner',
    defaultMessage: 'Meðeigandi',
  },
  operator: {
    id: 'sp.vehicles:operator',
    defaultMessage: 'Umráðamaður',
  },
  name: {
    id: 'sp.vehicles:name',
    defaultMessage: 'Nafn',
  },
  nationalId: {
    id: 'sp.vehicles:national-id',
    defaultMessage: 'Kennitala',
  },
  address: {
    id: 'sp.vehicles:address',
    defaultMessage: 'Heimilisfang',
  },
  postalCode: {
    id: 'sp.vehicles:postalcode',
    defaultMessage: 'Póstnúmer',
  },
  city: {
    id: 'sp.vehicles:city',
    defaultMessage: 'Borg/bær',
  },
  purchaseDate: {
    id: 'sp.vehicles:purchase-date',
    defaultMessage: 'Kaupdagur',
  },
  inspectionType: {
    id: 'sp.vehicles:insp-type',
    defaultMessage: 'Tegund skoðunar',
  },
  date: {
    id: 'sp.vehicles:date',
    defaultMessage: 'Dagsetning',
  },
  dateFrom: {
    id: 'sp.vehicles:date-from',
    defaultMessage: 'Dagsetning frá',
  },
  result: {
    id: 'sp.vehicles:result',
    defaultMessage: 'Niðurstaða',
  },
  plateStatus: {
    id: 'sp.vehicles:plate-status',
    defaultMessage: 'Staða plötu',
  },
  plateLocation: {
    id: 'sp.vehicles:plate-location',
    defaultMessage: 'Geymslustaður plötu',
  },
  vehicleFee: {
    id: 'sp.vehicles:vehicle-fee',
    defaultMessage: 'Bifreiðagjöld',
  },
  unpaidVehicleFee: {
    id: 'sp.vehicles:vehicle-fee-unpaid',
    defaultMessage: 'Ógreidd Bifreiðagjöld',
  },
  unpaidVehicleFeeText: {
    id: 'sp.vehicles:vehicle-fee-text',
    defaultMessage:
      'Fjárhæð bifreiðagjalds fer eftir eigin þyngd bifreiðar og losun koltvísýrings, svokallað CO2. Séu upplýsingar um CO2 ekki tiltækar í Ökutækjaskrá Samgöngustofu miðast bifreiðagjald eingöngu við eigin þyngd.',
  },
  nedc: {
    id: 'sp.vehicles:nedc',
    defaultMessage: 'Útblástursgildi (NEDC)',
  },
  nedcWeighted: {
    id: 'sp.vehicles:nedc-weighted',
    defaultMessage: 'Vegið útblástursgildi (NEDC)',
  },
  wltp: {
    id: 'sp.vehicles:wltp',
    defaultMessage: 'Útblástursgildi (WLTP)',
  },
  wltpWeighted: {
    id: 'sp.vehicles:wltp-weighted',
    defaultMessage: 'Vegið útblástursgildi (WLTP)',
  },
  insured: {
    id: 'sp.vehicles:insured',
    defaultMessage: 'Tryggt',
  },
  nextInspection: {
    id: 'sp.vehicles:next-insp',
    defaultMessage: 'Næsta aðalskoðun',
  },
  nextAnyInspection: {
    id: 'sp.vehicles:next-any-insp',
    defaultMessage: 'Næsta skoðun',
  },
  lastInspection: {
    id: 'sp.vehicles:last-insp',
    defaultMessage: 'Síðasta skoðun',
  },
  mortages: {
    id: 'sp.vehicles:mortages',
    defaultMessage: 'Veðbönd',
  },
  negligence: {
    id: 'sp.vehicles:negligence',
    defaultMessage: 'Vanrækslugjald',
  },
  negligenceText: {
    id: 'sp.vehicles:negligence-text',
    defaultMessage:
      'Vinsamlegast athugið, á þessu ökutæki hvíla vanrækslugjöld.',
  },
  engineType: {
    id: 'sp.vehicles:engine',
    defaultMessage: 'Vélargerð',
  },
  vehicleWeight: {
    id: 'sp.vehicles:vehicle-weight',
    defaultMessage: 'Eiginþyngd',
  },
  capacityWeight: {
    id: 'sp.vehicles:capacity-weight',
    defaultMessage: 'Þyngd vagnlestar',
  },
  length: {
    id: 'sp.vehicles:length',
    defaultMessage: 'Lengd',
  },
  totalWeight: {
    id: 'sp.vehicles:total-weight',
    defaultMessage: 'Heildarþyngd',
  },
  width: {
    id: 'sp.vehicles:width',
    defaultMessage: 'Breidd',
  },
  horsePower: {
    id: 'sp.vehicles:horsepower',
    defaultMessage: 'Afl (hö)',
  },
  carryingCapacity: {
    id: 'sp.vehicles:carrying-capacity',
    defaultMessage: 'Burðargeta',
  },
  axleTotalWeight: {
    id: 'sp.vehicles:axle-total-weight',
    defaultMessage: 'Leyfð ásþyngd',
  },
  axle: {
    id: 'sp.vehicles:axle',
    defaultMessage: 'Ás',
  },
  axleWheel: {
    id: 'sp.vehicles:axle-wheel',
    defaultMessage: 'Stærð hjólbarða',
  },
  yes: {
    id: 'sp.vehicles:yes',
    defaultMessage: 'Já',
  },
  no: {
    id: 'sp.vehicles:no',
    defaultMessage: 'Nei',
  },
  baught: {
    id: 'sp.vehicles:baught',
    defaultMessage: 'Keypt',
  },
  sold: {
    id: 'sp.vehicles:sold',
    defaultMessage: 'Selt',
  },
  innlogn: {
    id: 'sp.vehicles:innlogn',
    defaultMessage: 'Innlögn',
  },
  status: {
    id: 'sp.vehicles:status',
    defaultMessage: 'Staða',
  },
  ownersHistory: {
    id: 'sp.vehicles:owners-history',
    defaultMessage: 'Eignarferill',
  },
  operatorHistory: {
    id: 'sp.vehicles:operator-history',
    defaultMessage: 'Umráðaferill',
  },
  coOwnerHistory: {
    id: 'sp.vehicles:co-owner-history',
    defaultMessage: 'Meðeigendaferill',
  },

  vehiclesLookup: {
    id: 'sp.vehicles:vehicles-lookup',
    defaultMessage: 'Uppfletting í ökutækjaskrá',
  },
  showDeregistered: {
    id: 'sp.vehicles:show-deregistered',
    defaultMessage: 'Sýna afskráð ökutæki',
  },
  search: {
    id: 'sp.vehicles:search-button',
    defaultMessage: 'Leita',
  },
  searchPlaceholder: {
    id: 'sp.vehicles:search-placeholder',
    defaultMessage: 'Leita',
  },
  searchLabel: {
    id: 'sp.vehicles:search-label',
    defaultMessage: `Uppfletting ökutækis`,
  },
  termsAccepted: {
    id: 'sp.vehicles:terms-accepted',
    defaultMessage: `Þú hefur samþykkt skilmála`,
  },
  acceptTerms: {
    id: 'sp.vehicles:accept-terms',
    defaultMessage: `Samþykkja skilmála`,
  },
  termsBulletOne: {
    id: 'sp.vehicles:search-terms-intro-1',
    defaultMessage: `Við uppflettingu í og vinnslu upplýsinga úr ökutækjaskrá skal farið eftir lögum um persónuvernd og meðferð persónuupplýsinga.`,
  },
  termsBulletTwo: {
    id: 'sp.vehicles:search-terms-intro-2',
    defaultMessage: `Vakin er athygli á að uppflettingar upplýsinga í ökutækjaskrá eru færðar í aðgerðaskrár (log –skrár).`,
  },
  termsBulletThree: {
    id: 'sp.vehicles:search-terms-intro-3',
    defaultMessage: `Þeim er flettir upp er heimilt að skrá upplýsingar úr ökutækjaskrá í eigið kerfi eftir því sem við á en óheimilt að safna þeim í sérstakan gagnagrunn yfir ökutæki.`,
  },
  termsBulletFour: {
    id: 'sp.vehicles:search-terms-intro-4',
    defaultMessage: `Óheimilt er að breyta upplýsingum úr ökutækjaskrá.`,
  },
  termsBulletFive: {
    id: 'sp.vehicles:search-terms-intro-5',
    defaultMessage: `Sá er flettir upp er aðeins heimilt að nota upplýsingarnar í eigin þágu. Óheimilt er að miðla upplýsingum úr ökutækjaskrá til þriðja aðila eða birta þær opinberlega nema að því leyti sem það getur talist eðlilegur þáttur í starfsemi viðtakanda. Persónuupplýsingar má þó aldrei birta opinberlega.`,
  },
  termsTitle: {
    id: 'sp.vehicles:terms-title',
    defaultMessage: `Skilmálar fyrir leit í ökutækjaskrá`,
  },
  searchIntro: {
    id: 'sp.vehicles:search-intro',
    defaultMessage: `Þú getur flett upp allt að 5 ökutækjum á dag.`,
  },
  searchLimitExceeded: {
    id: 'sp.vehicles:search-limit-exceeded',
    defaultMessage: `Þú ert búin(n) að nota öll leitartilvikin fyrir daginn í dag. Vinsamlegast reyndu aftur að sama tíma á morgun.`,
  },

  searchLimitExceededTitle: {
    id: 'sp.vehicles:search-limit-exceeded-title',
    defaultMessage: `Leitartilvik búin`,
  },
  co2: {
    id: 'sp.vehicles:co2',
    defaultMessage: `Co2`,
  },
  weightedWLTPCo2: {
    id: 'sp.vehicles:weighted-wltp-co2',
    defaultMessage: `Vegið WLTP Co2`,
  },
  WLTPCo2: {
    id: 'sp.vehicles:wltp-co2',
    defaultMessage: `WLTP Co2`,
  },
  vehicleWeightLong: {
    id: 'sp.vehicles:vehicle-weight-long',
    defaultMessage: `Þyngd ökutækis`,
  },
  vehicleTotalWeightLong: {
    id: 'sp.vehicles:vehicle-total-weight-long',
    defaultMessage: `Leyfð heildarþyngd ökut.`,
  },
  vehicleStatus: {
    id: 'sp.vehicles:vehicle-status',
    defaultMessage: `Skoðunarstaða ökutækis`,
  },
  searchResults: {
    id: 'sp.vehicles:search-results',
    defaultMessage: 'Eftirfarandi upplýsingar fundust um ökutækið',
  },
  chooseHistoryType: {
    id: 'sp.vehicles:choose-history-type',
    defaultMessage: 'Veldu feril',
  },
  noVehiclesFound: {
    id: 'sp.vehicles:no-vehicles-found',
    defaultMessage: 'Engin ökutæki fundust',
  },
  noVehicleFound: {
    id: 'sp.vehicles:no-vehicle-found',
    defaultMessage: 'Ekkert ökutæki fannst',
  },
  dateOfPurchase: {
    id: 'sp.vehicles:date-of-purchase-from',
    defaultMessage: 'Kaupdagsetning frá',
  },
  dateOfSale: {
    id: 'sp.vehicles:date-of-sold-to',
    defaultMessage: 'Söludagsetning til',
  },
  recycleCar: {
    id: 'sp.vehicles:recycle-car',
    defaultMessage: 'Skilavottorð',
  },
  myCarsFiles: {
    id: 'sp.vehicles:my-cars-files',
    defaultMessage: 'Eignastöðuvottorð',
  },

  myCarsFilesPDF: {
    id: 'sp.vehicles:my-cars-files-pdf',
    defaultMessage: 'Sækja PDF',
  },

  myCarsFilesCSV: {
    id: 'sp.vehicles:my-cars-files-csv',
    defaultMessage: 'Sækja CSV',
  },
  myCarsFilesExcel: {
    id: 'sp.vehicles:my-cars-files-excel',
    defaultMessage: 'Sækja Excel',
  },
  vehicleHistoryReport: {
    id: 'sp.vehicles:vehicle-history-report',
    defaultMessage: 'Ferilskýrsla',
  },
  vehicleNameSecret: {
    id: 'sp.vehicles:vehicle-name-secret',
    defaultMessage: 'Nafnleynd í ökutækjaskrá',
  },
  vehicleDrivingLessonsTitle: {
    id: 'sp.vehicles:vehicle-driving-lessons-title',
    defaultMessage: 'Ökunám',
  },
  vehicleDrivingLessonsText: {
    id: 'sp.vehicles:vehicle-driving-lessons-text',
    defaultMessage:
      'Hér birtast upplýsingar sem hafa verið skráðar í stafræna ökunámsbók.',
  },
  vehicleDrivingLessonsLabel: {
    id: 'sp.vehicles:vehicle-driving-lessons-label',
    defaultMessage: 'Grunnupplýsingar ökunáms',
  },
  vehicleDrivingLessonsStartDate: {
    id: 'sp.vehicles:vehicle-driving-lessons-start-date',
    defaultMessage: 'Ökunám hófst',
  },
  vehicleDrivingLessonsClassOfRight: {
    id: 'sp.vehicles:vehicle-driving-lessons-rights',
    defaultMessage: 'Réttindaflokkur',
  },
  vehicleDrivingLessonsTeacher: {
    id: 'sp.vehicles:vehicle-driving-lessons-teacher',
    defaultMessage: 'Ökukennari',
  },
  vehicleDrivingLessonsCount: {
    id: 'sp.vehicles:vehicle-driving-lessons-count',
    defaultMessage: 'Fjöldi ökutíma',
  },
  vehicleDrivingLessonsTotalTime: {
    id: 'sp.vehicles:vehicle-driving-lessons-total-time',
    defaultMessage: 'Heildartími',
  },
  vehicleDrivingLessonsStatus: {
    id: 'sp.vehicles:vehicle-driving-lessons-status',
    defaultMessage: 'Staða',
  },
  vehicleDrivingLessonsHasPassed: {
    id: 'sp.vehicles:vehicle-driving-lessons-has-passed',
    defaultMessage: 'Staðið',
  },
  vehicleDrivingLessonsPhysical: {
    id: 'sp.vehicles:vehicle-driving-lessons-physical',
    defaultMessage: 'Verklegir ökutímar',
  },
  vehicleDrivingLessonsMinuteCount: {
    id: 'sp.vehicles:vehicle-driving-lessons-minute-count',
    defaultMessage: 'Fjöldi mín',
  },
  vehicleDrivingLessonsSchools: {
    id: 'sp.vehicles:vehicle-driving-lessons-schools',
    defaultMessage: 'Ökuskólar',
  },
  vehicleDrivingLessonsSchool: {
    id: 'sp.vehicles:vehicle-driving-lessons-school',
    defaultMessage: 'Ökuskóli',
  },
  vehicleDrivingLessonsCourseTitle: {
    id: 'sp.vehicles:vehicle-driving-lessons-course-title',
    defaultMessage: 'Heiti áfanga',
  },
  vehicleDrivingLessonsExam: {
    id: 'sp.vehicles:vehicle-driving-lessons-exam',
    defaultMessage: 'Próf',
  },
  vehicleDrivingLessonsChangeTeacher: {
    id: 'sp.vehicles:vehicle-driving-lessons-change-teacher',
    defaultMessage: 'Breyta um ökukennara',
  },
  vehicleDrivingLessonsMin: {
    id: 'sp.vehicles:vehicle-driving-lessons-min',
    defaultMessage: 'mín.',
  },
  vehicleDrivingLessonsInfoNote: {
    id: 'sp.vehicles:vehicle-driving-lessons-info-note',
    defaultMessage: 'Samgöngustofa hefur umsjón með ökunámsbók.',
  },
  vehicleDrivingLessonsComments: {
    id: 'sp.vehicles:vehicle-driving-lessons-comments',
    defaultMessage: 'Athugasemdir',
  },
  changeOfOwnership: {
    id: 'sp.vehicles:change-of-ownership',
    defaultMessage: 'Tilkynna eigendaskipti',
  },
  more: {
    id: 'sp.vehicles:more',
    defaultMessage: 'Meira',
  },
  actions: {
    id: 'sp.vehicles:actions',
    defaultMessage: 'Aðgerðir',
  },
  orderRegistrationNumber: {
    id: 'sp.vehicles:order-registration-number',
    defaultMessage: 'Panta skráningarmerki',
  },
  orderRegistrationLicense: {
    id: 'sp.vehicles:orderRegistrationLicense',
    defaultMessage: 'Panta skráningarskírteini',
  },
  addCoOwner: {
    id: 'sp.vehicles:add-co-owner',
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
  vehicleDrivingLessonsPracticeDriving: {
    id: 'sp.vehicles:vehicle-driving-lessons-practice-driving',
    defaultMessage: 'Æfingaakstur',
  },
  odometer: {
    id: 'sp.vehicles:odometer',
    defaultMessage: 'Kílómetrastaða',
  },
  lastKnownOdometerStatus: {
    id: 'sp.vehicles:last-known-odometer-status',
    defaultMessage: 'Síðasta kílómetrastaða',
  },
  vehicleMileageInputLabel: {
    id: 'sp.vehicles:mileage-input-label',
    defaultMessage: 'Kílómetrastaða',
  },
  vehicleMileageInputPlaceholder: {
    id: 'sp.vehicles:mileage-input-placeholder',
    defaultMessage: 'Skráðu inn kílómetrastöðu',
  },
  vehicleMileageInputTitle: {
    id: 'sp.vehicles:mileage-input-title',
    defaultMessage: 'Skrá kílómetrastöðu',
  },
  vehicleMileageRegistration: {
    id: 'sp.vehicles:mileage-registration',
    defaultMessage: 'Skráning',
  },
  searchForPlate: {
    id: 'sp.vehicles:search-for-plate',
    defaultMessage: 'Leita eftir bílnúmeri',
  },
  mileageInputTooLow: {
    id: 'sp.vehicles:mileage-errors-input-too-low',
    defaultMessage: 'Verður að vera hærri en hæsta staðfesta skráning',
  },
  mileageInputMinLength: {
    id: 'sp.vehicles:mileage-errors-min-length',
    defaultMessage: 'Skrá verður inn kílómetrastöðu til að vista',
  },
  mileageSuccessFormTitle: {
    id: 'sp.vehicles:mileage-success-form-title',
    defaultMessage: 'Kílómetrastaða skráð',
  },
  mileageSuccessFormText: {
    id: 'sp.vehicles:mileage-success-form-text',
    defaultMessage:
      'Kílómetrastaða fyrir núverandi tímabil er skráð. Hægt er að uppfæra skráninguna hér að neðan til miðnættis {date}.',
  },
  mileageTagText: {
    id: 'sp.vehicles:mileage-tag-text',
    defaultMessage: 'Skrá kílómetrastöðu',
  },
  mileageAlreadyRegistered: {
    id: 'sp.vehicles:mileage-already-registered',
    defaultMessage: 'Kílómetrastaða fyrir núverandi tímabil er skráð.',
  },
  mileageExtLink: {
    id: 'sp.vehicles:mileage-external-link',
    defaultMessage: '/kilometragjald-a-vetnis-og-rafmagnsbila',
  },
})

export const ipMessages = defineMessages({
  title: {
    id: 'sp.intellectual-property:title',
    defaultMessage: 'Hugverkaréttindin mín',
  },
  description: {
    id: 'sp.intellectual-property:description',
    defaultMessage: 'Lýsing',
  },
  baseInfo: {
    id: 'sp.intellectual-property:base-info',
    defaultMessage: 'Grunnupplýsingar',
  },
  text: {
    id: 'sp.intellectual-property:text',
    defaultMessage: 'Texti',
  },
  image: {
    id: 'sp.intellectual-property:image',
    defaultMessage: 'Mynd',
  },
  images: {
    id: 'sp.intellectual-property:images',
    defaultMessage: 'Myndir',
  },
  audio: {
    id: 'sp.intellectual-property:audio',
    defaultMessage: 'Hljóðskrá',
  },
  video: {
    id: 'sp.intellectual-property:video',
    defaultMessage: 'Myndband',
  },
  animation: {
    id: 'sp.intellectual-property:video',
    defaultMessage: 'Hreyfimynd',
  },
  name: {
    id: 'sp.intellectual-property:name',
    defaultMessage: 'Nafn',
  },
  type: {
    id: 'sp.intellectual-property:type',
    defaultMessage: 'Tegund',
  },
  make: {
    id: 'sp.intellectual-property:make',
    defaultMessage: 'Gerð',
  },
  status: {
    id: 'sp.intellectual-property:status',
    defaultMessage: 'Staða',
  },
  internationalRegistration: {
    id: 'sp.intellectual-property:international-registration',
    defaultMessage: 'Alþjóðleg skráning',
  },
  internationalRegistrationDate: {
    id: 'sp.intellectual-property:international-registration-date',
    defaultMessage: 'Alþjóðlegur skráningardagur',
  },
  publish: {
    id: 'sp.intellectual-property:publish',
    defaultMessage: 'Birting',
  },
  publishDate: {
    id: 'sp.intellectual-property:publish-date',
    defaultMessage: 'Birtingardagur',
  },
  registration: {
    id: 'sp.intellectual-property:registration',
    defaultMessage: 'Skráning',
  },
  registrationDate: {
    id: 'sp.intellectual-property:registration-date',
    defaultMessage: 'Skráningardagur',
  },
  expires: {
    id: 'sp.intellectual-property:expires',
    defaultMessage: 'Gildir til',
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
    defaultMessage: 'https://island.is/umsoknir/endurnyja-einkanumer',
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
