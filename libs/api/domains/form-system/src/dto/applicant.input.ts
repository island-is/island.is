// import { Field, InputType } from '@nestjs/graphql'
// import { LanguageTypeInput } from './languageType.input'

// @InputType('FormSystemCreateApplicantDtoInput')
// export class FormSystemCreateApplicantDtoInput {
//   @Field(() => String, { nullable: true })
//   formId?: string

//   @Field(() => String, { nullable: true })
//   applicantTypeId?: string
// }

// @InputType('FormSystemUpdateApplicantDtoInput')
// export class FormSystemUpdateApplicantDtoInput {
//   @Field(() => LanguageTypeInput, { nullable: true })
//   name?: LanguageTypeInput
// }

// @InputType('FormSystemCreateApplicantInput')
// export class CreateApplicantInput {
//   @Field(() => FormSystemCreateApplicantDtoInput, { nullable: true })
//   createFormApplicantTypeDto?: FormSystemCreateApplicantDtoInput
// }

// @InputType('FormSystemDeleteApplicantInput')
// export class DeleteApplicantInput {
//   @Field(() => String, { nullable: true })
//   id?: string
// }

// @InputType('FormSystemUpdateApplicantInput')
// export class UpdateApplicantInput {
//   @Field(() => String, { nullable: true })
//   id?: string

//   @Field(() => FormSystemUpdateApplicantDtoInput, { nullable: true })
//   updateFormApplicantTypeDto?: FormSystemUpdateApplicantDtoInput
// }

// @InputType('FormSystemFormApplicantInput')
// export class FormApplicantInput {
//   @Field(() => String, { nullable: true })
//   id?: string

//   @Field(() => LanguageTypeInput, { nullable: true })
//   description?: LanguageTypeInput

//   @Field(() => String, { nullable: true })
//   applicantTypeId?: string

//   @Field(() => LanguageTypeInput, { nullable: true })
//   name?: LanguageTypeInput

//   @Field(() => [LanguageTypeInput], { nullable: true })
//   nameSuggestions?: LanguageTypeInput[]
// }
