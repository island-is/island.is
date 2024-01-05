import { defineMessages } from 'react-intl'

export const indictmentCount = defineMessages({
  delete: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.delete',
    defaultMessage: 'Eyða',
    description: 'Notaður sem texti á Eyða hnappi á ákæruliða skrefi í ákærum.',
  },
  policeCaseNumberLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.police_case_number_label',
    defaultMessage: 'LÖKE málsnúmer',
    description:
      'Notaður sem titill á LÖKE málsnúmers lista á ákæruliða skrefi í ákærum.',
  },
  policeCaseNumberPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.police_case_number_placeholder',
    defaultMessage: 'Veldu málsnúmer',
    description:
      'Notaður sem skýritexti á LÖKE málsnúmers lista á ákæruliða skrefi í ákærum.',
  },
  vehicleRegistrationNumberLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.vehicle_registration_number_label',
    defaultMessage: 'Skráningarnúmer ökutækis',
    description:
      'Notaður sem titill á "skráningarnúmer ökutækis" svæði á ákæruliða skrefi í ákærum.',
  },
  vehicleRegistrationNumberPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.vehicle_registration_number_placeholder',
    defaultMessage: 'AB-123',
    description:
      'Notaður sem skýritexti á "skráningarnúmer ökutækis" svæði á ákæruliða skrefi í ákærum.',
  },
  incidentLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_label',
    defaultMessage: 'Brot',
    description:
      'Notaður sem titill á "brot" lista á ákæruliða skrefi í ákærum.',
  },
  incidentPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_placeholder',
    defaultMessage: 'Veldu brot',
    description:
      'Notaður sem skýritexti á "brot" lista á ákæruliða skrefi í ákærum.',
  },
  incidentDescriptionLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_label',
    defaultMessage: 'Atvikalýsing',
    description:
      'Notaður sem titill á "atvikalýsing" svæði á ákæruliða skrefi í ákærum.',
  },
  incidentDescriptionPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_placeholder',
    defaultMessage: 'Skrifaðu atvikalýsingu',
    description:
      'Notaður sem skýritexti á "atvikalýsing" svæði á ákæruliða skrefi í ákærum.',
  },
  bloodAlcoholContentLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.blood_alcohol_content_label',
    defaultMessage: 'Vínandamagn (‰)',
    description:
      'Notaður sem titill á "vínandamagn" svæði á ákæruliða skrefi í ákærum.',
  },
  bloodAlcoholContentPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.blood_alcohol_content_placeholder',
    defaultMessage: '0,00',
    description:
      'Notaður sem skýritexti á "vínandamagn" svæði á ákæruliða skrefi í ákærum.',
  },
  lawsBrokenLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.laws_broken_label',
    defaultMessage: 'Lagaákvæði',
    description:
      'Notaður sem titill á "lagaákvæði" leitarboxi á ákæruliða skrefi í ákærum.',
  },
  lawsBrokenPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.laws_broken_placeholder',
    defaultMessage: 'Leitaðu að lagaákvæði',
    description:
      'Notaður sem skýritexti á "lagaákvæði" leitarboxi á ákæruliða skrefi í ákærum.',
  },
  lawsBrokenTag: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.laws_broken_tag',
    defaultMessage: '{paragraph}. mgr. {article}. gr. umfl.',
    description: 'Notaður sem texti í lagaákvæði taggi.',
  },
  incidentDescriptionAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_auto_fill',
    defaultMessage:
      'fyrir umferðarlagabrot með því að hafa, {incidentDate}, ekið bifreiðinni {vehicleRegistrationNumber} {reason} um {incidentLocation}, þar sem lögregla stöðvaði aksturinn.',
    description:
      'Notaður sem skýritexti á "atvikalýsing" svæði á ákæruliða skrefi í umferðalagabrots ákærum.',
  },
  incidentDescriptionDrivingWithoutLicenceAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_driving_without_licence_auto_fill',
    defaultMessage: 'sviptur ökurétti',
    description:
      'Notaður sem ástæða í atvikalýsingu fyrir "sviptingarakstur" brot.',
  },
  incidentDescriptionDrunkDrivingAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_drunk_driving_auto_fill',
    defaultMessage: 'undir áhrifum áfengis',
    description:
      'Notaður sem ástæða í atvikalýsingu fyrir "ölvunarakstur" brot.',
  },
  incidentDescriptionIllegalDrugsDrivingAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_illegal_drugs_driving_auto_fill',
    defaultMessage: 'ávana- og fíkniefna',
    description:
      'Notaður sem ástæða í atvikalýsingu fyrir "fíkniefnaakstur" brot.',
  },
  incidentDescriptionPrescriptionDrugsDrivingAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_prescription_drugs_driving_auto_fill',
    defaultMessage: 'slævandi lyfja',
    description: 'Notaður sem ástæða í atvikalýsingu fyrir "lyfjaakstur" brot.',
  },
  incidentDescriptionDrugsDrivingPrefixAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_drugs_driving_prefix_auto_fill',
    defaultMessage: 'óhæfur til að stjórna henni örugglega vegna áhrifa',
    description: 'Notaður sem ástæða í atvikalýsingu fyrir "lyfjaakstur" brot.',
  },
  incidentDescriptionSubstancesPrefixAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_substances_prefix_auto_fill',
    defaultMessage: 'í blóðsýni mældist',
    description: 'Notaður sem upphafstexti fyrir efni í blóði í atvikalýsingu.',
  },
  legalArgumentsLabel: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.legal_arguments_label',
    defaultMessage: 'Heimfærsla',
    description:
      'Notaður sem titill á "heimfærslu" svæði á ákæruliða skrefi í ákærum.',
  },
  legalArgumentsPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.legal_arguments_placeholder',
    defaultMessage: 'Skrifaðu heimfærslu',
    description:
      'Notaður sem skýritexti á "heimfærslu" svæði á ákæruliða skrefi í ákærum.',
  },
  legalArgumentsAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.legal_arguments_autofill',
    defaultMessage:
      'Telst háttsemi þessi varða við {articles} umferðarlaga nr. 77/2019.',
    description: 'Notaður sem sjálfgefinn texti í heimfærslu svæði.',
  },
})
