import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CustomsGeneralInput {
  @Field(() => String)
  @IsString()
  dags!: string

  @Field(() => String)
  @IsString()
  kerfi!: string
}

@InputType()
export class CustomsGeneralUrvinnslugjoldInput {
  @Field(() => String)
  @IsString()
  dags!: string

  @Field(() => String)
  @IsString()
  tollskrarnumerFra!: string

  @Field(() => String)
  @IsString()
  tollskrarnumerTil!: string
}

@InputType()
export class CustomsGeneralAkvordunarInput {
  @Field(() => String)
  @IsString()
  landakodi!: string
}
