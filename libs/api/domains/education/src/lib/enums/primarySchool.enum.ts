import { registerEnumType } from '@nestjs/graphql'

import { AgentType } from '@island.is/clients/mms/primary-school'

// Import AgentType through this file (not directly from the client) to ensure
// registerEnumType runs before any @Field decorator references this enum.
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
