import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  incidentDescriptionShortAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_short_auto_fill',
    defaultMessage: 'fyrir umferðarlagabrot með því að hafa, {incidentDate}',
    description:
      'Notaður sem skýritexti á "atvikalýsing" svæði á ákæruliða skrefi í umferðalagabrots ákærum þegar "annað" umferðarlagabrot er valið.',
  },
  incidentDescriptionAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_auto_fill_v1',
    defaultMessage:
      'fyrir umferðarlagabrot með því að hafa, {incidentDate}, ekið bifreiðinni {vehicleRegistrationNumber} {reason} um {incidentLocation}, {isSpeeding, select, true {á {recordedSpeed} km hraða á klukkustund, að teknu tilliti til vikmarka, þar sem leyfður hámarkshraði var {speedLimit} km/klst} other {þar sem lögregla stöðvaði aksturinn}}.',
    description:
      'Notaður sem skýritexti á "atvikalýsing" svæði á ákæruliða skrefi í umferðalagabrots ákærum.',
  },
  indictmentDescriptionSubtypesAutofill: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.indictment_description_subtypes_auto_fill',
    defaultMessage: 'fyrir [{subtypes}] með því að hafa, {date}',
    description:
      'Notaður sem ástæða í atvikalýsingu fyrir önnur brot en umferðalagabrot.',
  },
})
