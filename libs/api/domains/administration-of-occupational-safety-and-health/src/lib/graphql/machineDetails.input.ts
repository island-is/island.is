// aosah.graphql
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql'

@ObjectType()
export class MachineDetailsDto {
  // @Field()
  //   id!: string;

  // @Field()
  // registrationNumber?: string | null | undefined;

  // @Field()
  // type?: string | null | undefined;

  // @Field()
  // status?: string | null | undefined;

  // @Field()
  // category?: string | null | undefined;

  // @Field()
  // subCategory?: string | null | undefined;

  // @Field()
  // productionYear?: number | null | undefined;

  // @Field()
  // registrationDate?: string | null | undefined;

  // @Field()
  // ownerNumber?: string | null | undefined;

  // @Field()
  // productionNumber?: string | null | undefined;

  // @Field()
  // productionCountry?: string | null | undefined;
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  registrationNumber?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  category?: string | null

  @Field(() => String, { nullable: true })
  subCategory?: string | null

  @Field(() => Number, { nullable: true })
  productionYear?: number | null

  @Field(() => String, { nullable: true })
  registrationDate?: string | null

  @Field(() => String, { nullable: true })
  ownerNumber?: string | null

  @Field(() => String, { nullable: true })
  productionNumber?: string | null

  @Field(() => String, { nullable: true })
  productionCountry?: string | null

  // Define other fields as needed
}

@InputType()
export class MachineDetailsInput {
  @Field()
  id!: string
}
