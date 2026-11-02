export const restrictionLength = {
  caseType:
    '{caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbann} other {gæsluvarðhald}}',
  title: 'Einangrun',
  isolation: 'Varnaraðili skal sæta einangrun',
  isolationDateLable: 'Einangrun til',
  validToDateLabel: '{caseType} til',
}
