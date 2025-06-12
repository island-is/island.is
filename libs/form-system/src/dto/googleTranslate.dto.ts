import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemGoogleTranslation')
export class GoogleTranslation {
  @Field()
  translation!: string
}
