import { ObjectType, Field } from '@nestjs/graphql'
import { FileType } from '../universityCareers.types'

@ObjectType('UniversityCareersStudentFile')
export class StudentFile {
  @Field(() => FileType)
  type!: FileType

  @Field()
  displayName!: string

  @Field()
  fileName!: string

  @Field({ nullable: true })
  downloadServiceURL?: string
}
