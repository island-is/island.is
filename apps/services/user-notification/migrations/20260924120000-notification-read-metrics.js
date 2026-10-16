'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'user_notification',
        'read_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      )
      // Enforce first-read semantics atomically for every writer, including old
      // API pods during a rolling deployment and mark-all-as-read updates.
      await queryInterface.sequelize.query(
        `
        CREATE FUNCTION notification_first_read() RETURNS trigger AS $$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            NEW.read_at := CASE WHEN NEW.read THEN clock_timestamp() ELSE NULL END;
          ELSE
            NEW.read_at := OLD.read_at;
            IF NOT OLD.read AND NEW.read AND OLD.read_at IS NULL THEN
              NEW.read_at := clock_timestamp();
            END IF;
          END IF;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER notification_first_read
          BEFORE INSERT OR UPDATE ON user_notification
          FOR EACH ROW EXECUTE FUNCTION notification_first_read();
        CREATE TABLE notification_metrics_coverage (
          id integer PRIMARY KEY CHECK (id = 1),
          started_at timestamptz NOT NULL DEFAULT clock_timestamp()
        );
        INSERT INTO notification_metrics_coverage (id) VALUES (1);
      `,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        DROP TRIGGER notification_first_read ON user_notification;
        DROP FUNCTION notification_first_read();
        DROP TABLE notification_metrics_coverage;
      `,
        { transaction },
      )
      await queryInterface.removeColumn('user_notification', 'read_at', {
        transaction,
      })
    })
  },
}
