async function getByQuery(interface, query) {
  const result = await interface.sequelize.query(query)
  return result[1].rows
}

async function runQuery(interface, query) {
  const result = await interface.sequelize.query(query)
  return true
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Defines which endorsement_list ids are allowed to be considered
    // for a merger
    // TODO: insert allowed endorsement_list ids here
    const allowedIds = []

    // This query returns endorsement_lists
    // which should be unique per constituency and party list
    // but are not (hence the HAVING count(*) > 1)
    const duplicateEndorsementGroups = await getByQuery(
      queryInterface,
      "SELECT description, tags\
         FROM endorsement_list\
         WHERE (meta->>'applicationTypeId' = 'PartyApplication')\
         GROUP BY description, tags\
         HAVING count(*) > 1;",
    )

    for (const duplicateEndorsementGroup of duplicateEndorsementGroups) {
      // This query does the following, in a nutshell, for each duplicate endorsement group
      //     -see query above
      //
      // 1 - Joins together endorsements to their respective endorsement_list
      // 2 - Filters by description,tag key per each identified problematic group
      // 3 - Groups queries by endorsement_lists
      //   3.1 - Counts endorsers per list
      //   3.2 - Orders by amount, largest first
      const duplicateEndorsementLists = await getByQuery(
        queryInterface,
        ` SELECT endorsement_list.id, endorsement_list.tags, COUNT(endorsement.endorser) 
            FROM endorsement_list 
            LEFT JOIN endorsement
            ON (endorsement_list.id = endorsement.endorsement_list_id)
            WHERE tags = '{${duplicateEndorsementGroup.tags.join(',')}}' 
              AND description = '${duplicateEndorsementGroup.description}'
            GROUP BY endorsement_list.id
            ORDER BY count DESC;`,
      )

      // Collect ids
      const problematicIds = duplicateEndorsementLists
        .map((endorsement) => endorsement.id)
        .filter((id) => allowedIds.includes(id))

      // Since we have an ordered list, we know that if we splice the first id away
      // We are aggregating to the largest list (by endorser count)
      const aggregateId = problematicIds.splice(0, 1)[0]

      // If nothing is to be done after filtering
      // we log that
      if (!aggregateId || problematicIds.length == 0) {
        console.log(
          'Nothing to be done for',
          JSON.stringify({
            description: duplicateEndorsementGroup.description,
            tags: duplicateEndorsementGroup.tags,
            originalIds: duplicateEndorsementLists.map(
              (endorsement) => endorsement.id,
            ),
          }),
        )
      }

      for (const problematicId of problematicIds) {
        // This query gets a list of all endorsers who are endorsing a problematic list
        const problematicEndorsements = await getByQuery(
          queryInterface,
          `SELECT id FROM endorsement WHERE endorsement_list_id = '${problematicId}';`,
        )

        for (const problematicEndorsement of problematicEndorsements) {
          // Make all endorsements point to the aggregateId
          await runQuery(
            queryInterface,
            `UPDATE endorsement SET endorsement_list_id = '${aggregateId}' WHERE id = '${problematicEndorsement.id}';`,
          )
        }

        // Finally delete the problematic endorsement_list
        await runQuery(
          queryInterface,
          `DELETE FROM endorsement_list WHERE id = '${problematicId}';`,
        )
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('DOWN')
  },
}
