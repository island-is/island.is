export const caseDates = {
  restrictionExpired:
    '{caseType, select, ADMISSION_TO_FACILITY {Vistun} TRAVEL_BAN {Farbanni} other {Gæslu}} lauk {date}',
  restrictionValidTo:
    '{caseType, select, ADMISSION_TO_FACILITY {Vistun} TRAVEL_BAN {Farbann} other {Gæsla}} til {date}',
  isolationValidTo: 'Einangrun til {date}',
}
