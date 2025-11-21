'use strict'

const fs = require('fs')
const path = require('path')
const csv = require('csv-parse/sync')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Create the indictment_subtype table
      await queryInterface.createTable(
        'indictment_subtype',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          article: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          main_category: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          sub_category: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          details: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          offense_type: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        },
        {
          transaction: t,
          indexes: [
            {
              name: 'indictment_subtype_article_idx',
              fields: ['article'],
            },
            {
              name: 'indictment_subtype_main_category_idx',
              fields: ['main_category'],
            },
            {
              name: 'indictment_subtype_offense_type_idx',
              fields: ['offense_type'],
            },
            {
              name: 'indictment_subtype_active_idx',
              fields: ['active'],
            },
          ],
        },
      )

      // Read and parse CSV data
      const csvFilePath = path.join(__dirname, 'MIGR_DATA.csv')
      const csvData = fs.readFileSync(csvFilePath, 'utf8')

      const records = csv.parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })

      // Insert data in batches
      const batchSize = 100
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize)

        const insertData = batch.map((record) => ({
          id: Sequelize.literal('gen_random_uuid()'),
          article: record['Ártal'],
          main_category: record['Grófflokkun'] || null,
          sub_category: record['Fínflokkun'] || null,
          description: record['Lýsing'] || null,
          details: record['Nánar'] || null,
          active: record['Virkur']?.toUpperCase() === 'TRUE',
          offense_type:
            record['Listi sakarefna í Réttarvörslugátt/Frá dómstólum'] || null,
        }))

        await queryInterface.bulkInsert('indictment_subtype', insertData, {
          transaction: t,
        })
      }

      console.log(`Inserted ${records.length} indictment subtype records`)
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('indictment_subtype', { transaction: t }),
    )
  },
}
