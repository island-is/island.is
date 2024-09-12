export enum Status {
  PARENTAL_LEAVE = 'parentalLeave',
  STUDENT = 'student',
  OUTSIDE_WORKFORCE = 'outsideWorkForce',
}

export enum WorkPercentage {
  OPTION_1 = 'option1',
  OPTION_2 = 'option2',
}

export type Union = {
  label: string
  percentage: number
  fixedCost: number
}

type Constants = {
  /* Hlutfall fæðingarorlofs (fasti) */
  percentOfEarningsPaid: number

  /* Persónuafsláttur */
  taxDiscount: number

  /* Skattprósentur */
  tax1: number
  tax2: number
  tax3: number

  /* Skattmörk */
  tax1Amount: number
  tax2Amount: number

  /* Fæðingarstyrkur námsmanna */
  pGrantStudents: number

  /* Fæðingarstyrkur almennur */
  pGrant: number

  /* Fæðingarstyrkur hærri */
  pGrantHigher: number

  /* Fæðingarstyrkur lægri */
  pGrantLower: number

  /* Hámarks laun fyrir fæðingarorlof */
  maxEarnings: number

  /* Skyldu lífeyrir */
  mandatoryPensionPercentage: number
}

type Input = {
  status: Status

  /* Fæðingarár barns */
  childYearBorn: number

  /* Starfshlutfall á innlendum vinnumarkaði í 6 mánuði fyrir áætlaðan fæðingardag */
  workPercentage: WorkPercentage

  /* Meðaltekjur innanlands á mánuði */
  averageEarningsPerMonth: number

  /* Fjöldi mánaða í fæðingarorlofi */
  monthsInPL: number

  /* Stéttarfélag */
  union: Union | undefined

  /* Persónuafsláttur */
  taxDiscountRate: number

  /* Viðbótar lifeyrissjóður */
  extraPension: number

  /* Hlutfall fæðingarorlofs */
  plRate: number
}

export class Calculator {
  private constants: Constants
  private input: Input

  constructor(constants: Constants, input: Input) {
    this.constants = constants
    this.input = input
  }

  private calculateTax(amount: number) {
    const intAmount = amount
    let taxAmount = 0.0

    // Fyrsta skattþrep
    if (intAmount <= this.constants.tax1Amount) {
      taxAmount = intAmount * (this.constants.tax1 / 100)
    }
    // Annað skattþrep
    else if (intAmount <= this.constants.tax2Amount) {
      taxAmount = this.constants.tax1Amount * (this.constants.tax1 / 100)
      taxAmount +=
        (intAmount - this.constants.tax1Amount) * (this.constants.tax2 / 100)
    }
    // Þriðja skattþrep
    else {
      taxAmount = this.constants.tax1Amount * (this.constants.tax1 / 100)
      taxAmount +=
        (this.constants.tax2Amount - this.constants.tax1Amount) *
        (this.constants.tax2 / 100)
      taxAmount +=
        (intAmount - this.constants.tax2Amount) * (this.constants.tax3 / 100)
    }

    return Math.round(taxAmount)
  }

  public calculateResults() {
    const myAverage =
      (this.input.averageEarningsPerMonth *
        this.constants.percentOfEarningsPaid) /
      100

    const earningsPerMonth = Math.min(myAverage, this.constants.maxEarnings)
    let plBruttoPerMonth = earningsPerMonth

    let fullAmount = 0
    let pensionPerMonth = 0
    let extraPensionPerMonth = 0
    let unionFees = 0

    if (this.input.status === Status.STUDENT) {
      plBruttoPerMonth = this.constants.pGrantStudents
      fullAmount = plBruttoPerMonth
    }

    if (this.input.status === Status.OUTSIDE_WORKFORCE) {
      plBruttoPerMonth = this.constants.pGrant
      fullAmount = plBruttoPerMonth
    }

    if (this.input.status === Status.PARENTAL_LEAVE) {
      plBruttoPerMonth = Math.max(
        this.input.workPercentage === WorkPercentage.OPTION_1
          ? this.constants.pGrantLower
          : this.constants.pGrantHigher,
        earningsPerMonth,
      )

      fullAmount = plBruttoPerMonth

      plBruttoPerMonth = (plBruttoPerMonth * this.input.plRate) / 100

      if (this.input.monthsInPL < 1) {
        plBruttoPerMonth *= this.input.monthsInPL
      }

      pensionPerMonth =
        (plBruttoPerMonth * this.constants.mandatoryPensionPercentage) / 100
      extraPensionPerMonth = (plBruttoPerMonth * this.input.extraPension) / 100

      if (this.input.union) {
        unionFees =
          this.input.union.fixedCost > 0
            ? Math.round(this.input.union.fixedCost)
            : Math.round(plBruttoPerMonth * (this.input.union.percentage / 100))
      }
    }

    const tax = this.calculateTax(
      plBruttoPerMonth - pensionPerMonth - extraPensionPerMonth,
    )

    let taxDiscount =
      this.constants.taxDiscount * (this.input.taxDiscountRate / 100)

    if (tax <= taxDiscount) {
      taxDiscount = tax
    }

    const plNettoPerMonth =
      plBruttoPerMonth -
      pensionPerMonth -
      extraPensionPerMonth -
      unionFees -
      tax +
      taxDiscount

    return {
      plBruttoPerMonth,
      plNettoPerMonth,
      unionFees,
      pensionPerMonth,
      extraPensionPerMonth,
      tax,
      taxDiscount,
      fullAmount,
    }
  }
}
