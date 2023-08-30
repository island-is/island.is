import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { FieldType } from '@island.is/university-gateway-types'
import type { ProgramExtraApplicationField as TProgramExtraApplicationField } from '@island.is/university-gateway-types'

registerEnumType(FieldType, { name: 'FieldType' })

@ObjectType()
export class ProgramExtraApplicationField
  implements TProgramExtraApplicationField
{
  @Field(() => ID)
  readonly id!: string

  @Field()
  programId!: string

  @Field()
  nameIs!: string

  @Field()
  nameEn!: string

  @Field()
  descriptionIs!: string

  @Field()
  descriptionEn!: string

  @Field()
  required!: boolean

  @Field(() => FieldType)
  fieldType!: FieldType

  @Field()
  uploadAcceptedFileType!: string

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
