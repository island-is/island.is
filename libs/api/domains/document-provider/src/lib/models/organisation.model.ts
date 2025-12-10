import { Field, ObjectType } from '@nestjs/graphql'
import { Contact } from './contact.model'
import { Helpdesk } from './helpdesk.model'
import { Provider } from './provider.model'

@ObjectType()
export class Organisation {
  @Field(() => String)
  id!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  address?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  phoneNumber?: string

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

  @Field(() => [Provider], { nullable: true })
  providers?: Provider[]

  @Field({ nullable: true })
  zendeskId?: string
}
