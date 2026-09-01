'use strict'

const values = [
  '_115_1',
  '_115_1_A',
  '_115_1_B',
  '_115_1_C',
  '_115_1_D',
  '_115_1_E',
  '_115_1_F',
  '_115_1_G',
  '_115_1_H',
]

module.exports = {
  up: async (queryInterface) => {
    for (const value of values) {
      try {
        // ALTER TYPE ... ADD cannot run inside a transaction block
        await queryInterface.sequelize.query(
          `ALTER TYPE "enum_case_legal_provisions" ADD VALUE '${value}';`,
        )
      } catch (e) {
        if (e.message !== `enum label "${value}" already exists`) {
          throw e
        }
      }
    }
  },

  down: async () => {
    // no need to roll back
    return
  },
}
