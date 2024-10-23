'use strict'
//  DRAFT
// module.exports = {
//   up: (queryInterface) => {
//     return queryInterface.sequelize.transaction((transaction) =>
//       queryInterface.sequelize.query(
//         `UPDATE "case" SET state = 'DELETED'
//         WHERE type = 'INDICTMENT'
//         AND created < '2024-10-27 23:59:00.000+00'`,
//         { transaction },
//       ),
//     )
//   },

//   down: () => {
//     return Promise.resolve()
//   },
// }
