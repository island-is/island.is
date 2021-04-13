import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IWizard } from '../generated/contentfulTypes'
import { mapWizardAnswers, WizardAnswer } from './wizardAnswer.model'

@ObjectType()
export class Wizard {
  @Field(() => ID)
  id!: string

  @Field()
  configuration!: string

  @Field(() => [WizardAnswer], { nullable: true })
  answers!: WizardAnswer[] | null
}

export const mapWizard = ({ sys, fields }: IWizard): Wizard => ({
  id: sys.id,
  configuration: JSON.stringify(fields.configuration),
  answers: (fields.answers ?? []).map(mapWizardAnswers),
})
