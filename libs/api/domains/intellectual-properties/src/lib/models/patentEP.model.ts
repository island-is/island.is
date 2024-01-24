import { ObjectType, Field } from '@nestjs/graphql'
import { PatentIS } from './patentIS.model'
import { EPApplicationLifecycle } from './epApplicationLifcycle'
import { Patent } from './patent.model'
import { IntellectualProperty } from './intellectualProperty.model'

@ObjectType('IntellectualPropertiesPatentEP', {
  implements: () => [Patent],
})
export class PatentEP extends PatentIS implements Patent {
  @Field()
  epApplicationNumber!: string

  @Field({ nullable: true })
  nameInIcelandic?: string

  @Field(() => EPApplicationLifecycle, { nullable: true })
  epLifecycle?: EPApplicationLifecycle

  @Field({ nullable: true })
  epoStatus?: string

  @Field({ nullable: true })
  classificationType?: string

  @Field({ nullable: true })
  language?: string
}
