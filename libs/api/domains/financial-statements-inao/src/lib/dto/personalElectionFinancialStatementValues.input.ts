import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

/*
100 Framlög lögaðila
101 Framlög einstaklinga
102 Eigin framlög frambjóðanda
128 Fjármagnstekjur
129 Aðrar tekjur
130 Kosningaskrifstofa
131 Auglýsingar og kynningar
132 Fundir og ferðakostnaður
139 Annar kostnaður
148 Fjármagnsgjöld
150 Fastafjármunirsamtals
160 Veltufjármunir samtals
170 Langtímaskuldirsamtals
180 Skammtímaskuldir samtals
190 Eigið fé alls
*/

@InputType()
export class InaoPersonalElectionFinancialStatementValuesInput {
  @Field(() => Number, { description: '100 Framlög lögaðila' })
  @IsNumber()
  contributionsByLegalEntities!: number

  @Field(() => Number, { description: '101 Framlög einstaklinga' })
  @IsNumber()
  individualContributions!: number

  @Field(() => Number, { description: '102 Eigin framlög frambjóðanda' })
  @IsNumber()
  candidatesOwnContributions!: number

  @Field(() => Number, { description: '128 Fjármagnstekjur' })
  @IsNumber()
  capitalIncome!: number

  @Field(() => Number, { description: '129 Aðrar tekjur' })
  @IsNumber()
  otherIncome!: number

  @Field(() => Number, { description: '130 Kosningaskrifstofa' })
  @IsNumber()
  electionOfficeExpenses!: number

  @Field(() => Number, { description: '131 Auglýsingar og kynningar' })
  @IsNumber()
  advertisingAndPromotions!: number

  @Field(() => Number, { description: '132 Fundir og ferðakostnaður' })
  @IsNumber()
  meetingsAndTravelExpenses!: number

  @Field(() => Number, { description: '139 Annar kostnaður' })
  @IsNumber()
  otherExpenses!: number

  @Field(() => Number, { description: '148 Fjármagnsgjöld' })
  @IsNumber()
  financialExpenses!: number

  @Field(() => Number, { description: '150 Fastafjármunirsamtals' })
  @IsNumber()
  fixedAssetsTotal!: number

  @Field(() => Number, { description: '160 Veltufjármunir samtals' })
  @IsNumber()
  currentAssets!: number

  @Field(() => Number, { description: '170 Langtímaskuldirsamtals' })
  @IsNumber()
  longTermLiabilitiesTotal!: number

  @Field(() => Number, { description: '180 Skammtímaskuldir samtals' })
  @IsNumber()
  shortTermLiabilitiesTotal!: number

  @Field(() => Number, { description: '190 Eigið fé alls' })
  @IsNumber()
  equityTotal!: number
}
