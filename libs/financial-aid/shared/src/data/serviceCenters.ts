import { ServiceCenter } from '../lib'

// Compiled from https://www.samband.is/sveitarfelogin/ list and
// https://is.wikipedia.org/wiki/Íslensk_sveitarfélög_eftir_sveitarfélagsnúmerum

export const serviceCenters: Pick<
  ServiceCenter[],
  'name' & 'number' & 'link'
> = [
  {
    name: 'Þjónustumiðstöð Vesturbæjar, Miðborgar og Hlíða',
    number: 0,
    link: 'https://reykjavik.is/fjarhagsadstod',
  },
  {
    name: 'Þjónustumiðstöð Laugardals og Háaleitis',
    number: 0,
    link: 'https://reykjavik.is/fjarhagsadstod',
  },
  {
    name: 'Þjónustumiðstöð Árbæjar og Grafarholts',
    number: 0,
    postalCodes: [110, 113],
    link: 'https://reykjavik.is/fjarhagsadstod',
  },
  {
    name: 'Þjónustumiðstöð Breiðholts',
    number: 0,
    postalCodes: [109, 111],
    link: 'https://reykjavik.is/fjarhagsadstod',
  },
  {
    name: 'Þjónustumiðstöð Grafarvogs og Kjalarness - Miðgarður',
    number: 0,
    postalCodes: [110, 112, 116, 162],
    link: 'https://reykjavik.is/fjarhagsadstod',
  },
  {
    name: 'Kópavogur',
    number: 1000,
    postalCodes: [200, 201, 202, 203],
  },
  {
    name: 'Seltjarnarnes',
    number: 1100,
    postalCodes: [170],
  },
  {
    name: 'Garðabær',
    number: 1300,
    postalCodes: [210, 212, 225],
  },
  {
    name: 'Hafnarfjörður',
    number: 1400,
    postalCodes: [220, 221, 222],
    active: true,
  },
  {
    name: 'Reykjanesbær',
    number: 2000,
    postalCodes: [230, 232, 233, 235, 260],
  },
  {
    name: 'Grindavíkurbær',
    number: 2300,
    postalCodes: [240],
  },
  {
    name: 'Akranes',
    number: 3000,
    postalCodes: [300],
  },
  {
    name: 'Snæfellsbær',
    number: 3714,
    postalCodes: [360],
  },
  {
    name: 'Bolungarvík',
    number: 4100,
    postalCodes: [415],
  },
  {
    name: 'Ísafjarðarbær',
    number: 4200,
    postalCodes: [400, 401, 410, 425, 430, 470, 471],
  },
  {
    name: 'Akureyri',
    number: 6000,
    postalCodes: [600, 603, 611, 630],
  },
  {
    name: 'Norðurþing',
    number: 6100,
    postalCodes: [640, 670, 671, 675],
  },
  {
    name: 'Fjallabyggð',
    number: 6250,
    postalCodes: [580, 625],
  },
  {
    name: 'Dalvíkurbyggð',
    number: 6400,
    postalCodes: [620, 621],
  },
  {
    name: 'Seyðisfjörður',
    number: 7000,
    postalCodes: [710],
  },
  {
    name: 'Fjarðabyggð',
    number: 7300,
    postalCodes: [715, 730, 735, 740, 750, 755],
  },
  {
    name: 'Vestmannaeyjar',
    number: 8000,
    postalCodes: [900, 902],
  },
  {
    name: 'Sveitarfélagið Árborg',
    number: 8200,
    postalCodes: [800, 801, 802, 820, 825],
  },
  {
    name: 'Mosfellsbær',
    number: 1604,
    postalCodes: [270],
  },
  {
    name: 'Kjósarhreppur',
    number: 1606,
    postalCodes: [270],
  },
  {
    name: 'Sandgerði',
    number: 2503,
    postalCodes: [245],
  },
  {
    name: 'Sveitarfélagið Garður',
    number: 2504,
    postalCodes: [250],
  },
  {
    name: 'Sveitarfélagið Vogar',
    number: 2506,
    postalCodes: [190],
  },
  {
    name: 'Skorradalshreppur',
    number: 3506,
    postalCodes: [311],
  },
  {
    name: 'Hvalfjarðarsveit',
    number: 3511,
    postalCodes: [301],
  },
  {
    name: 'Borgarbyggð',
    number: 3609,
    postalCodes: [310, 311, 320],
  },
  {
    name: 'Grundarfjarðarbær',
    number: 3709,
    postalCodes: [350],
  },
  {
    name: 'Eyja- og Miklaholtshreppur',
    number: 3713,
    postalCodes: [311],
  },
  {
    name: 'Dalabyggð',
    number: 3811,
    postalCodes: [370, 371],
  },
  {
    name: 'Reykhólahreppur',
    number: 4502,
    postalCodes: [380],
  },
  {
    name: 'Tálknafjarðarhreppur',
    number: 4604,
    postalCodes: [460],
  },
  {
    name: 'Vesturbyggð',
    number: 4607,
    postalCodes: [450, 451, 465],
  },
  {
    name: 'Súðavíkurhreppur',
    number: 4803,
    postalCodes: [420],
  },
  {
    name: 'Árneshreppur',
    number: 4901,
    postalCodes: [524],
  },
  {
    name: 'Kaldrananeshreppur',
    number: 4902,
    postalCodes: [510, 520],
  },
  {
    name: 'Strandabyggð',
    number: 4911,
    postalCodes: [510],
  },
  {
    name: 'Húnaþing vestra',
    number: 5508,
    postalCodes: [530, 531],
  },
  {
    name: 'Sveitarfélagið Skagaströnd',
    number: 5609,
    postalCodes: [545],
  },
  {
    name: 'Skagabyggð',
    number: 5611,
    postalCodes: [545],
  },
  {
    name: 'Eyjafjarðarsveit',
    number: 6513,
    postalCodes: [601],
  },
  {
    name: 'Hörgársveit',
    number: 6515,
    postalCodes: [601],
  },
  {
    name: 'Svalbarðarsstrandarhreppur',
    number: 6601,
    postalCodes: [601],
  },
  {
    name: 'Grýtubakkahreppur',
    number: 6602,
    postalCodes: [601, 610],
  },
  {
    name: 'Tjörneshreppur',
    number: 6611,
    postalCodes: [641],
  },
  {
    name: 'Vopnafjarðarhreppur',
    number: 7502,
    postalCodes: [690],
  },
  {
    name: 'Fljótsdalshreppur',
    number: 7505,
    postalCodes: [701],
  },
  {
    name: 'Borgarfjarðarhreppur',
    number: 7509,
    postalCodes: [701],
  },
  {
    name: 'Djúpavogshreppur',
    number: 7617,
    postalCodes: [765, 766],
  },
  {
    name: 'Fljótsdalshérað',
    number: 7620,
    postalCodes: [700, 701],
  },
  {
    name: 'Sveitarfélagið Hornafjörður',
    number: 7708,
    postalCodes: [780, 781, 785],
  },
  {
    name: 'Mýrdalshreppur',
    number: 8508,
    postalCodes: [870, 871],
  },
  {
    name: 'Skaftárhreppur',
    number: 8509,
    postalCodes: [880],
  },
  {
    name: 'Áshreppur',
    number: 8610,
    postalCodes: [851],
  },
  {
    name: 'Rangárþing eystra',
    number: 8613,
    postalCodes: [860, 861],
  },
  {
    name: 'Rangárþing ytra',
    number: 8614,
    postalCodes: [850, 851],
  },
  {
    name: 'Hrunamannahreppur',
    number: 8710,
    postalCodes: [845],
  },
  {
    name: 'Hveragerði',
    number: 8716,
    postalCodes: [810],
  },
  {
    name: 'Sveitarfélagið Ölfus',
    number: 8717,
    postalCodes: [815],
  },
  {
    name: 'Grímsnes- og Grafningshreppur',
    number: 8719,
    postalCodes: [801],
  },
  {
    name: 'Skeiða- og Gnúpverjahreppur',
    number: 8720,
    postalCodes: [801],
  },
  {
    name: 'Bláskógabyggð',
    number: 8721,
    postalCodes: [801],
  },
  {
    name: 'Flóahreppur',
    number: 8722,
    postalCodes: [801],
  },
  {
    name: 'Skagafjörður',
    number: 5716,
    postalCodes: [500],
  },
  {
    name: 'Stykkishólmsbær og Helgafellssveit',
    number: 3716,
    postalCodes: [340],
  },
  {
    name: 'Þingeyjarsveit',
    number: 6613,
    postalCodes: [650],
  },
  {
    name: 'Húnabyggð',
    number: 5613,
    postalCodes: [540],
  },
  {
    name: 'Langanesbyggð',
    number: 6710,
    postalCodes: [680],
  },
]

export default serviceCenters
