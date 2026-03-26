import { registerEnumType } from '@nestjs/graphql'

import { AgentType } from '@island.is/clients/mms/primary-school'

// Re-export so models import from this file to make sure registerEnumType is called before model references it.
export { AgentType } from '@island.is/clients/mms/primary-school'

registerEnumType(AgentType, {
  name: 'EducationPrimarySchoolContactType',
  description:
    'The relationship between a logged-in user and a student in their care (e.g. Parent, Guardian, Sibling)',
  valuesMap: {
    GUARDIAN: { description: 'Legal guardian of the student' },
    RELATIVE: { description: 'Extended family member' },
    SIBLING: { description: 'Sibling of the student' },
    PARENT: { description: 'Parent of the student' },
    EMERGENCY_CONTACT: { description: 'Emergency contact for the student' },
  },
})
