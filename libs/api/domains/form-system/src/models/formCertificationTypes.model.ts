import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemFormCertificationType')
export class FormCertificationType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  certificationTypeId?: string
}
