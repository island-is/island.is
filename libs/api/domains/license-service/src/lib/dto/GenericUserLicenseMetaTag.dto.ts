import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenericUserLicenseMetaTag {
  @Field()
  text!: string

  @Field({ nullable: true })
  color?: string

  @Field({ nullable: true })
  icon?: string

  @Field({ nullable: true })
  iconColor?: string

  @Field({
    nullable: true,
    description:
      'Defaults to the text property if icon defined but iconText left undefined',
  })
  iconText?: string
}
