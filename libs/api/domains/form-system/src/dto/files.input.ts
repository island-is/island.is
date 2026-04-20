import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemStoreFileDtoInput')
export class StoreFileDtoInput {
  @Field(() => String)
  fieldId!: string

  @Field(() => String)
  sourceKey!: string

  @Field(() => String)
  valueId!: string
}

@InputType('FormSystemStoreFileInput')
export class StoreFileInput {
  @Field(() => StoreFileDtoInput)
  storeFileDto!: StoreFileDtoInput
}

@InputType('FormSystemDeleteFileDtoInput')
export class DeleteFileDtoInput {
  @Field(() => String)
  key!: string

  @Field(() => String)
  valueId!: string
}

@InputType('FormSystemDeleteFileInput')
export class DeleteFileInput {
  @Field(() => DeleteFileDtoInput)
  deleteFileDto!: DeleteFileDtoInput
}
