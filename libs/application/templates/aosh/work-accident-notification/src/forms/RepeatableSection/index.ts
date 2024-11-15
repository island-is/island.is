import { employeeSection } from '../WorkAccidentNotificationForm/EmployeeSection'
import { causeAndConsequencesSection } from '../WorkAccidentNotificationForm/CauseAndConsequencesSection'

export const EmployeeAndAccidentInformationSection = (index: number) => [
  employeeSection(index),
  causeAndConsequencesSection(index),
]
