import { nullEvent } from 'xstate/lib/actionTypes'

/* eslint-disable local-rules/disallow-kennitalas */
export const vehiclesList: any[] = [
  {
    isCurrent: true,
    permno: 'KZP28',
    regno: 'KZP28',
    vin: 'TMBLG9NE5E0055360',
    type: 'Skoda Octavia',
    color: 'Brúnn',
    firstRegDate: new Date('2014-02-03').toISOString(),
    modelYear: '2014',
    productYear: '2014',
    registrationType: 'Almenn notkun',
    role: null,
    operationStartDate: null,
    operationEndDate: null,
    outOfUse: false,
    otherOwners: null,
    termination: null,
    buyerPersidno: '2312892249',
    ownerPersidno: '2312892249',
    vehicleStatus: 'Í lagi',
    useGroup: 'Almenn notkun',
    vehGroup: 'N1',
    plateStatus: 'Í lagi',
  },
  {
    isCurrent: true,
    permno: 'KZP28',
    regno: 'KZP28',
    vin: 'TMBLG9NE5E0055360',
    type: 'Volvo',
    color: 'Brúnn',
    firstRegDate: new Date('2014-02-03').toISOString(),
    modelYear: '2014',
    productYear: '2014',
    registrationType: 'Almenn notkun',
    role: null,
    operationStartDate: null,
    operationEndDate: null,
    outOfUse: false,
    otherOwners: null,
    termination: null,
    buyerPersidno: '2312892249',
    ownerPersidno: '2312892249',
    vehicleStatus: 'Í lagi',
    useGroup: 'Almenn notkun',
    vehGroup: 'N1',
    plateStatus: 'Í lagi',
  },
]

export const vehicleDetail = {
  message: 'message',
  permno: 'KZP28',
  regno: 'KZP28',
  vin: 'TMBLG9NE5E0055360',
  typeno: 'Skoda Octavia',
  typeapproval: 0,
  typeapprovalextensionvalue: 0,
  eutypeapproval: 'Almenn notkun',
  variant: 'Skoda Octavia',
  version: 'Skoda Octavia',
  modelcode: 'Skoda Octavia',
  make: 'Skoda',
  vehcom: 'Skoda',
  speccom: 'Skoda',
  color: 'Brúnn',
  productyear: 2014,
  modelyear: 2014,
  preregdate: '2014-02-03',
  customsdate: '2014-02-03',
  firstregdate: '2014-02-03',
  newregdate: '2014-02-03',
  deregdate: '2014-02-03',
  reregdate: '2014-02-03',
  ownregdate: '2014-02-03',
  manufacturer: 'Skoda',
  country: 'Iceland',
  formercountry: 'Iceland',
  importerpersidno: '2312892249',
  importername: 'Skoda',
  import: 'Skoda',
  vehiclestatus: 'Í lagi',
  disastertype: null,
  hasdisasters: false,
  fixed: false,
  hasaccidents: false,
  usegroup: 'Almenn notkun',
  regtype: 'Almenn notkun',
  platetypefront: 'Almenn notkun',
  platetyperear: 'Almenn notkun',
  platestatus: 'Í lagi',
  platestoragelocation: 'Almenn notkun',
  insurancecompany: 'Vörður',
  insurancestatus: true,
  nextinspectiondate: '2014-02-03',
  nextinspectiondateIfPassedInspectionToday: '2014-02-03',
  rebuilt: null,
  offroad: null,
  taxgroup: 'N1',
  techincal: {
    vehgroup: 'vehgroup',
    vehsubgroup: 'vehsubgroup',
    engine: 'engine',
    pass: 'pass',
    passbydr: 'passbydr',
    enginecode: 'engincode',
    workingpr: 'workingpr',
    directinj: false,
    nocylinders: 123,
    arrcylinders: 'arrcylinders',
    capacity: 123,
    atmin: 123,
    clutchtype: 'clutchtype',
    gearbox: 'gearbox',
    gearratio1: 123,
    gearratio2: 123,
    gearratio3: 123,
    gearratio4: 123,
    gearratio5: 123,
    gearratio6: 123,
    findrivratio: 123,
    steermeth: false,
    typeofbody: 'typeofbody',
    doorsno: 123,
    seatno: 123,
    standingno: 123,
    maxspeed: 123,
    soundstat: 123,
    sounddrive: 123,
    co: 123,
    hc: 123,
    nox: 123,
    hcnox: 123,
    remark: 123,
    roofload: 123,
    noofgears: 123,
    soundatmin: 123,
    particulates: 123,
    urban: 123,
    extraurban: 123,
    combined: 123,
    co2: 123,
    weightedCo2: 123,
    co2Wltop: 123,
    weightedco2Wltp: 123,
    brakedevice: 'brakedevice',
    snumber: 'snumber',
    tMassoftrbr: 123,
    tMassoftrunbr: 123,
    tyre: {
      tyreaxle1: 'tyreaxle1',

      tyreaxle2: 'tyreaxle2',

      tyreaxle3: 'tyreaxle3',

      tyreaxle4: 'tyreaxle4',

      tyreaxle5: 'tyreaxle5',
    },
    size: {
      length: 123,
      width: 123,
      height: 123,
    },
    axle: {
      axleno: 123,

      wheelsno: 123,

      axlepow1: false,

      axlepow2: false,

      axlepow3: false,

      axlepow4: false,
      axlepow5: false,

      wheelbase: false,

      axletrack1: 123,

      axletrack2: 123,

      axletrack3: 123,

      axletrack4: 123,

      axletrack5: 123,

      wheelaxle1: 'wheelaxle1',

      wheelaxle2: 'wheelaxle2',

      wheelaxle3: 'wheelaxle3',

      wheelaxle4: 'wheelaxle4',

      wheelaxle5: 'wheelaxle5',
    },
    mass: {
      massinro: 123,
      massofveh: 123,
      massdaxle1: 123,
      massdaxle2: 123,
      massdaxle3: 123,
      massdaxle4: 123,
      massdaxle5: 123,
      massmaxle1: 123,
      massmaxle2: 123,
      massmaxle3: 123,
      massmaxle4: 123,
      massmaxle5: 123,
      massladen: 123,
      massoftrbr: 123,
      massoftrunbr: 123,
      massofcomb: 123,
      massatcoup: 123,
      masscapacity: 123,
    },
  },
  owners: [
    {
      current: true,
      anonymous: false,
      purchasedate: '2014-02-03',
      ownregdate: '2014-02-03',
      receptiondate: '2014-02-03',
      persidno: '2312892249',
      fullname: 'Tryggvi Geir Magnusson',
      address: 'Fannafold 29',
      postalcode: '112',
      city: 'Reykjavík',
      ownerinsurancecode: '2312892249',
      coOwners: [
        {
          persidno: '1801912409',
          fullname: 'Asdis Erna Gudmundsdottir',
          address: 'Fannafold 29',
          postalcode: '112',
          city: 'Reykjavík',
        },
      ],
    },
  ],
  operators: [
    {
      current: true,
      mainoperator: true,
      serial: 123,
      startdate: '2014-02-03',
      enddate: '2024-02-03',
      persidno: '2312892249',
      fullname: 'Tryggvi Geir Magnusson',
      address: 'Fannafold 29',
      postalcode: '112',
      city: 'Reykjavík',
    },
  ],
  plates: [
    {
      date: '2014-02-03',
      regno: 'KZP28',
      reggroup: 'A1',
      reggroupname: 'Alemenn notkun',
    },
  ],
  disasters: [
    {
      date: '2014-02-03',
      invaliddate: '2014-02-03',
      disastertype: 'disastertype',
    },
  ],
  registrations: [
    {
      date: '2014-02-03',
      type: 'type',
      subtype: 'subtype',
    },
  ],
  outofuses: [
    {
      date: '2014-02-03',
      type: 'type',
      station: 'station',
    },
  ],
  updatelocks: [
    {
      startdate: '2014-02-03',
      enddate: '2024-02-03',
      type: 'type',
    },
  ],
  stolens: [
    {
      startdate: '2014-02-03',
      enddate: '2024-02-03',
      explanation: 'explanation',
    },
  ],
  remarks: [
    {
      date: '2014-02-03',
      text: 'text',
      invaliddate: '2014-02-03',
    },
  ],
  inspections: [
    {
      date: '2014-02-03',
      reinspectiondate: '2014-02-03',
      station: 'station',
      type: 'type',
      officer: 'officer',
      result: 'result',
      odometer: 'odometer',
      remarks: [
        {
          itemcode: 'itemcode',
          itemname: 'itemname',
          resultcode: 'resultcode',
          resultname: 'resultname',
        },
      ],
    },
  ],
  ownerregistrationerrors: [
    {
      purchasedate: '2014-02-03',
      persidno: '2312892249',
      ownerinsurancecode: '2312892249',
    },
  ],
  vehicleChanges: [
    {
      date: '2014-02-03',
      changes: [
        {
          fieldName: 'fieldName',
          oldValue: 'oldValue',
          newValue: 'newValue',
        },
      ],
    },
  ],
  typeChanges: [
    {
      date: '2014-02-03',
      changes: [
        {
          fieldName: 'fieldName',
          oldValue: 'oldValue',
          newValue: 'newValue',
        },
      ],
    },
  ],
  specialEquipmentChanges: [
    {
      date: '2014-02-03',
      description: 'description',
      invalidDate: '2014-02-03',
    },
  ],
  addonsChanges: [
    {
      date: '2014-02-03',
      type: 'type',
      description: 'description',
      invalidDate: '2014-02-03',
    },
  ],
  superstructureChanges: [
    {
      date: '2014-02-03',
      type: 'type',
      length: 123,
      width: 123,
      mass: 123,
      invalidDate: '2014-02-03',
    },
  ],
  adrs: [
    {
      date: '2014-02-03',
      expires: '2014-02-03',
      exii: false,
      exiii: false,
      fl: false,
      ox: false,
      at: false,
      pressexpires: '2014-02-03',
      invaliddate: '2014-02-03',
    },
  ],
}

// Grunnupplýsingar
// * Tegund
// * Skráningarnúmer
// * Undirtegng
// * Fastanúmer
// * Verksmiðjunúmer
// * Árgerð
// * Framleiðsluland
// * Framleiðsluár
// * Fyrra skráningarland
// * Innflutningsástand
export const basicInfo = {
  model: 'KIA',
  regno: 'RIF88',
  subModel: 'RIO', //vehcom (+ speccom?) // Undirtegund
  permno: 'RIF88', // Fastanúmer
  verno: 'KNADM514AG6817531',
  year: null, // modelYear || productYear // ef ekkert er skráð þá er þetta null
  country: 'Suður Kórea',
  preregDateYear: '2016', // preregdate -> year
  formerCountry: null, // formercountry
  importStatus: 4, // ?? import & tala
}

// Skráning
// * Fyrsta skráning
// * Forskráning
// * Nýskráning
// * Ökutækisflokkur
// * Litur
// * Skráningarflokkur
// * Farþegar
// * Notkunarflokkur
// * Farþegar hjá ökumanni
// * Farþegar í stæði
export const registration = {
  firstRegistrationDate: '2017-03-15', // firstregdate
  preRegistrationDate: '2016-12-29', // preregdate
  newRegistrationDate: '2017-03-15', // newregdate
  vehicleGroup: 'Fólksbifreið (M1)', // technical -> vehGroup // ökutækisflokkur
  color: 'Blár', // color
  reggroup: null, // Skráningarflokkur // plates -> reggroup
  passengers: 4, // pass
  useGroup: 'Almenn notkun', // usegroup
  driversPassengers: 1, // passbydr
  standingPassengers: 0, // standingno
}

// Eigandi
// * Eigandi
// * Kennitala
// * Heimilisfang
// * Póstnúmer
// * Borg/bær
// * Kaupdagur
export const currentOwner = {
  owner: 'Kristlind Þóra Sigurðardóttir', // owners -> current -> fullname
  persidno: '2312892249', // owners -> current -> persidno
  address: 'Fannafold 29', // owners -> current -> address
  postalcode: '112', // owners -> current -> postalcode
  city: 'Reykjavík', // owners -> current -> city
  dateOfPurchase: '2017-03-15', // owners -> current -> purchasedate
}

// Skoðun & gjöld
// * Tegund skoðunar
// * Dagsetning
// * Niðurstaða
// * Staða plötu
// * Bifreiðagjöld
// * Tryggt
// * Næsta aðalskoðun
// * Síðasta skoðun
// * Móttökudagur
// * Geymslustaður
// * Veðbönd
// * Vanrækslugjald
export const inspectionInfo = {
  type: 'Fulltrúaskoðun', // inspections -> type
  date: '2017-03-15', // inspetctions -> date
  result: 'Án athugasemda', // inspections -> result
  plateStatus: 'Á ökutæki', //platestatus
  lastInspectionDate: '2016-03-15',
  nextInspectionDate: '2018-03-15', //nextinspectiondate
  mortages: null, // ??
  negligenceFee: null, // ??
  insuranceStatus: true, //insurancestatus
  carTaxes: null, // ??
  plateLocation: null, //platestoragelocation
}

// Tæknilegar upplýsingar
// * Vélargerð
// * Heildarþyngd
// * Lengd
// * Þyngd vagnlestar
// * Slagrými
// * Eiginþyngd
// * Breidd
// * Óhemlaður vagn
// * Afl(hö)
// * Burðargeta
// * Hemlaður eftirvagn
// * Leyfð ásþyngd
// * Ás 			1		Stærð hjólbarða	XX
// * Ás			  2		Stærð hjólbarða	XX
export const technicalInfo = {
  engine: 'Dísel',
  totalWeight: '1690', // mass -> massladen
  length: '4050', // size => length
  capacityWeight: '476', // masscapacity
  capactiy: '1396', // capacity ????
  vehicleWeight: '1214', // massinro
  width: '1720', // size => width
  trailerWithoutBrakesWeight: '450', // massoftrunbr
  horsepower: null, // ??
  carryingCapacity: null, // ??
  trailerWithBrakesWeight: '1100', // massoftrbr
  axleTotalWeight: '1785', // massmaxle1 + massmaxle2 + massmaxle3 + massmaxle4 + massmaxle5
  axle: [
    {
      axleNumber: '1',
      axleMaxWeight: '945', // massmaxle1
      wheelAxle: '5.5JX15 36',
    },
    {
      axleNumber: '2',
      axleMaxWeight: '840', // massmaxle2
      wheelAxle: '5.5JX15 36',
    },
    // gætu verið allt að 5
  ],
}

// Eigendaferill
// Númer Nafn Heimilisfang Kaupdagur í venjulegri töflu

export const owners = [
  {
    ownerNumber: '3',
    name: 'Kristlind Þóra Sigurðardóttir',
    address: 'Fannafold 29',
    dateOfPurchase: '2019-03-15',
  },
  {
    ownerNumber: '2',
    name: 'Kristlind Þóra Sigurðardóttir',
    address: 'Fannafold 29',
    dateOfPurchase: '2018-03-15',
  },
  {
    ownerNumber: '1',
    name: 'Kristlind Þóra Sigurðardóttir',
    address: 'Fannafold 29',
    dateOfPurchase: '2017-03-15',
  },
]

export const vehicleDetailReal = {
  message: null,
  permno: 'RIF88', // Fastanúmer
  regno: 'RIF88', // Skráningarnúmer (t.d ef einkanúmer)
  vin: 'KNADM514AG6817531', // Vehicle Information Number (kennitala bílsins)
  typeno: 'KNADM5140034',
  typeapproval: 1314,
  typeapprovalextension: 34,
  eutypeapproval: 'e11*2007/46*0195*13',
  variant: 'F5D81',
  version: 'M67DZ1',
  modelcode: 'NX1 12353 JONR',
  make: 'KIA',
  vehcom: 'RIO',
  speccom: null,
  color: 'Blár',
  productyear: null,
  modelyear: null,
  preregdate: '2016-12-29', // hvenær bíll er forskráður í kerfinu, þ.e bílar geta verið skráðir í kerfið áður en þeir koma til landsins, þegar þeir hafa verið pantaðir
  customsdate: '2017-03-10', // hvenær bíll er tollaður
  firstregdate: '2017-03-15', // hvenær bíll er fyrst skráður (á götuna) í heiminum. Þetta er sama dagsetning og newregdate nema þegar bíll er keyptur notaður erlendis og fluttur inn
  newregdate: '2017-03-15', // hvenær bíll er fyrst skráður (á götuna) á Íslandi.
  deregdate: null,
  reregdate: null,
  ownregdate: '2017-04-10', // kaupdagur núverandi eiganda
  manufacturer: 'KIA',
  country: 'Suður Kórea',
  formercountry: null,
  importerpersidno: '4507042290',
  importername: 'Bílaumboðið Askja ehf.',
  import: '4',
  vehiclestatus: 'Í lagi',
  disastertype: '',
  hasdisasters: false,
  fixed: false,
  hasaccidents: false,
  usegroup: 'Almenn notkun',
  regtype: 'Almenn merki',
  platetypefront: null,
  platetyperear: null,
  platestatus: 'Á ökutæki',
  platestoragelocation: null,
  insurancecompany: 'Vátryggingafélag Íslands',
  insurancestatus: false,
  nextinspectiondate: '2021-08-01',
  nextinspectiondateIfPassedInspectionToday: '2023-08-01',
  rebuilt: false,
  offroad: false,
  taxgroup: 'Ökutæki án skattflokks',
  techincal: {
    vehgroup: 'Fólksbifreið (M1)',
    vehsubgroup: null,
    engine: 'Dísel',
    pass: 4,
    passbydr: true,
    engingemanuf: null,
    enginecode: 'D4FC-6I',
    workingpr: 'Þjöppukveikja',
    directinj: false,
    nocylinders: 4,
    arrcylinders: '1',
    capacity: 1396,
    atmin: 4000,
    clutchtype: '1',
    gearbox: '1',
    gearratio1: null,
    gearratio2: null,
    gearratio3: null,
    gearratio4: null,
    gearratio5: null,
    gearratio6: null,
    findrivratio: null,
    steermeth: null,
    typeofbody: 'AF',
    doorsno: 5,
    seatno: 5,
    standingno: null,
    maxspeed: 169,
    soundstat: 78,
    sounddrive: 72,
    co: 0.234,
    hc: 0.054,
    nox: 0.05,
    hcnox: 0.103,
    remark: 'Aðrir hjólbarðar: 185/65R15,195/55R16,205/45R17,',
    roofload: 70,
    noofgears: 6,
    soundatmin: 3000,
    particulates: 0.001,
    urban: 4.4,
    extraurban: 3.4,
    combined: 3.8,
    co2: null,
    weightedCo2: null,
    co2Wltp: null,
    weightedco2Wltp: null,
    brakedevice: 'ABS',
    snumber: 'EC 136/2014W 13HRESC00',
    tMassoftrbr: 1100,
    tMassoftrunbr: 450,
    tyre: {
      tyreaxle1: '185/65R15 88H',
      tyreaxle2: '185/65R15 88H',
      tyreaxle3: null,
      tyreaxle4: null,
      tyreaxle5: null,
    },
    size: {
      length: 4050,
      width: 1720,
      height: 1455,
    },
    axle: {
      axleno: 2,
      wheelsno: 4,
      axlepow1: true,
      axlepow2: null,
      axlepow3: null,
      axlepow4: null,
      axlepow5: null,
      wheelbase: 2570,
      axletrack1: 1507,
      axletrack2: 1511,
      axletrack3: null,
      axletrack4: null,
      axletrack5: null,
      wheelaxle1: '5.5JX15 36',
      wheelaxle2: '5.5JX15 36',
      wheelaxle3: null,
      wheelaxle4: null,
      wheelaxle5: null,
    },
    mass: {
      massinro: 1214,
      massofveh: null,
      massdaxle1: 893,
      massdaxle2: 774,
      massdaxle3: null,
      massdaxle4: null,
      massdaxle5: null,
      massmaxle1: 945,
      massmaxle2: 840,
      massmaxle3: null,
      massmaxle4: null,
      massmaxle5: null,
      massladen: 1690,
      massoftrbr: 1100,
      massoftrunbr: 450,
      massofcomb: 2790,
      massatcoup: 50,
      masscapacity: 476,
    },
  },
  owners: [
    {
      current: true,
      anonymous: false,
      purchasedate: '2017-04-07',
      ownregdate: '2017-04-10',
      receptiondate: '2017-04-10',
      persidno: '2811882089',
      fullname: 'Kristleifur Þorsteinsson',
      address: 'Háaleitisbraut',
      postalcode: '108',
      city: 'Reykjavík',
      ownerinsurancecode: '6070',
      coOwners: [],
    },
    {
      current: false,
      anonymous: false,
      purchasedate: '2017-04-07',
      ownregdate: '2017-04-07',
      receptiondate: '2017-04-07',
      persidno: '4507042290',
      fullname: 'Bílaumboðið Askja ehf.',
      address: 'Krókhálsi',
      postalcode: '110',
      city: 'Reykjavík',
      ownerinsurancecode: '6070',
      coOwners: [],
    },
    {
      current: false,
      anonymous: false,
      purchasedate: '2017-03-15',
      ownregdate: '2017-03-15',
      receptiondate: '2017-03-15',
      persidno: '5810080150',
      fullname: 'Arion banki hf.',
      address: 'Borgartúni',
      postalcode: '105',
      city: 'Reykjavík',
      ownerinsurancecode: '6070',
      coOwners: [],
    },
  ],
  operators: [
    {
      current: false,
      mainoperator: true,
      serial: 1,
      startdate: '2017-03-15',
      enddate: '2017-04-07',
      persidno: '4507042290',
      fullname: 'Bílaumboðið Askja ehf.',
      address: 'Krókhálsi',
      postalcode: '110',
      city: 'Reykjavík',
    },
    {
      current: false,
      mainoperator: true,
      serial: 0,
      startdate: '2016-12-29',
      enddate: '2017-03-15',
      persidno: '4507042290',
      fullname: 'Bílaumboðið Askja ehf.',
      address: 'Krókhálsi',
      postalcode: '110',
      city: 'Reykjavík',
    },
  ],
  plates: [
    {
      date: '2017-04-10',
      regno: 'RIF88',
      reggroup: 'N1',
      reggroupname: 'Almenn merki',
    },
    {
      date: '2017-03-15',
      regno: 'RIO',
      reggroup: 'N2',
      reggroupname: 'Einkamerki',
    },
    {
      date: '2017-03-15',
      regno: 'RIF88',
      reggroup: 'N1',
      reggroupname: 'Almenn merki',
    },
  ],
  disasters: [],
  registrations: [
    {
      date: '2017-03-15',
      type: 'Nýskráð',
      subtype: 'Almenn',
    },
    {
      date: '2017-03-10',
      type: 'Tollafgreitt',
      subtype: 'Almenn',
    },
    {
      date: '2016-12-29',
      type: 'Forskráð',
      subtype: 'Almenn',
    },
  ],
  outofuses: [],
  updatelocks: [],
  stolens: [],
  remarks: [],
  inspections: [
    {
      date: '2017-03-15',
      reinspectiondate: null,
      station: 'Bílaumboðið Askja ehf.',
      type: 'Fulltrúaskoðun',
      officer: 'Grétar Freyr Sævarsson',
      result: 'Án athugasemda',
      odometer: '12',
      remarks: [],
    },
  ],
  ownerregistrationerrors: [],
  vehicleChanges: [
    {
      date: '2016-12-29',
      changes: [],
    },
  ],
  typeChanges: [],
  specialEquipmentChanges: [],
  addonsChanges: [],
  superstructureChanges: [],
  adrs: [],
}

export const vehicleSearchReal = {
  permno: 'RIF88',
  regno: 'RIF88',
  vin: 'KNADM514AG6817531',
  type: 'KIA RIO',
  color: 'Blár',
  firstregdate: '2017-03-15',
  latestregistration: 'Nýskráð',
}

export const vehicleListReal = {
  persidno: '2811882089',
  name: 'Kristleifur Þorsteinsson',
  address: 'Háaleitisbraut 17',
  postStation: '108',
  vehicleList: [
    {
      isCurrent: true,
      permno: 'RIF88',
      regno: 'RIO',
      vin: 'KNADM514AG6817531',
      type: 'KIA RIO',
      color: 'Blár',
      firstRegDate: '2017-03-15T12:00:00.00Z',
      modelYear: null,
      productYear: null,
      registrationType: 'Nýskráð-Almenn',
      role: 'Eigandi',
      operatorStartDate: '2017-04-07T02:35:30.30Z',
      operatorEndDate: null,
      outOfUse: true,
      otherOwners: false,
      termination: null,
      buyerPersidno: null,
      ownerPersidno: '4507042290',
      vehicleStatus: 'Í lagi',
      useGroup: 'Almenn notkun',
      vehGroup: 'Fólksbifreið (M1)',
      plateStatus: 'Á ökutæki',
    },
  ],
  createdTimestamp: '2022-04-08T01:29:35.35Z',
}
