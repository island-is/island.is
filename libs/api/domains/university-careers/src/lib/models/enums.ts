import { registerEnumType } from '@nestjs/graphql'
import { UniversityId } from '@island.is/clients/university-careers'
import { StudyType } from '../universityCareers.types'

registerEnumType(UniversityId, { name: 'UniversityCareersUniversityId' })
registerEnumType(StudyType, { name: 'UniversityCareersStudyType' })
