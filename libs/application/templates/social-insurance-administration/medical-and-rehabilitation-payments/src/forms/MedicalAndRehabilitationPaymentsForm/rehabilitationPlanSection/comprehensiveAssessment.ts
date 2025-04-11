import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const comprehensiveAssessment = [
  buildDescriptionField({
    id: 'rehabilitationPlan.comprehensiveAssessment',
    title:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessment,
    titleVariant: 'h3',
    titleTooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentLearningAndApplyingKnowledge,
    value:
      'Nokkur færniskerðing (skert færni kemur nokkuð oft eða oft fram, en veldur ekki alvarlegri truflun í daglegur lífi)',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentGeneralTasksAndRequirements,
    value:
      'Mikil færniskerðing: Skert færni er viðvarandi eða mjög algeng og getur valdið alvarlegri truflun á daglegu lífi.',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentGeneralTasksAndRequirementsTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentCommunicationAndRelationships,
    value:
      'Nokkur færniskerðing: Skert færni kemur nokkuð oft eða oft fram, en veldur ekki alvarlegri truflun í daglegu lífi.',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentCommunicationAndRelationshipsTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentMobility,
    value:
      'Væg færniskerðing: Skert færni kemur stundum fram við vissar aðstæður, án þess þó að trufla daglegt líf að.',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentMobilityTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentSelfCare,
    value:
      'Mjög mikil eða algjör færniskerðing: Skert færni er mikil og viðvarandi, kemur í veg fyrir að einstaklingur geti sinnt daglegu lífi',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentSelfCareTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentDomesticLife,
    value: 'Get ekki metið',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentDomesticLifeTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentDailyLife,
    value:
      'Mikil færniskerðing: Skert færni er viðvarandi eða mjög algeng og getur valdið alvarlegri truflun á daglegu lífi.',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentDailyLifeTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentLeisureAndInterests,
    value: 'Get ekki metið',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .comprehensiveAssessmentLeisureAndInterestsTooltip,
    marginBottom: 3,
  }),
  buildDividerField({}),
]
