export const queryPaymentScheduleDebts = `
  query PaymentScheduleDebts {
    paymentScheduleDebts {
      nationalId
      type
      paymentSchedule
      organization
      explanation
      totalAmount
      chargetypes {
        id
        name
        principal
        intrest
        expenses
        total
      }
    }
  }		
`

export const queryPaymentScheduleConditions = `
  query PaymentScheduleConditions {
      paymentScheduleConditions {
        nationalId
        maxDebtAmount
        maxDebtAmount
        totalDebtAmount
        minPayment
        maxPayment
        collectionActions
        doNotOwe
        maxDebt
        oweTaxes
        disposableIncome
        taxReturns
        vatReturns
        citReturns
        accommodationTaxReturns
        withholdingTaxReturns
        wageReturns
        alimony
        percent
        minWagePayment
    }
  }
`

export const queryPaymentScheduleEmployer = `
  query PaymentScheduleEmployer {
    paymentScheduleEmployer {
      nationalId    
      name
    }
  }
`

export const queryPaymentScheduleInitialSchedule = `
  query PaymentScheduleInitialSchedule($input: GetInitialScheduleInput!) {
    paymentScheduleInitialSchedule (input : $input){
      nationalId
      scheduleType
      minPayment
      maxPayment
      minCountMonth
      maxCountMonth
    }
  }
`
