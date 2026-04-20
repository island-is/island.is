import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { FileType } from '../universityCareers.types'

registerEnumType(FileType, {
  name: 'UniversityCareersStudentFileType',
})

@ObjectType('UniversityCareersStudentFile')
export class StudentFile {
  @Field(() => FileType)
  type!: FileType

  @Field()
  locale!: string

  @Field()
  displayName!: string

  @Field()
  fileName!: string

  @Field({ nullable: true })
  downloadServiceURL?: string
}
