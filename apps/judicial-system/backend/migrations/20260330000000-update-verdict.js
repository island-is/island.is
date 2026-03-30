'use strict'

const caseUpdates = [
  {
    caseId: 'eb296329-b079-4193-b80b-7dac1c1f1444',
    externalPoliceDocumentId: '39f39e33-77cc-440d-b055-9a1aec0ac1a7',
  },
  {
    caseId: 'c60c7ab5-f631-437f-bf8c-0af4016881e0',
    externalPoliceDocumentId: 'e20690ef-19de-4e98-9972-fa2c436b8949',
  },
  {
    caseId: 'a40cfbbb-737a-443e-b19c-824d203510c9',
    externalPoliceDocumentId: '03f42c6b-c70c-4175-b4b7-5e93651ecaf2',
  },
  {
    caseId: '9cfbf465-f715-4f82-aa00-2fb2288906c2',
    externalPoliceDocumentId: 'daa30327-f5e9-4fbe-8700-176b7d1a85cd',
  },
  {
    caseId: '3c5b0702-163a-4233-9db6-68991f828270',
    externalPoliceDocumentId: '915b1a48-ba33-465a-a5df-4e33468117a0',
  },
]

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all(
        caseUpdates.map(({ caseId, externalPoliceDocumentId }) =>
          queryInterface.sequelize.query(
            `UPDATE verdict
             SET external_police_document_id = :externalPoliceDocumentId
             WHERE id = (
               SELECT id FROM verdict
               WHERE case_id = :caseId
               ORDER BY created DESC
               LIMIT 1
             )`,
            {
              replacements: { caseId, externalPoliceDocumentId },
              transaction,
            },
          ),
        ),
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all(
        caseUpdates.map(({ caseId, externalPoliceDocumentId }) =>
          queryInterface.sequelize.query(
            `UPDATE verdict
             SET external_police_document_id = NULL
             WHERE case_id = :caseId
             AND external_police_document_id = :externalPoliceDocumentId`,
            {
              replacements: { caseId, externalPoliceDocumentId },
              transaction,
            },
          ),
        ),
      ),
    )
  },
}
