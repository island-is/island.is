import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IWizardAnswer } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class WizardAnswer {
  @Field(() => ID)
  id!: string

  @Field()
  slug!: string

  @Field()
  name!: string

  @Field(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>
}

export const mapWizardAnswers = ({
  sys,
  fields,
}: IWizardAnswer): WizardAnswer => ({
  id: sys.id,
  slug: fields.slug ?? '',
  name: fields.name ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
})
