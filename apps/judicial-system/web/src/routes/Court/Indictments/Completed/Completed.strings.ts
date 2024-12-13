import { defineMessages } from 'react-intl'

const strings = defineMessages({
  heading: {
    id: 'judicial.system.core:court.indictments.completed.heading',
    defaultMessage: 'Máli lokið',
    description: 'Titill á Máli lokið síðu',
  },
  sendToPublicProsecutor: {
    id: 'judicial.system.core:court.indictments.completed.send_to_public_prosecutor',
    defaultMessage: 'Senda til ákæruvalds',
    description:
      'Notaður sem texti á takka til að senda mál til ríkissaksóknara.',
  },
  criminalRecordUpdateTitle: {
    id: 'judicial.system.core:court.indictments.completed.criminal_record_update_title',
    defaultMessage: 'Tilkynning til sakaskrár',
    description:
      'Notaður sem titill á Tilkynning til sakaskrár hluta á máli lokið skjá.',
  },
  serviceRequirementTitle: {
    id: 'judicial.system.core:court.indictments.completed.service_requirement_title',
    defaultMessage: 'Ákvörðun um birtingu dóms',
    description:
      'Notaður sem titill á Ákvörðun um birtingu dóms hluta á máli lokið skjá.',
  },
  serviceRequirementRequired: {
    id: 'judicial.system.core:court.indictments.completed.service_requirement_required',
    defaultMessage: 'Birta skal dómfellda dóminn',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar birta skal dómdfellda dóminn.',
  },
  serviceRequirementNotRequired: {
    id: 'judicial.system.core:court.indictments.completed.service_requirement_not_required',
    defaultMessage: 'Birting dóms ekki þörf',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar ekki skal birta dómdfellda dóminn.',
  },
  serviceRequirementNotRequiredTooltip: {
    id: 'judicial.system.core:court.indictments.completed.service_requirement_not_required_tooltip',
    defaultMessage:
      'Ekki þarf að birta dóm þar sem sektarfjárhæð er lægri en sem nemur áfrýjunarfjárhæð í einkamáli kr. 1.355.762. Gildir frá 01.01.2024',
    description:
      'Notað sem tooltip í valmöguleika fyrir það þegar ekki skal birta dómdfellda dóminn.',
  },
  serviceRequirementNotApplicable: {
    id: 'judicial.system.core:court.indictments.completed.service_requirement_not_applicable',
    defaultMessage: 'Dómfelldi var viðstaddur dómsuppkvaðningu',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar birting dóms á ekki við.',
  },
  sentToPublicProsecutorModalTitle: {
    id: 'judicial.system.core:court.indictments.completed.sent_to_public_prosecutor_modal_title',
    defaultMessage: 'Mál sent til Ríkissaksóknara',
    description:
      'Notaður sem titill á staðfestingarmeldingu um að mál hafi verið sent til ákæruvalds.',
  },
  sentToPublicProsecutorModalMessage: {
    id: 'judicial.system.core:court.indictments.completed.sent_to_public_prosecutor_modal_message',
    defaultMessage: 'Gögn hafa verið send til Ríkissaksóknara til yfirlesturs.',
    description:
      'Notaður sem skilaboð í staðfestingarmeldingu um að mál hafi verið sent til ákæruvalds.',
  },
})

export default strings
