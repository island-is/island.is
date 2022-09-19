import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

/*
200 Framlög úr ríkissjóði
201 Þingflokksstyrkur
202 Framlög sveitarfélaga
203 Framlög lögaðila
204 Framlög einstaklinga
205 Almenn félagsgjöld
228 Fjármagnstekjur
229 Aðrar tekjur
230 Rekstur skrifstofu
239 Annar rekstrarkostnaður
248 Fjármagnsgjöld
250 Fastafjármunirsamtals
260 Veltufjármunir samtals
270 Langtímaskuldir samtals
280 Skammtímaskuldir samtals
290 Eigið fé alls
*/

@InputType()
export class InaoPoliticalPartyFinancialStatementValuesInput {
  @Field(() => Number, { description: '200 Framlög úr ríkissjóði' })
  @IsNumber()
  contributionsFromTheTreasury!: number

  @Field(() => Number, { description: '201 Þingflokksstyrkur' })
  @IsNumber()
  parliamentaryPartySupport!: number

  @Field(() => Number, { description: '202 Framlög sveitarfélaga' })
  @IsNumber()
  municipalContributions!: number

  @Field(() => Number, { description: '203 Framlög lögaðila' })
  @IsNumber()
  contributionsFromLegalEntities!: number

  @Field(() => Number, { description: '204 Framlög einstaklinga' })
  @IsNumber()
  contributionsFromIndividuals!: number

  @Field(() => Number, { description: '205 Almenn félagsgjöld' })
  @IsNumber()
  generalMembershipFees!: number

  @Field(() => Number, { description: '228 Fjármagnstekjur' })
  @IsNumber()
  capitalIncome!: number

  @Field(() => Number, { description: '229 Aðrar tekjur' })
  @IsNumber()
  otherIncome!: number

  @Field(() => Number, { description: '230 Rekstur skrifstofu' })
  @IsNumber()
  officeOperations!: number

  @Field(() => Number, { description: '239 Annar rekstrarkostnaður' })
  @IsNumber()
  otherOperatingExpenses!: number

  @Field(() => Number, { description: '248 Fjármagnsgjöld' })
  @IsNumber()
  financialExpenses!: number

  @Field(() => Number, { description: '250 Fastafjármunirsamtals' })
  @IsNumber()
  fixedAssetsTotal!: number

  @Field(() => Number, { description: '260 Veltufjármunir samtals' })
  @IsNumber()
  currentAssets!: number

  @Field(() => Number, { description: '270 Langtímaskuldir samtals' })
  @IsNumber()
  longTermLiabilitiesTotal!: number

  @Field(() => Number, { description: '280 Skammtímaskuldir samtals' })
  @IsNumber()
  shortTermLiabilitiesTotal!: number

  @Field(() => Number, { description: '290 Eigið fé alls' })
  @IsNumber()
  equityTotal!: number
}
