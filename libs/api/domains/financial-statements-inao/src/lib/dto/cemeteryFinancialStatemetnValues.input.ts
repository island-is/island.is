import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

/*
300 Umhirðutekjur
301 Grafartekjur
302 Styrkur frá kirkjugarðasjóði
328 Fjármagnstekjur
329 Aðrar tekjur
330 Laun og launatengd gjöld
331 Útfararkostnaður
332 Rekstur útfararkapellu
334 Framlög til kirkjugarðasjóðs
335 Framlög og styrkir til annarra
339 Annar rekstrarkostnaður
348 Fjármagnsgjöld
349 Afskriftir
350 Fastafjármunirsamtals
360 Veltufjármunir samtals
370 Langtímaskuldir samtals
380 Skammtímaskuldir samtals
390  Eigið fé alls (Calculated)
391 Eigið fé 1. janúar
392 Endurmat vegna verðbreytinga
393 Endurmat, annað
394 Rekstrarafkoma (Calculated)
*/

@InputType()
export class InaoCemeteryFinancialStatementValuesInput {
  @Field(() => Number, { description: '300 Umhirðutekjur' })
  @IsNumber()
  careIncome!: number

  @Field(() => Number, { description: '301 Grafartekjur' })
  @IsNumber()
  burialRevenue!: number

  @Field(() => Number, { description: '302 Styrkur frá kirkjugarðasjóði' })
  @IsNumber()
  grantFromTheCemeteryFund!: number

  @Field(() => Number, { description: '328 Fjármagnstekjur' })
  @IsNumber()
  capitalIncome!: number

  @Field(() => Number, { description: '329 Aðrar tekjur' })
  @IsNumber()
  otherIncome!: number

  @Field(() => Number, { description: '330 Laun og launatengd gjöld' })
  @IsNumber()
  salaryAndSalaryRelatedExpenses!: number

  @Field(() => Number, { description: '331 Útfararkostnaður' })
  @IsNumber()
  funeralExpenses!: number

  @Field(() => Number, { description: '332 Rekstur útfararkapellu' })
  @IsNumber()
  operationOfAFuneralChapel!: number

  @Field(() => Number, { description: '334 Framlög til kirkjugarðasjóðs' })
  @IsNumber()
  donationsToCemeteryFund!: number

  @Field(() => Number, { description: '335 Framlög og styrkir til annarra' })
  @IsNumber()
  contributionsAndGrantsToOthers!: number

  @Field(() => Number, { description: '339 Annar rekstrarkostnaður' })
  @IsNumber()
  otherOperatingExpenses!: number

  @Field(() => Number, { description: '348 Fjármagnsgjöld' })
  @IsNumber()
  financialExpenses!: number

  @Field(() => Number, { description: '349 Afskriftir' })
  @IsNumber()
  depreciation!: number

  @Field(() => Number, { description: '350 Fastafjármunirsamtals' })
  @IsNumber()
  fixedAssetsTotal!: number

  @Field(() => Number, { description: '360 Veltufjármunir samtals' })
  @IsNumber()
  currentAssets!: number

  @Field(() => Number, { description: '370 Langtímaskuldir samtals' })
  @IsNumber()
  longTermLiabilitiesTotal!: number

  @Field(() => Number, { description: '380 Skammtímaskuldir samtals' })
  @IsNumber()
  shortTermLiabilitiesTotal!: number

  @Field(() => Number, { description: '391 Eigið fé 1. janúar' })
  @IsNumber()
  equityAtTheBeginningOfTheYear!: number

  @Field(() => Number, { description: '392 Endurmat vegna verðbreytinga' })
  @IsNumber()
  revaluationDueToPriceChanges!: number

  @Field(() => Number, { description: '393 Endurmat, annað' })
  @IsNumber()
  reassessmentOther!: number
}
