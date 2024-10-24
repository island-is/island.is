export const UPDATE_ELECTION_ACTION = 'updateCurrentElection'
export const ELECTIONLIMIT = 550000

export const INDIVIDUALOPERATIONIDS = {
  incomePrefix: 'individualIncome',
  expensePrefix: 'individualExpense',
  contributionsByLegalEntities: 'individualIncome.contributionsByLegalEntities',
  individualContributions: 'individualIncome.individualContributions',
  candidatesOwnContributions: 'individualIncome.candidatesOwnContributions',
  otherIncome: 'individualIncome.otherIncome',
  capitalIncome: 'individualIncome.capitalIncome',
  electionOffice: 'individualExpense.electionOffice',
  advertisements: 'individualExpense.advertisements',
  travelCost: 'individualExpense.travelCost',
  otherCost: 'individualExpense.otherCost',
  capitalCost: 'individualExpense.capitalCost',
  totalIncome: 'individualIncome.total',
  totalExpense: 'individualExpense.total',
}
