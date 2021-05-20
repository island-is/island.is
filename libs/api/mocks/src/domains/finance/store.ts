import { createStore } from '@island.is/shared/mocking'

export const store = createStore(() => {
  const financeStatus = {
    organizations: [
      {
        id: 'RIKI',
        name: 'Skatturinn',
        type: 'R',
        phone: '4421000',
        'e-mail': 'skatturinn@skatturinn.is',
        homepage: 'www.skatturinn.is',
        principalTotals: 0,
        interestTotals: 0,
        costTotals: 0,
        statusTotals: 0,
        dueStatusTotals: 0,
        chargeTypes: [
          {
            id: 'AX',
            name: 'Þing- og sveitarsjóðsgjöld',
            principal: 0,
            interest: 0,
            cost: 0,
            totals: 66,
            dueTotals: 0,
          },
        ],
      },
    ],
    timestamp: '123456',
    principalTotals: 1,
    interestTotals: 2,
    costTotals: 3,
    statusTotals: 4,
  }

  const financeStatusDetails = {
    timestamp: '12345',
    chargeItemSubjects: [
      {
        chargeItemSubject: '2704685439',
        timePeriod: '201908',
        estimate: false,
        dueDate: '01.08.2019',
        finalDueDate: '30.08.2019',
        principal: 5833,
        interest: 818,
        cost: 0,
        paid: -2910,
        totals: 3741,
        dueTotals: 3741,
        documentID: '',
        payID: '',
      },
    ],
  }

  return { financeStatus, financeStatusDetails }
})
