// Seeds municipality numbers (sveitarfélagsnúmer) for existing municipality
// domains, keyed on the domain primary key. Domains that don't exist in an
// environment are skipped, and admin-entered values are never overwritten.
const MUNICIPALITY_CODES = {
  '@reykjavik.is': '0000', // Reykjavíkurborg
  '@kopavogur.is': '1000', // Kópavogsbær
  '@gardabaer.is': '1300', // Garðabær
  '@skagafjordur.is': '5716', // Skagafjörður
  '@akureyri.is': '6000', // Akureyrarbær
  '@fjallabyggd.is': '6250', // Fjallabyggð
  '@mulathing.is': '7400', // Múlaþing
  '@vestmannaeyjar.is': '8000', // Vestmannaeyjabær
  '@arborg.is': '8200', // Sveitarfélagið Árborg
}

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const [name, code] of Object.entries(MUNICIPALITY_CODES)) {
        await queryInterface.sequelize.query(
          `UPDATE domain
             SET municipality_code = :code
           WHERE name = :name
             AND municipality_code IS NULL`,
          { replacements: { name, code }, transaction },
        )
      }
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      for (const [name, code] of Object.entries(MUNICIPALITY_CODES)) {
        await queryInterface.sequelize.query(
          `UPDATE domain
             SET municipality_code = NULL
           WHERE name = :name
             AND municipality_code = :code`,
          { replacements: { name, code }, transaction },
        )
      }
    })
  },
}
