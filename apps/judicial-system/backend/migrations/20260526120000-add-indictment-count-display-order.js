'use strict'

const { Sequelize } = require('sequelize')

const getDateMs = (date) => {
  if (!date) return undefined
  if (typeof date === 'string') return new Date(date).getTime()
  return new Date(date).getTime()
}

const getIndictmentCountCompare =
  (crimeScenes) =>
  (a, b) => {
    const aDate = getDateMs(
      a.police_case_number
        ? crimeScenes?.[a.police_case_number]?.date
        : undefined,
    )
    const bDate = getDateMs(
      b.police_case_number
        ? crimeScenes?.[b.police_case_number]?.date
        : undefined,
    )

    if (aDate === undefined || aDate === null) {
      return bDate === undefined || bDate === null ? 0 : 1
    }

    if (bDate === undefined || bDate === null) {
      return -1
    }

    return aDate !== bDate ? (aDate < bDate ? -1 : 1) : 0
  }

const sortCountsForBackfill = (counts, crimeScenes) =>
  [...counts].sort((a, b) => {
    const compare = getIndictmentCountCompare(crimeScenes)(a, b)
    if (compare !== 0) return compare

    const aCreated = a.created ? new Date(a.created).getTime() : 0
    const bCreated = b.created ? new Date(b.created).getTime() : 0
    return aCreated - bCreated
  })

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'indictment_count',
        'display_order',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      )

      const [rows] = await queryInterface.sequelize.query(
        `
        SELECT
          indictment_count.id,
          indictment_count.case_id,
          indictment_count.police_case_number,
          indictment_count.created,
          "case".crime_scenes
        FROM indictment_count
        INNER JOIN "case" ON "case".id = indictment_count.case_id
        `,
        { transaction },
      )

      const countsByCaseId = rows.reduce((acc, row) => {
        const caseCounts = acc.get(row.case_id) ?? []
        caseCounts.push(row)
        acc.set(row.case_id, caseCounts)
        return acc
      }, new Map())

      for (const [, caseCounts] of countsByCaseId) {
        const crimeScenes = caseCounts[0]?.crime_scenes ?? null
        const sortedCounts = sortCountsForBackfill(caseCounts, crimeScenes)

        for (let index = 0; index < sortedCounts.length; index++) {
          await queryInterface.bulkUpdate(
            'indictment_count',
            { display_order: index },
            { id: sortedCounts[index].id },
            { transaction },
          )
        }
      }
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('indictment_count', 'display_order', {
        transaction,
      }),
    )
  },
}
