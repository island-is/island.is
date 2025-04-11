import {
  buildDescriptionField,
  buildKeyValueField,
} from '@island.is/application/core'
import format from 'date-fns/format'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const rehabilitationObjective = [
  buildDescriptionField({
    id: 'rehabilitationPlan.rehabilitationObjective',
    title:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjective,
    titleVariant: 'h3',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveStart,
    value: format(new Date('2024-11-08'), 'dd.MM.yyy'),
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveEstimatedEnd,
    value: format(new Date('2024-11-25'), 'dd.MM.yyy'),
    width: 'half',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveEmphasisAndAim,
    value:
      'Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectivePhysicalHealthGoals,
    value:
      'Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. ',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectivePhysicalHealthGoalsTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveResources,
    value: 'xxx ekki tilbúið xxx',
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveMentalHealthGoals,
    value: 'Á ekki við',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveMentalHealthGoalsTooltip,
    marginBottom: 3,
  }),
  buildKeyValueField({
    label:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveActivityAndParticipationGoals,
    value:
      'Torem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    tooltip:
      medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
        .rehabilitationObjectiveActivityAndParticipationGoalsTooltip,
    marginBottom: 3,
  }),
]
