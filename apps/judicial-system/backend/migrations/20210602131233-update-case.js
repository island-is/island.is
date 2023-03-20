'use strict'

module.exports = {
  up: async (queryInterface) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'SEARCH_WARRANT\';',
      )
    } catch (e) {
      if (e.message != 'enum label "SEARCH_WARRANT" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'BANKING_SECRECY_WAIVER\';',
      )
    } catch (e) {
      if (e.message != 'enum label "BANKING_SECRECY_WAIVER" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'PHONE_TAPPING\';',
      )
    } catch (e) {
      if (e.message != 'enum label "PHONE_TAPPING" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'TELECOMMUNICATIONS\';',
      )
    } catch (e) {
      if (e.message != 'enum label "TELECOMMUNICATIONS" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'TRACKING_EQUIPMENT\';',
      )
    } catch (e) {
      if (e.message != 'enum label "TRACKING_EQUIPMENT" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'PSYCHIATRIC_EXAMINATION\';',
      )
    } catch (e) {
      if (e.message != 'enum label "PSYCHIATRIC_EXAMINATION" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'SOUND_RECORDING_EQUIPMENT\';',
      )
    } catch (e) {
      if (
        e.message != 'enum label "SOUND_RECORDING_EQUIPMENT" already exists'
      ) {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'AUTOPSY\';',
      )
    } catch (e) {
      if (e.message != 'enum label "AUTOPSY" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'BODY_SEARCH\';',
      )
    } catch (e) {
      if (e.message != 'enum label "BODY_SEARCH" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'INTERNET_USAGE\';',
      )
    } catch (e) {
      if (e.message != 'enum label "INTERNET_USAGE" already exists') {
        throw e
      }
    }
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_type" ADD VALUE \'OTHER\';',
      )
    } catch (e) {
      if (e.message != 'enum label "OTHER" already exists') {
        throw e
      }
    }
  },

  down: async () => {
    // no need to roll back
    return
  },
}
