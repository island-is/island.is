import { defineMessages } from 'react-intl'

const strings = defineMessages({
  heading: {
    id: 'judicial.system.court.indictments.completed.heading',
    defaultMessage: 'Máli lokið',
    description: 'Titill á Máli lokið síðu',
  },
  sendToPublicProsecutor: {
    id: 'judicial.system.core:indictments.completed.send_to_public_prosecutor',
    defaultMessage: 'Senda til ákæruvalds',
    description:
      'Notaður sem texti á takka til að senda mál til ríkissaksóknara.',
  },
  criminalRecordUpdateTitle: {
    id: 'judicial.system.core:indictments.completed.criminal_record_update_title',
    defaultMessage: 'Tilkynning til sakaskrár',
    description: 'Notaður sem titill á spurningu um birtingu dóms.',
  },
  serviceRequirementRequired: {
    id: 'judicial.system.core:indictments.completed.service_requirement_required',
    defaultMessage: 'Birta skal dómfellda dóminn',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar birta skal dómdfellda dóminn.',
  },
  serviceRequirementNotRequired: {
    id: 'judicial.system.core:indictments.completed.service_requirement_not_required',
    defaultMessage: 'Birting dóms ekki þörf',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar ekki skal birta dómdfellda dóminn.',
  },
  serviceRequirementNotApplicable: {
    id: 'judicial.system.core:indictments.completed.service_requirement_not_applicable',
    defaultMessage: 'Dómfelldi var viðstaddur dómsuppkvaðningu',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar birting dóms á ekki við.',
  },
})

export default strings
