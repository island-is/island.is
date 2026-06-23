'use strict'

// Adds ON DELETE SET NULL to the case_file -> civil_claimant and
// case_file -> defendant foreign keys.
//
// Both civil_claimant_id and defendant_id were originally added (in
// 20241122091513-update-case-file.js) with no onDelete behavior, so Postgres
// defaulted to NO ACTION. Deleting a civil_claimant or defendant that is still
// referenced by a case_file row therefore failed with:
//   violates foreign key constraint "case_file_civil_claimant_id_fkey"
//   violates foreign key constraint "case_file_defendant_id_fkey"
// This happens when a claimant/defendant with an uploaded file (e.g. a
// CIVIL_CLAIM document, or a CRIMINAL_RECORD) is removed. case_file rows are
// soft-deleted, so they keep their foreign keys and keep blocking the delete.
//
// SET NULL keeps the case_file rows intact and just clears the dangling
// reference when the claimant/defendant is deleted.
module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           DROP CONSTRAINT case_file_civil_claimant_id_fkey`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           ADD CONSTRAINT case_file_civil_claimant_id_fkey
           FOREIGN KEY (civil_claimant_id)
           REFERENCES civil_claimant (id)
           ON DELETE SET NULL`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           DROP CONSTRAINT case_file_defendant_id_fkey`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           ADD CONSTRAINT case_file_defendant_id_fkey
           FOREIGN KEY (defendant_id)
           REFERENCES defendant (id)
           ON DELETE SET NULL`,
        { transaction },
      )
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           DROP CONSTRAINT case_file_civil_claimant_id_fkey`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           ADD CONSTRAINT case_file_civil_claimant_id_fkey
           FOREIGN KEY (civil_claimant_id)
           REFERENCES civil_claimant (id)`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           DROP CONSTRAINT case_file_defendant_id_fkey`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        `ALTER TABLE case_file
           ADD CONSTRAINT case_file_defendant_id_fkey
           FOREIGN KEY (defendant_id)
           REFERENCES defendant (id)`,
        { transaction },
      )
    }),
}
