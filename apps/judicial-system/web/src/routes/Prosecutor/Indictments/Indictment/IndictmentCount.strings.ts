import { defineMessages } from 'react-intl'

export const indictmentCount = defineMessages({
  delete: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.delete',
    defaultMessage: 'Eyða',
    description: 'Notaður sem texti á Eyða hnappi á ákæruliða skrefi í ákærum.',
  },
  policeCaseNumberLabel: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.police_case_number_label',
    defaultMessage: 'LÖKE málsnúmer',
    description:
      'Notaður sem titill á LÖKE málsnúmers lista á ákæruliða skrefi í ákærum.',
  },
  policeCaseNumberPlaceholder: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.police_case_number_placeholder',
    defaultMessage: 'Veldu málsnúmer',
    description:
      'Notaður sem skýritexti á LÖKE málsnúmers lista á ákæruliða skrefi í ákærum.',
  },
  vehicleRegistrationNumberLabel: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.vehicle_registration_number_label',
    defaultMessage: 'Skráningarnúmer ökutækis',
    description:
      'Notaður sem titill á "skráningarnúmer ökutækis" svæði á ákæruliða skrefi í ákærum.',
  },
  vehicleRegistrationNumberPlaceholder: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.vehicle_registration_number_placeholder',
    defaultMessage: 'AB-123',
    description:
      'Notaður sem skýritexti á "skráningarnúmer ökutækis" svæði á ákæruliða skrefi í ákærum.',
  },
  incidentLabel: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.incident_label',
    defaultMessage: 'Brot',
    description:
      'Notaður sem titill á "brot" lista á ákæruliða skrefi í ákærum.',
  },
  incidentPlaceholder: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.incident_placeholder',
    defaultMessage: 'Veldu brot',
    description:
      'Notaður sem skýritexti á "brot" lista á ákæruliða skrefi í ákærum.',
  },
  incidentDescriptionLabel: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.incident_description_label',
    defaultMessage: 'Atvikalýsing',
    description:
      'Notaður sem titill á "atvikalýsing" svæði á ákæruliða skrefi í ákærum.',
  },
  incidentDescriptionPlaceholder: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.incident_description_placeholder',
    defaultMessage: 'Skrifaðu atvikalýsingu',
    description:
      'Notaður sem skýritexti á "atvikalýsing" svæði á ákæruliða skrefi í ákærum.',
  },
  trafficViolationIncidentDescriptionAutofill: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.traffic_violation_incident_description_auto_fill',
    defaultMessage:
      'fyrir umferðalagabrot með því að hafa, {incidentDate}, ekið bifreiðinni {vehicleRegistrationNumber} {offense, select, DRIVING_WITHOUT_LICENCE {án leyfis} DRUNK_DRIVING {undir áhrifum áfengis} other {[Brot]}} um {incidentLocation}, þar sem lögregla stöðvaði aksturinn.',
    description:
      'Notaður sem skýritexti á "atvikalýsing" svæði á ákæruliða skrefi í ákærum.',
  },
  lawsBrokenLabel: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.laws_broken_label',
    defaultMessage: 'Lagaákvæði',
    description:
      'Notaður sem titill á "lagaákvæði" leitarboxi á ákæruliða skrefi í ákærum.',
  },
  lawsBrokenPlaceholder: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.laws_broken_placeholder',
    defaultMessage: 'Leitaðu að lagaákvæði',
    description:
      'Notaður sem skýritexti á "lagaákvæði" leitarboxi á ákæruliða skrefi í ákærum.',
  },
  lawsBrokenTag: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.laws_broken_tag',
    defaultMessage: '{paragraph}. mgr. {article}. gr. umfl.',
    description: 'Notaður sem texti í lagaákvæði taggi.',
  },
  legalArgumentsLabel: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.legal_arguments_label',
    defaultMessage: 'Heimfærsla',
    description:
      'Notaður sem titill á "heimfærslu" svæði á ákæruliða skrefi í ákærum.',
  },
  legalArgumentsPlaceholder: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.legal_arguments_placeholder',
    defaultMessage: 'Skrifaðu heimfærslu',
    description:
      'Notaður sem skýritexti á "heimfærslu" svæði á ákæruliða skrefi í ákærum.',
  },
  legalArgumentsAutofill: {
    id:
      'judicial.system.core:indictments_indictment.indictment_count.legal_arguments_autofill',
    defaultMessage:
      'Telst háttsemi þessi varða við {articles} umferðarlaga nr. 77/2019.',
    description: 'Notaður sem sjálfgefinn texti í heimfærslu svæði.',
  },
})
