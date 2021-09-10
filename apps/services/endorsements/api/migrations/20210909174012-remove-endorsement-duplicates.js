async function getByQuery(interface, query) {
  const result = await interface.sequelize.query(query)
  return result[1].rows
}

async function runQuery(interface, query) {
  return interface.sequelize.query(query)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Defines which endorsement_list ids are allowed to be considered
    // for a merger
    const allowedIds = [
      'f810b582-6f7a-496a-85cf-99d81e3b0d86',
      '45e89dba-eec4-45fe-9846-ddd32558ef3e',
      'e3ee567c-bb03-4bed-b081-5cc3e8117317',
      'f1002148-8c39-417a-89df-8808c09780a2',
      '070a8147-cd8f-4b92-b732-be307f51b3e4',
      'dbc9efb1-d98c-4139-96ed-40f5678716f7',
      '1293ab39-d0a5-44dd-bfe0-6d2e4afb307e',
      '4074db32-8899-404b-8250-a20952bed436',
      'cc18c1b1-af89-40d7-8ee0-b8ecbda8c337',
      '90ac32cd-0071-47a0-afaa-7b3ab0d2db90',
      '31e63275-b6b2-475c-a410-d0b0fdd081b5',
      '189d2a5d-c511-4bfa-848d-1e8e2c02ecc7',
      '1046ef77-ee84-4db8-94ef-1910d6828081',
      '65aafdc1-2eff-48a6-a22e-9ede353c3117',
      'f013d941-099e-4a8c-8acb-d5cd44a46c81',
      'f8780360-27d9-4d94-a309-69d31eeb38bd',
      '683157dc-09f0-4fa2-91e5-2632103dd179',
      '7de9c708-a1db-4d4c-a4bd-9641b924acc8',
      '568b971c-62b7-4e0d-a90d-6c137bbb8d0e',
      '9dd1e613-5451-443b-8b4b-884d0a516ff6',
      '3ded2e33-0a57-46de-9884-b8bd8ff2ec59',
      'b8167290-25e4-47fd-ae88-fa7c2a9afdcb',
      '48aba907-cae8-4188-b50e-f0933e510e49',
      'bba5d621-4143-42d0-b481-d9874c7bb122',
      'ee3dd866-032f-47e7-8b5f-494a5f4ce878',
      '87d4d3b9-a4c7-456e-8902-0eeb2c84af6c',
      '2664a23d-9225-42fe-8566-55cc7b175544',
      '6a3cf2a5-4769-4422-8eaf-3eef4e3e3483',
      'efb35063-c392-4ce0-a357-e50de85aafa3',
      'ce544a85-1340-4602-834d-41d05bcf4faf',
      '162829d2-e6c1-4c4e-ba8b-780c3041efbc',
      '06ae411e-765b-43e2-940d-d9710c78f41b',
      '0611a209-8f65-4ef0-9ad4-cbc314833e9d',
      'c7f643ce-71d9-452f-975e-6d90e223a115',
      '5a48d67f-cbc7-4ebf-b180-3f0aea5f645b',
      '7c4e545c-7e93-4de5-b299-453da6f96b84',
      '9f5587d6-1545-40f7-ab84-1805056c9249',
      '5de67652-cb91-45f9-84da-e5b0af5a17b5',
      '094f63f4-68c3-4221-856d-6510c0ae722e',
      'ea5e6148-8eb4-4736-a682-47e5fb5709e3',
      '8a6f7f75-a18d-40d7-93da-3faa315b1915',
      'cb5d4c90-839f-487f-825b-269ea923beaf',
      'f6209209-f444-4e24-a4fb-53ee0be26761',
      'fe7fe081-19f5-4543-8e66-ad60770b5ff7',
      'c88eef0a-0c2d-4114-bbb4-d771876f5ca6',
      'c9e81311-6d16-46c1-9530-bdd80ccce11a',
      '7257d39e-405d-46cd-bd25-5cb458ba8197',
      '480a3701-f011-4abb-8c51-1186566228f3',
      'f4f1120a-6fbb-4a98-8d0e-c6bb7298c764',
      'fe4f7e86-e92d-4d26-88f5-31fe900e2e94',
      '597e08c7-ab32-4e56-a6a4-66638d5837bb',
      'dda7dd9c-f4e0-49bb-829e-33f253d2b0be',
      '14f3cb3a-7b2a-4487-8c4e-54505e62fe50',
      '4941bbb7-ba39-41a6-a05d-43c033295c43',
      '6782689d-7f34-4443-a6ff-25f6feec1d22',
      '52b1450b-848e-48b1-bbc0-60400b3e65c0',
      '1aa486fc-15d4-4f27-8022-15d291d22699',
      '02ed08b3-7b97-4971-8f15-258b877ac3e2',
      '01b6bf4b-30dd-456c-8ced-b390ea47a3ed',
      '47fbe4a7-cfe1-484e-8852-c29ccc914111',
      'ce1e7c39-060d-4d88-9daa-da6d027e1b3c',
      '08f5b42e-1d77-41ef-a990-ceab4456d13a',
      '4b5701a6-d9a7-4e25-9450-2820592a31cf',
      'b96f7002-0f9d-448a-b76d-b14d0e04293d',
      '8feefcb7-a5cf-459a-9e2d-628ffb31f021',
      '79036f20-47f7-432c-a763-4cde0b3c4190',
      '2e7fc6b1-e278-4781-9644-eed3d33b5f0e',
      '01489ce6-9578-4c35-8cdf-56c0690c63ec',
      '2adc292e-8f9a-46be-b9f9-de04e754062f',
      '06564f2a-3bf1-4c06-a3cb-7e83f2286cd7',
      'a7421d96-2ff8-4984-97b5-74f144ae84ca',
      '4494261f-e60a-4a18-b96f-03eae4c2f5b1',
      'e1dac294-2ce5-404a-9529-b7f809a64903',
      '247951ea-9d2c-4231-9ebe-c565d6f441d3',
      'e2c90bbf-e8b5-49bc-852a-9b5231e50c0a',
      'ad4f5468-ba36-4fbc-ac56-003d63198f04',
      '77475d68-3b6e-4b42-90df-86bc055324ca',
      '53bd9696-29be-4bbf-b9e5-62ab9380f107',
      'e579fa59-099a-4d75-bffc-44bb94b77765',
      '96f12229-4c13-4039-bff3-503ac1e62915',
      'ff5d3748-9b96-45e6-8531-1aa3418e93f7',
      '711cfadf-ee7a-40bf-ad60-6174547138fb',
      'ce9afff5-214a-48ae-84a6-3c7bcab9b179',
      '946164e2-a31a-40f2-9ef2-99333e74238b',
      '95a2ca10-2755-4f00-807f-9451580c4a60',
      '031c5315-f249-43ed-adaa-c0cebade37b2',
      '1d16cc50-b6bb-451a-a04f-f5afac5b82b2',
      '4c7be51a-9ab6-4f37-93fb-c8024f0077a5',
      '2bf09864-4ece-47cc-afd0-b58b6c700345',
      '91973ab6-a27e-4625-b7e2-4d5c5c8fe723',
      '64a95f2e-c995-48e2-b9eb-3b46d8cdacd9',
      'fb82fe12-0f98-439f-9597-1554c6b35f4a',
      'ce5f4793-34c2-43f3-be5d-9380bdec090d',
      '00003442-9e0b-4d40-adba-ead3d9d240cb',
      'f937100f-5f9b-49b1-9b1d-53a11ec802b6',
      'db0991a1-457a-4dc0-8314-1d79cdc1f5f5',
      '1aea2175-e660-4c50-92ea-ba4d888d2f91',
      'e620a768-71ca-400d-8a4e-23dcbbccf2ec',
      '3c7e37d1-4724-4f5a-92aa-8f8e3aa74046',
      'b333e0fb-ee05-42eb-b0ad-30d40b63bb31',
      'acfa99e1-df7a-4b61-b7ae-0a20bda6f992',
      'e3d8dc34-e4ca-4668-8084-989bd3caf8a5',
      '58f25466-4026-4326-815b-fd8c2cae8a10',
    ]

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
        ` SELECT endorsement_list.meta, endorsement_list.id, endorsement_list.tags, COUNT(endorsement.endorser) 
            FROM endorsement_list 
            LEFT JOIN endorsement
            ON (endorsement_list.id = endorsement.endorsement_list_id)
            WHERE tags = '{${duplicateEndorsementGroup.tags.join(',')}}' 
              AND description = '${duplicateEndorsementGroup.description}'
            GROUP BY endorsement_list.id
            ORDER BY count DESC;`,
      )

      // Collect ids
      const problematicIds = duplicateEndorsementLists.map(
        (endorsement) => endorsement.id,
      )

      // Since we have an ordered list, we know that if we find the first id
      // We are aggregating to the largest list (by endorser count)
      const aggregateId = problematicIds.find((problematicId) =>
        allowedIds.includes(problematicId),
      )
      const aggregateIdIndex = problematicIds.indexOf(aggregateId)

      // Remove the aggregate
      problematicIds.splice(aggregateIdIndex, 1)

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
        console.log({ aggregateId, problematicIds })
        continue
      } else {
        console.log(`Aggregating into endorsement list with id ${aggregateId}`)
        console.log(
          `...with metadata ${JSON.stringify(
            duplicateEndorsementLists.find(
              (endorsementList) => endorsementList.id === aggregateId,
            ).meta,
          )}`,
        )
      }

      for (const problematicId of problematicIds) {
        // This query gets a list of all endorsers who are endorsing a problematic list
        const problematicEndorsements = await getByQuery(
          queryInterface,
          `SELECT id FROM endorsement WHERE endorsement_list_id = '${problematicId}';`,
        )

        console.log(
          `Moving endorsements from endorsement list: ${problematicId} to ${aggregateId}`,
          JSON.stringify(problematicEndorsements),
        )

        for (const problematicEndorsement of problematicEndorsements) {
          // Make all endorsements point to the aggregateId
          await runQuery(
            queryInterface,
            `UPDATE endorsement SET endorsement_list_id = '${aggregateId}' WHERE id = '${problematicEndorsement.id}';`,
          )
        }

        console.log(`Removing endorsement list: ${problematicId}`)

        // Finally delete the merged endorsement_list
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
