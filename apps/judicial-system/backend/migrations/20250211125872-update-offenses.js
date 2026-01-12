'use strict'

const Substance = {
  ALCOHOL: 'ALCOHOL',
  AMPHETAMINE: 'AMPHETAMINE',
  ETIZOLAM: 'ETIZOLAM',
  PHENAZEPAM: 'PHENAZEPAM',
  KETAMINE: 'KETAMINE',
  KETOBEMIDONE: 'KETOBEMIDONE',
  COCAINE: 'COCAINE',
  MDMA: 'MDMA',
  METHAMPHETAMINE: 'METHAMPHETAMINE',
  METHYLPHENIDATE: 'METHYLPHENIDATE',
  O_DESMETHYLTRAMADOL: 'O_DESMETHYLTRAMADOL',
  TETRAHYDROCANNABINOL: 'TETRAHYDROCANNABINOL',
  TRAMADOL: 'TRAMADOL',
  ZOPICLONE: 'ZOPICLONE',
  ALPRAZOLAM: 'ALPRAZOLAM',
  BROMAZEPAM: 'BROMAZEPAM',
  BUPRENORPHINE: 'BUPRENORPHINE',
  DEMOXEAPAM: 'DEMOXEAPAM',
  DESMETHYLCHLORDIAZEPOXIDE: 'DESMETHYLCHLORDIAZEPOXIDE',
  DIAZEPAM: 'DIAZEPAM',
  FENTANYL: 'FENTANYL',
  FLUNITRAZEPAM: 'FLUNITRAZEPAM',
  GABAPENTIN: 'GABAPENTIN',
  CLONAZEPAM: 'CLONAZEPAM',
  CHLORDIAZEPOXIDE: 'CHLORDIAZEPOXIDE',
  CODEINE: 'CODEINE',
  LORAZEPAM: 'LORAZEPAM',
  METHADONE: 'METHADONE',
  MIDAZOLAM: 'MIDAZOLAM',
  MORPHINE: 'MORPHINE',
  NITRAZEPAM: 'NITRAZEPAM',
  NORBUPRENORPHINE: 'NORBUPRENORPHINE',
  NORDIAZEPAM: 'NORDIAZEPAM',
  OXAZEPAM: 'OXAZEPAM',
  OXYCODONE: 'OXYCODONE',
  PREGABALIN: 'PREGABALIN',
  QUETIAPINE: 'QUETIAPINE',
  TEMAZEPAM: 'TEMAZEPAM',
  TRIAZOLAM: 'TRIAZOLAM',
  ZOLPIDEM: 'ZOLPIDEM',
}

const offenseSubstancesMap = {
  DRIVING_WITHOUT_LICENCE: [],
  DRUNK_DRIVING: [Substance.ALCOHOL],
  ILLEGAL_DRUGS_DRIVING: [
    Substance.AMPHETAMINE,
    Substance.ETIZOLAM,
    Substance.PHENAZEPAM,
    Substance.KETAMINE,
    Substance.KETOBEMIDONE,
    Substance.COCAINE,
    Substance.MDMA,
    Substance.METHAMPHETAMINE,
    Substance.METHYLPHENIDATE,
    Substance.O_DESMETHYLTRAMADOL,
    Substance.TETRAHYDROCANNABINOL,
    Substance.TRAMADOL,
    Substance.ZOPICLONE,
  ],
  PRESCRIPTION_DRUGS_DRIVING: [
    Substance.ALPRAZOLAM,
    Substance.BROMAZEPAM,
    Substance.BUPRENORPHINE,
    Substance.DEMOXEAPAM,
    Substance.DESMETHYLCHLORDIAZEPOXIDE,
    Substance.DIAZEPAM,
    Substance.FENTANYL,
    Substance.FLUNITRAZEPAM,
    Substance.GABAPENTIN,
    Substance.CLONAZEPAM,
    Substance.CHLORDIAZEPOXIDE,
    Substance.CODEINE,
    Substance.LORAZEPAM,
    Substance.METHADONE,
    Substance.MIDAZOLAM,
    Substance.MORPHINE,
    Substance.NITRAZEPAM,
    Substance.NORBUPRENORPHINE,
    Substance.NORDIAZEPAM,
    Substance.OXAZEPAM,
    Substance.OXYCODONE,
    Substance.PREGABALIN,
    Substance.QUETIAPINE,
    Substance.TEMAZEPAM,
    Substance.TRIAZOLAM,
    Substance.ZOLPIDEM,
  ],
  SPEEDING: [],
}

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          'SELECT id, case_id, deprecated_offenses, substances FROM "indictment_count" WHERE deprecated_offenses IS NOT NULL',
          { transaction: t },
        )
        .then((res) =>
          Promise.all(
            res[0].map((indictment_count) => {
              const offenses = indictment_count.deprecated_offenses
              if (!offenses || offenses.length === 0) {
                return
              }
              const substances = indictment_count.substances || {}

              const offenseSubstances = offenses.map((offense) => ({
                offense,
                availableSubstances: offenseSubstancesMap[offense] || [],
              }))

              // Logic from getRelevantSubstances in apps/judicial-system/web/src/routes/Prosecutor/Indictments/Indictment/IndictmentCount.tsx
              const offensesToMigrate = offenseSubstances.map((os) => {
                const selectedSubstances = Object.entries(substances)
                  .filter((substance) =>
                    os['availableSubstances'].includes(substance[0]),
                  )
                  .reduce((res, substance) => {
                    const substanceName = substance[0]
                    const measurement = substance[1]
                    return { ...res, [substanceName]: measurement }
                  }, {})
                return {
                  indictment_count_id: indictment_count.id,
                  offense: os['offense'],
                  substances: selectedSubstances,
                }
              })
              console.log(
                `- Migrating indictment_count fields { offenses: ${offenses}, substances: ${JSON.stringify(
                  substances,
                )} } as ${offensesToMigrate.length} rows: ${JSON.stringify(
                  offensesToMigrate,
                )}`,
              )

              return Promise.all(
                offensesToMigrate.map((o) =>
                  queryInterface.sequelize.query(
                    `INSERT INTO "offense" (id, indictment_count_id, offense, substances) VALUES (md5(random()::text || clock_timestamp()::text)::uuid, '${
                      indictment_count.id
                    }', '${o.offense}', '${JSON.stringify(o.substances)}');`,
                    {
                      transaction: t,
                    },
                  ),
                ),
              )
            }),
          ),
        ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
        DELETE FROM offense
    `)
  },
}
