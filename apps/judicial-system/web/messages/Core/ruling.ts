export const ruling = {
  label: 'Niðurstaða',
  placeholder: 'Hver er niðurstaðan að mati dómara?',
  autofill: '{judgeName} héraðsdómari kveður upp úrskurð þennan.',
  sections: {
    courtCaseFacts: {
      prefill: 'Í greinargerð sóknaraðila er atvikum lýst svo: {caseFacts}',
    },
    courtLegalArguments: {
      prefill:
        'Í greinargerð er krafa sóknaraðila rökstudd þannig: {legalArguments}',
    },
  },
  investigationCases: {
    sections: {
      decision: {
        acceptLabel: 'Krafa samþykkt',
        rejectLabel: 'Kröfu hafnað',
        partiallyAcceptLabel: 'Krafa tekin til greina að hluta',
        dismissLabel: 'Kröfu vísað frá',
      },
    },
  },

  restrictionCases: {
    sections: {
      decision: {
        caseType:
          '{caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} other {gæsluvarðhald}}',
        acceptLabel: 'Krafa um {caseType} samþykkt',
        partiallyAcceptLabel: 'Krafa um {caseType} tekin til greina að hluta',
        rejectLabel: 'Kröfu um {caseType} hafnað',
        dismissLabel: 'Kröfu um {caseType} vísað frá',
        acceptingAlternativeTravelBanLabel:
          'Kröfu um {caseType} hafnað en úrskurðað í farbann',
      },
    },
  },
}
