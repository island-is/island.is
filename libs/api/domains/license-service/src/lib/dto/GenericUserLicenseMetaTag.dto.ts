import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

@ObjectType()
export class GenericUserLicenseMetaTag {
  @Field()
  text!: string

  @Field({ nullable: true })
  icon?: string

  @Field({ nullable: true })
  iconColor?: string
}
