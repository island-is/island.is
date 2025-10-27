import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemStoreFileDtoInput')
export class StoreFileDtoInput {
  @Field(() => String)
  fieldId!: string

  @Field(() => String)
  sourceKey!: string
}

@InputType('FormSystemStoreFileInput')
export class StoreFileInput {
  @Field(() => StoreFileDtoInput)
  storeFileDto!: StoreFileDtoInput
}
