// The sessions the court of appeals calls in a verdict appeal. Its own list
// rather than the district court's CourtSessionType: the court of appeals holds
// three kinds of session and names the last one differently (dómsuppkvaðning,
// not dómsuppsaga).
export enum AppealCourtSessionType {
  MAIN_HEARING = 'MAIN_HEARING',
  PREPARATORY_HEARING = 'PREPARATORY_HEARING',
  VERDICT = 'VERDICT',
}

// A plain object rather than a Record over the enum, like courtSessionTypeNames,
// so the web can index it with its generated GraphQL enum as well.
export const appealCourtSessionTypeNames = {
  MAIN_HEARING: 'Aðalmeðferð',
  PREPARATORY_HEARING: 'Undirbúningsþinghald',
  VERDICT: 'Dómsuppkvaðning',
}
