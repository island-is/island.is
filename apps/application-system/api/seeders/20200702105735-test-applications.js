'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'application',
      [
        {
          id: 'f00df00d-f00d-400d-a00d-f00df00df00d',
          applicant: '2605923199',
          state: 'collectEndorsements',
          type_id: 'PartyApplication',
          answers: JSON.stringify({
            constituency: 'partyApplicationNordausturkjordaemi2021',
            approveDisclaimer: true
          }),
          status: 'inprogress',
          external_data: JSON.stringify({
            nationalRegistry: {
              data: {}, 
              date: "2021-08-27T14:04:57.959Z", 
              status: "success"
            }, 
            partyLetterRegistry: {
              data: {
                partyName: "Steini stuð", 
                partyLetter: "S"
              }, 
              date: "2021-08-27T14:04:58.617Z", 
              status: "success"
            }, 
            createEndorsementList: {
              data: {id: "f00df00d-f00d-400d-a00d-f00df00df00d"}, 
              date: "2021-08-27T14:05:00.820Z", 
              status: "success"
            }
          })
        },
        {
          id: 'f00df00d-f00d-400d-a00d-f00df00da00d',
          applicant: '2605923199',
          state: 'collectEndorsements',
          type_id: 'PartyApplication',
          answers: JSON.stringify({
            constituency: 'partyApplicationNordausturkjordaemi2021',
            approveDisclaimer: true
          }),
          status: 'inprogress',
          external_data: JSON.stringify({
            nationalRegistry: {
              data: {}, 
              date: "2021-08-27T14:04:57.959Z", 
              status: "success"
            }, 
            partyLetterRegistry: {
              data: {
                partyName: "Steini stuð", 
                partyLetter: "S"
              }, 
              date: "2021-08-27T14:04:58.617Z", 
              status: "success"
            }, 
            createEndorsementList: {
              data: {id: "f00df00d-f00d-400d-a00d-f00df00db00d"}, 
              date: "2021-08-27T14:05:00.820Z", 
              status: "success"
            }
          })
        },
        {
          id: 'f00df00d-f00d-400d-a00d-f00df00db00d',
          applicant: '2605923199',
          state: 'collectEndorsements',
          type_id: 'PartyApplication',
          answers: JSON.stringify({
            constituency: 'partyApplicationNordausturkjordaemi2021',
            approveDisclaimer: true
          }),
          status: 'inprogress',
          external_data: JSON.stringify({
            nationalRegistry: {
              data: {}, 
              date: "2021-08-27T14:04:57.959Z", 
              status: "success"
            }, 
            partyLetterRegistry: {
              data: {
                partyName: "Steini stuð", 
                partyLetter: "S"
              }, 
              date: "2021-08-27T14:04:58.617Z", 
              status: "success"
            }, 
            createEndorsementList: {
              data: {id: "f00df00d-f00d-400d-a00d-f00df00db00d"}, 
              date: "2021-08-27T14:05:00.820Z", 
              status: "success"
            }
          })
        },
        {
          id: 'f00df00d-f00d-400d-a00d-c00df00db00d',
          applicant: '2205923199',
          state: 'collectEndorsements',
          type_id: 'PartyApplication',
          answers: JSON.stringify({
            constituency: 'partyApplicationNordausturkjordaemi2021',
            approveDisclaimer: true
          }),
          status: 'inprogress',
          external_data: JSON.stringify({
            nationalRegistry: {
              data: {}, 
              date: "2021-08-27T14:04:57.959Z", 
              status: "success"
            }, 
            partyLetterRegistry: {
              data: {
                partyName: "Steini stuð", 
                partyLetter: "S"
              }, 
              date: "2021-08-27T14:04:58.617Z", 
              status: "success"
            }, 
            createEndorsementList: {
              data: {id: "f00df00d-f00d-400d-a00d-c00df00db00d"}, 
              date: "2021-08-27T14:05:00.820Z", 
              status: "success"
            }
          })
        },
        {
          id: 'f00df00d-f00d-400d-a00d-b00df00db00d',
          applicant: '2505923199',
          state: 'collectEndorsements',
          type_id: 'PartyApplication',
          answers: JSON.stringify({
            constituency: 'partyApplicationNordausturkjordaemi2021',
            approveDisclaimer: true
          }),
          status: 'inprogress',
          external_data: JSON.stringify({
            nationalRegistry: {
              data: {}, 
              date: "2021-08-27T14:04:57.959Z", 
              status: "success"
            }, 
            partyLetterRegistry: {
              data: {
                partyName: "Steini stuð", 
                partyLetter: "S"
              }, 
              date: "2021-08-27T14:04:58.617Z", 
              status: "success"
            }, 
            createEndorsementList: {
              data: {id: "f00df00d-f00d-400d-a00d-b00df00db00d"}, 
              date: "2021-08-27T14:05:00.820Z", 
              status: "success"
            }
          })
        },
        {
          id: 'f00df00d-f00d-400d-a00d-a00df00db00d',
          applicant: '2505923199',
          state: 'collectEndorsements',
          type_id: 'PartyApplication',
          answers: JSON.stringify({
            constituency: 'partyApplicationNordausturkjordaemi2021',
            approveDisclaimer: true
          }),
          status: 'inprogress',
          external_data: JSON.stringify({
            nationalRegistry: {
              data: {}, 
              date: "2021-08-27T14:04:57.959Z", 
              status: "success"
            }, 
            partyLetterRegistry: {
              data: {
                partyName: "Steini stuð", 
                partyLetter: "S"
              }, 
              date: "2021-08-27T14:04:58.617Z", 
              status: "success"
            }, 
            createEndorsementList: {
              data: {id: "f00df00d-f00d-400d-a00d-a00df00db00d"}, 
              date: "2021-08-27T14:05:00.820Z", 
              status: "success"
            }
          })
        },
      ],
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('application', null, {})
  },
}
