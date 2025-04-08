'use strict';

/**
 * Migration: Drop all tables in the form-system database
 * 
 * Purpose: Complete removal of the current database schema to prepare for
 * a rebuilt schema as part of the form-system fix initiative.
 * 
 * WARNING: This migration permanently removes all data. 
 * This migration will be removed so that it is not run in production.
 * 
 * Follow-up: This will be immediately followed by migrations that create
 * the new table structure.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.dropAllTables();
      console.log('All tables dropped successfully.');
    } catch (e) {
      console.error('Error dropping tables:', e);
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {
    console.warn('WARNING: Rollback for the table-drop migration is not supported. ' +
      +     'Tables cannot be automatically restored. Use database backups if restoration is needed.')
  }
};
