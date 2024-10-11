import { Field, ObjectType } from '@nestjs/graphql'
import { Form } from './form.model'

@ObjectType('FormSystemFormListResponse')
export class FormListResponse {
  @Field(() => [Form], { nullable: 'itemsAndList' })
  forms?: Form[] | null
}
