// Sækja álagningarár.   til að nota í Síu.
export type FinanceAssessmentYears = {
  ResultYears: {
    year: string[]
  }
}

// Sækja gjaldflokka sem eru á álagningarári (assementYear) fyrir síu.
export type FinanceChargeTypesByYear = {
  resultChargeTypesYear: {
    chargeType: [
      {
        ID: string // ID fyrir gjaldflokk
        name: string // heiti á gjaldflokki
      },
    ]
  }
}

// Sækja nánari upplýsingar um  gjaldflokka fyrir  kennitölu og álagningarár.
export type FinanceChargeTypeDetails = {
  resultChargeTypeDetails: {
    chargeType: [
      {
        ID: string // ID fyrir gjaldflokk
        name: string // heiti á gjaldflokki
        chargeItemSubjects: string // gjaldgrunnar , sækja hámark 4
        chargeItemSubjectDescription: string // skýring á gjaldgrunni
        lastMovementDate: string // síðast hreyfing
      },
    ]
  }
}

// Sækja gjaldgrunna og hreyfngartímabil fyrir  kennitölu , gjaldflokk og álagningarár.
export type FinanceChargeItemSubjectsByYear = {
  resultSubjectsByYearChargeType: {
    chargeItemSubjects: [
      {
        chargeItemSubject: string // gjaldgrunnur
        lastMoveDate: string // síðast hreyfing á gjaldgrunnu
        totalAmount: number // staða
        periods: [
          // lista af tímabilum
          {
            period: string // tímabil t.d. 202302
            description: string // skýring á tímabili.
            lastMoveDate: string // sðast hreyfing á tímabil.
            amount: number // staða á tímabili.
          },
        ]
      },
    ]
    more: true // meira  true/false
    nextKey: string // lykill til að sækja næsta skammt.   kalla aftur með  nextkey
  }
}

// Sækja hreyfingar fyrir kennitölu, gjaldflokk, álagningarár , gjaldgrunn  og  tímabil
export type FinanceRecordsByChargeTypePeriodSubject = {
  resultRecordsByChargeTypePeriodSubject: {
    message: string // skilaboð
    nextKey: string // lykill til að sækja næsta skammt.   kalla aftur með  nextkey
    more: boolean // meira
    records: [
      {
        createDate: string
        createTime: string
        valueDate: string
        performingOrganization: string
        collectingOrganization: string
        chargeType: string
        itemCode: string
        chargeItemSubject: string
        periodType: string
        period: string
        amount: number
        category: string
        subCategory: string
        actionCategory: string
        reference: string
        referenceToLevy: string
        accountReference: string
      },
    ]
  }
}
