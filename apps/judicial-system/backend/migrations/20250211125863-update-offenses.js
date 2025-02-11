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

// export const getRelevantSubstances = (
//   offenses,
//   substances, // substances per indictment count
// ) => {
//   const allowedSubstances = offenses.map((offense) => ({
//     offense,
//     substances: offenseSubstances[offense],
//   }))

//   return allowedSubstances
//     .map((allowedSubstance) => ({
//       offense: allowedSubstance['offense'],
//       offenseSubstances: Object.entries(substances).filter((substance) =>
//         allowedSubstance['substances'].includes(substance[0]),
//       ),
//     }))
//     .flat()
// }

module.exports = {
  async up(queryInterface, Sequelize) {
    // TODO: Fetch all indictments, for each indictment we get the offenses and substances
    // for each offense we map the substances and create the relevant offense
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
              const substances = indictment_count.substances || {}

              const offenseSubstances = offenses.map((offense) => ({
                offense,
                availableSubstances: offenseSubstancesMap[offense],
              }))

              const substancesPerOffense = offenseSubstances
                .map((os) => {
                  const selectedSubstances = Object.entries(substances).filter(
                    (substance) =>
                      os['availableSubstances'].includes(substance[0]),
                  ).reduce((res, substance) => {
                    const substanceName = substance[0]
                    const measurement = substance[1]
                    return {...res, [substanceName]: measurement}}, {})
                  console.log(`Writing offense and selected substances: (${os['offense']}, ${JSON.stringify(selectedSubstances)})`)
                  return { offense: os['offense'], selectedSubstances }
                })
            }),
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
