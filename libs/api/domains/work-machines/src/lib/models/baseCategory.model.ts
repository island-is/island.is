import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType('WorkMachinesBaseCategory')
export abstract class BaseCategory {
  @Field()
  name!: string

  @Field({
    nullable: true,
    deprecationReason: 'Use localized name instead',
  })
  nameEn?: string

  @Field({ nullable: true })
  registrationNumberPrefix?: string
}
