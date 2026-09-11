'use strict'

// Which decision an appeal case challenges: a ruling (kæra) or the verdict
// concluding an indictment case (áfrýjun).
//
// The two are the same record - an appeal that Landsréttur receives, hears and
// rules on - so áfrýjun reuses appeal_case rather than getting a table of its
// own. What it needs is to be told apart, because a case-level appeal has no
// ruling_file_id whether it is a kæra of a dismissal or an áfrýjun of a verdict,
// and every list and view built so far means kæra when it joins appeal_case. An
// áfrýjun in APPEALED would otherwise show up in the district court's "Kærð mál"
// tab. The discriminator is filtered in one place, the `appealCase` association
// scope on the Case model, which Sequelize applies to every include of that
// alias.
//
// Backfill is unconditional: every existing row is a kæra, since nothing has
// been able to create an áfrýjun until now.
//
// Stored as a plain string, not a Postgres enum - the values are validated in
// the model (DataType.ENUM over AppealCaseType) and adding a value to a DB enum
// needs its own migration. Matches appeal_event_log.appeal_origin.
//
// The column carries a database default of 'RULING' so that a pod from the
// previous release, which knows nothing about appeal_type, can still create an
// appeal in the window between this migration and the new code rolling out.
//
// The default is not what application code relies on to get the type right:
// `CreateAppealCase` requires it, so a creation path cannot omit it and quietly
// produce a kæra. Removing the default later would only reopen the rollout
// window on the next deploy, so it stays.

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'appeal_case',
        'appeal_type',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      )

      await queryInterface.sequelize.query(
        `UPDATE appeal_case SET appeal_type = 'RULING' WHERE appeal_type IS NULL`,
        { transaction },
      )

      await queryInterface.changeColumn(
        'appeal_case',
        'appeal_type',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'RULING',
        },
        { transaction },
      )
    })
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('appeal_case', 'appeal_type', {
        transaction,
      })
    })
  },
}
