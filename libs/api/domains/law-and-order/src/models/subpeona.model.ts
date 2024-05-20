import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SubpeonaTexts {
  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  confirmation?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  claim?: string
}

@ObjectType()
export class SubpeonaActions {
  @Field({ nullable: true })
  type?: 'file' | 'url' | 'inbox'

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  data?: string
}

@ObjectType()
export class SubpeonaItemActions {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  type?: string
}

@ObjectType()
export class SubpeonaItems {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  link?: string

  @Field({ nullable: true })
  action?: string
}

@ObjectType()
export class SubpeonaGroups {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  items?: SubpeonaItems
}

@ObjectType()
export class Subpeona {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field({ nullable: true })
  acknowledged?: boolean

  @Field({ nullable: true })
  displayClaim?: boolean

  @Field({ nullable: true })
  chosenDefender?: string

  @Field({ nullable: true })
  groups?: SubpeonaGroups[]
}

@ObjectType()
export class GetSubpeona {
  @Field({ nullable: true })
  texts?: SubpeonaTexts

  @Field({ nullable: true })
  actions?: SubpeonaActions

  @Field({ nullable: true })
  data?: Subpeona
}
