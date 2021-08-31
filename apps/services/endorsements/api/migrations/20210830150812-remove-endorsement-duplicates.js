module.exports = {
  up: async (queryInterface, Sequelize) => {
      const problematicApplicants = await queryInterface.sequelize.query("SELECT applicant FROM application GROUP BY applicant HAVING count(*) > 1;")
      console.log(JSON.stringify(problematicApplicants))
  },

  down: async (queryInterface, Sequelize) => {
      console.log("DOWN");
  }
}
