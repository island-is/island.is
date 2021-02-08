import { Field, ObjectType } from '@nestjs/graphql'
import { Contact } from './contact.model'
import { Helpdesk } from './helpdesk.model'

@ObjectType()
export class Organisation {
  @Field(() => String)
  id!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  address!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  phoneNumber!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => Contact, { nullable: true })
  administrativeContact?: Contact

  @Field(() => Contact, { nullable: true })
  technicalContact?: Contact

  @Field(() => Helpdesk, { nullable: true })
  helpdesk?: Helpdesk
}
