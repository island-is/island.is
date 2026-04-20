'use strict'

const verdictUpdates = [
  {
    caseId: 'af89ac94-683d-40c6-bc75-b4d87c34b5f7',
    externalPoliceDocumentId: 'c7eee886-9275-4eff-b283-e2ec871976fa',
    serviceDate: '2026-04-07 21:51:58',
    serviceStatus: 'ELECTRONICALLY',
  },
  {
    caseId: 'f10923d5-3bee-4c47-bb86-965d334e357d',
    externalPoliceDocumentId: '2eb16579-ca88-4ccd-afaa-34af45cdb203',
    serviceDate: '2026-04-06 21:07:27',
    serviceStatus: 'ELECTRONICALLY',
  },
  {
    caseId: 'ab0c4372-c662-4e22-bf18-95a21e1ce03a',
    externalPoliceDocumentId: 'c3286794-b613-4090-99df-de8d072cedeb',
    serviceDate: '2026-04-09 19:35:38',
    serviceStatus: 'ELECTRONICALLY',
  },
]

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all(
        verdictUpdates.map(
          ({ caseId, externalPoliceDocumentId, serviceDate, serviceStatus }) =>
            queryInterface.sequelize.query(
              `UPDATE verdict
             SET external_police_document_id = :externalPoliceDocumentId,
                 service_date = :serviceDate,
                 service_status = :serviceStatus
             WHERE id = (
               SELECT id FROM verdict
               WHERE case_id = :caseId
               ORDER BY created DESC
               LIMIT 1
             )`,
              {
                replacements: {
                  caseId,
                  externalPoliceDocumentId,
                  serviceDate,
                  serviceStatus,
                },
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
        verdictUpdates.map(
          ({ caseId, externalPoliceDocumentId, serviceDate, serviceStatus }) =>
            queryInterface.sequelize.query(
              `UPDATE verdict
             SET external_police_document_id = NULL,
                 service_date = NULL,
                 service_status = NULL
             WHERE case_id = :caseId
             AND external_police_document_id = :externalPoliceDocumentId`,
              {
                replacements: {
                  caseId,
                  externalPoliceDocumentId,
                  serviceDate,
                  serviceStatus,
                },
                transaction,
              },
            ),
        ),
      ),
    )
  },
}
