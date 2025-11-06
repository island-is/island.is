import { defineMessages } from 'react-intl'

export const accidentLocation = {
  general: defineMessages({
    heading: {
      id: 'an.application:accidentLocation.heading',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'Heading for accident location',
    },
    sectionTitle: {
      id: 'an.application:accidentLocation.sectionTitle',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'Accident location section title',
    },
    listTitle: {
      id: 'an.application:accidentLocation.listTitle',
      defaultMessage: 'Staðsetning',
      description: 'Accident location list title',
    },
    description: {
      id: 'an.application:accidentLocation.description',
      defaultMessage: 'Vinsamlegast veldu hvar slysið átti sér stað',
      description: 'Accident location description',
    },
  }),
  generalWorkAccident: defineMessages({
    atTheWorkplace: {
      id: 'an.application:accidentLocation.generalWorkAccident.atTheWorkplace',
      defaultMessage: 'Á vinnustað',
      description:
        'Label for the at the workplace option in general accident location',
    },
    toOrFromTheWorkplace: {
      id: 'an.application:accidentLocation.generalWorkAccident.toOrFromTheWorkplace',
      defaultMessage: 'Á leið til eða frá vinnustað',
      description:
        'Label for the to or from the workplace option in general accident location',
    },
    other: {
      id: 'an.application:accidentLocation.generalWorkAccident.other',
      defaultMessage: 'Annars staðar á vegum vinnunar',
      description:
        'Label for the to or from the other option in general accident location',
    },
    heading: {
      id: 'an.application:accidentLocation.generalWorkAccident.heading',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'General accident location heading',
    },
  }),
  fishermanAccident: defineMessages({
    onTheShip: {
      id: 'an.application:accidentLocation.fishermanAccident.onTheShip',
      defaultMessage: 'Um borð í skipinu',
      description:
        'Label for the on the ship option in fisherman accident location',
    },
    toOrFromTheWorkplace: {
      id: 'an.application:accidentLocation.fishermanAccident.toOrFromTheWorkplace',
      defaultMessage: 'Á leið til eða frá vinnu',
      description:
        'Label for the to or from the workplace option in fisherman accident location',
    },
    other: {
      id: 'an.application:accidentLocation.fishermanAccident.other',
      defaultMessage: 'Annars staðar',
      description: 'Label for the other option in fisherman accident location',
    },
    heading: {
      id: 'an.application:accidentLocation.fishermanAccident.heading',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'Fisherman accident location heading',
    },
  }),
  professionalAthleteAccident: defineMessages({
    atTheClubsSportsFacilites: {
      id: 'an.application:accidentLocation.professionalAth.atTheClubsSportsFacilites',
      defaultMessage: 'Á skipulagðri æfingu, sýningu eða keppni.',
      description:
        'Label for the at the sports facilities option in sports accident location',
    },
    toOrFromTheSportsFacilites: {
      id: 'an.application:accidentLocation.professionalAth.toOrFromTheSportsFacilites',
      defaultMessage: 'Á leið til eða frá æfingu, sýningu eða keppni',
      description:
        'Label for the to or from the sports facilities option in sports accident location',
    },
    other: {
      id: 'an.application:accidentLocation.professionalAth.other',
      defaultMessage: 'Annars staðar',
      description: 'Label for the  other option in sports accident location',
    },
    heading: {
      id: 'an.application:accidentLocation.professionalAth.heading',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'Sports accident location heading',
    },
  }),
  agricultureAccident: defineMessages({
    atTheWorkplace: {
      id: 'an.application:accidentLocation.agricultureAccident.atTheWorkplace',
      defaultMessage: 'Á vinnustað',
      description:
        'Label for the at the workplace option in agriculture accident location',
    },
    toOrFromTheWorkplace: {
      id: 'an.application:accidentLocation.agricultureAccident.toOrFromTheWorkplace',
      defaultMessage: 'Á leið til eða frá vinnustað',
      description:
        'Label for the to or from the workplace option in agriculture accident location',
    },
    other: {
      id: 'an.application:accidentLocation.agricultureAccident.other',
      defaultMessage: 'Annars staðar á vegum vinnunar',
      description:
        'Label for the to or from the other option in agriculture accident location',
    },
    heading: {
      id: 'an.application:accidentLocation.agricultureAccident.heading',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'Agriculture accident location heading',
    },
  }),
  rescueWorkAccident: defineMessages({
    duringRescue: {
      id: 'an.application:accidentLocation.rescueWorkAccident.duringRescue',
      defaultMessage: 'Við björgunaraðgerðir',
      description:
        'Label for the during rescue option in rescue work accident location',
    },
    toOrFromRescue: {
      id: 'an.application:accidentLocation.rescueWorkAccident.toOrFromRescue',
      defaultMessage: 'Á leið til eða frá björgunaraðgerðum',
      description:
        'Label for the to or from the rescue in rescue work accident location',
    },
    other: {
      id: 'an.application:accidentLocation.rescueWorkAccident.other',
      defaultMessage: 'Annars staðar í vinnu vegna björgunaraðgerða',
      description: 'Label for the other in rescue work accident location',
    },
    description: {
      id: 'an.application:accidentLocation.rescueWorkAccident.description',
      defaultMessage:
        'Þeir sem vinna að björgun manna úr lífsháska eða vörnum gegn yfirvofandi meiriháttar tjóni á verðmætum eru slysatryggðir hjá Sjúkratryggingum Íslands.',
      description: 'Rescue work accident description',
    },
  }),
  studiesAccidentLocation: defineMessages({
    heading: {
      id: 'an.application:accidentLocation.studiesAccidentLocation.heading',
      defaultMessage: 'Hvar gerðist slysið?',
      description: 'Studies accident location heading',
    },
    description: {
      id: 'an.application:accidentLocation.studiesAccidentLocation.description',
      defaultMessage: 'Vinsamlegast veldu hvar atvikið átti sér stað',
      description: 'Studies accident location description',
    },
    atTheSchool: {
      id: 'an.application:accidentLocation.studiesAccidentLocation.atTheSchool',
      defaultMessage: 'Í kennslustofu eða skólahúsnæði',
      description: 'Label for at the school location',
    },
    other: {
      id: 'an.application:accidentLocation.studiesAccidentLocation.other',
      defaultMessage: 'Annars staðar á vegum skólans',
      description: 'Label for the other studies location',
    },
  }),
  fishermanAccidentLocation: defineMessages({
    whileSailing: {
      id: 'an.application:accidentLocation.fishermanAccidentLocation.whileSailing',
      defaultMessage: 'Á siglingu / á veiðum',
      description:
        'Label for the while sailing or fishing option in fisherman accident location',
    },
    inTheHarbor: {
      id: 'an.application:accidentLocation.fishermanAccidentLocation.inTheHarbor',
      defaultMessage: 'Í heimahöfn',
      description:
        'Label for the in the harbor option in fisherman accident location',
    },
    other: {
      id: 'an.application:accidentLocation.fishermanAccidentLocation.other',
      defaultMessage: 'Annars staðar',
      description: 'Label for the other option in fisherman accident location',
    },
    heading: {
      id: 'an.application:accidentLocation.fishermanAccidentLocation.heading',
      defaultMessage: 'Staðsetning skips',
      description: 'Fisherman accident location heading',
    },
    description: {
      id: 'an.application:accidentLocation.fishermanAccidentLocation.description',
      defaultMessage:
        'Vinsamlegast tilgreindu staðsetningu skips þegar slysið átti sér stað',
      description: 'Fisherman accident location description',
    },
  }),
  homeAccidentLocation: defineMessages({
    title: {
      id: 'an.application:accidentLocation.homeAccidentLocation.title',
      defaultMessage: 'Staðsetning á slysi',
      description: 'Home accident location title',
    },
    description: {
      id: 'an.application:accidentLocation.homeAccidentLocation.description',
      defaultMessage:
        'Vinsamlegast fylltu inn upplýsingar um hvar slysið átti sér stað.',
      description: 'Home accident location description',
    },
    address: {
      id: 'an.application:accidentLocation.homeAccidentLocation.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Home accident location address input field',
    },
    postalCode: {
      id: 'an.application:accidentLocation.fishermanAccidentLocation.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Home accident location postal code input field',
    },
    community: {
      id: 'an.application:accidentLocation.homeAccidentLocation.community',
      defaultMessage: 'Sveitarfélag',
      description: 'Home accident location community input field',
    },
    moreDetails: {
      id: 'an.application:accidentLocation.homeAccidentLocation.moreDetails',
      defaultMessage: 'Nánar',
      description: 'Home accident location more details textarea field',
    },
    moreDetailsPlaceholder: {
      id: 'an.application:accidentLocation.homeAccidentLocation.moreDetailsPlaceholder',
      defaultMessage: 'T.d. inn á heimili, innan lóðamarka eða í sumarbústað',
      description:
        'Home accident location more details placeholder in textarea field',
    },
  }),
}
