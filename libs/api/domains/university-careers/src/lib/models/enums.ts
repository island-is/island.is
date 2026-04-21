import { registerEnumType } from '@nestjs/graphql'
import { UniversityId } from '@island.is/clients/university-careers'
import { FileType, StudyType } from '../universityCareers.types'

registerEnumType(UniversityId, { name: 'UniversityCareersUniversityId' })
registerEnumType(FileType, { name: 'UniversityCareersStudentFileType' })
registerEnumType(StudyType, { name: 'UniversityCareersStudyType' })
