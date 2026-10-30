export const strings = {
  investigationCaseRejectedTitle: 'Kröfu um rannsóknarheimild hafnað',
  restrictionCaseRejectedTitle: 'Kröfu hafnað',
  caseDismissedTitle: 'Kröfu vísað frá',
  investigationCaseAcceptedTitle: 'Krafa um rannsóknarheimild samþykkt',
  restrictionCaseActiveTitle:
    '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun virk} TRAVEL_BAN {Farbann virkt} other {Gæsluvarðhald virkt}}',
  restrictionCaseExpiredTitle:
    '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbanni} other {Gæsluvarðhaldi}} lokið',
  investigationCaseInProgressTitle:
    'Krafa um {isExtended, select, true {framlengingu á } other {}}rannsóknarheimild',
  restrictionCaseInProgressTitle:
    'Krafa um {caseType, select, ADMISSION_TO_FACILITY {{isExtended, select, true {framlengingu á } other {}}vistun á viðeigandi stofnun} TRAVEL_BAN {{isExtended, select, true {framlengingu á farbanni} other {farbann}}} other {{isExtended, select, true {framlengingu á gæsluvarðhaldi} other {gæsluvarðhald}}}}',
}
