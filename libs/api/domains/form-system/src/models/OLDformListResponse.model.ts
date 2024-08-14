import { Field, ObjectType } from '@nestjs/graphql'
import { Form } from './OLDform.model'

@ObjectType('FormSystemFormListResponse')
export class FormListResponse {
  @Field(() => [Form], { nullable: 'itemsAndList' })
  forms?: Form[] | null
}
