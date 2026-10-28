export const defenderInfo = {
  investigationCases: {
    sections: {
      defender: {
        heading: 'Verjandi varnaraðila',
        title: '{defenderType}',
        tooltip: 'Lögmaður sem er valinn hér verður skipaður {sessionArrangement, select, ALL_PRESENT_SPOKESPERSON {talsmaður} other {verjandi}} í þinghaldi og fær sendan úrskurð rafrænt.',
      },
      defenderRequestAccess: {
        title: 'Aðgangur verjanda að kröfu',
        labelCourtDate: 'Gefa verjanda aðgang að kröfu við úthlutun fyrirtökutíma',
        labelReadyForCourt: 'Gefa verjanda aðgang að kröfu þegar krafa er send á dómstól',
        labelNoAccess: 'Ekki gefa verjanda aðgang að kröfu',
        tooltip: 'Ef hakað er hér þá fær verjandi aðgang að kröfunni um rannsóknarheimild þegar fyrirtökutíma hefur verið úthlutað',
      },
    },
  },
  restrictionCases: {
    sections: {
      defender: {
        heading: 'Verjandi varnaraðila',
        title: 'Verjandi',
        tooltip: 'Lögmaður sem er valinn hér verður skipaður verjandi í þinghaldi og fær sendan úrskurð rafrænt.',
      },
      defenderRequestAccess: {
        title: 'Aðgangur verjanda að kröfu',
        labelCourtDate: 'Gefa verjanda aðgang að kröfu við úthlutun fyrirtökutíma',
        labelReadyForCourt: 'Gefa verjanda aðgang að kröfu þegar krafa er send á dómstól',
        labelNoAccess: 'Ekki gefa verjanda aðgang að kröfu',
        tooltip: 'Ef hakað er hér þá fær verjandi aðgang að {caseType, select, ADMISSION_TO_FACILITY {kröfunni um vistun á viðeigandi stofnun} TRAVEL_BAN {farbannskröfunni} other {gæsluvarðhaldskröfunni}} þegar fyrirtökutíma hefur verið úthlutað',
      },
    },
  },
}
