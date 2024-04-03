import {
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  DefaultEvents,
} from '@island.is/application/types'

type HealthInsuranceDeclarationEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }

const HealthInsuranceDeclarationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<HealthInsuranceDeclarationEvent>,
  HealthInsuranceDeclarationEvent
> = {}

export default HealthInsuranceDeclarationTemplate
