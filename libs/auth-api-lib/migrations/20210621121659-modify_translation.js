'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
        INSERT INTO language(iso_key, description, english_description)
          SELECT DISTINCT language, language, language from translation
            WHERE NOT EXISTS (select 0 from language where iso_key = translation.language);

        ALTER TABLE translation
        ADD CONSTRAINT FK_translation_language FOREIGN KEY (language)
        REFERENCES language (iso_key);

        CREATE INDEX translation_language_index
        ON translation (language);
      COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        ALTER TABLE translation
        DROP CONSTRAINT FK_translation_language;
        DROP INDEX translation_language_index;
      COMMIT;
    `)
  },
}
