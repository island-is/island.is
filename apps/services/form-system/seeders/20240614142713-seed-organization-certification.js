module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organization_certification', [
      {
        id: 'aeac43a3-daf0-4bca-9079-7dffe6121d75',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        certification_id: '329e9b75-62a6-41af-a1cb-2052d26ac31b', // estateGuardianshipCertificateStamped
      },
      {
        id: '2d324d06-2e2a-4da3-b6fd-f18a3e4e2dd4',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        certification_id: '37b8a86e-5787-4007-be40-d3f7b0070cca', // estateGuardianshipCertificateUnstamped
      },
      {
        id: 'b825f585-aa5d-48e5-91d6-0e056e41b5f3',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        certification_id: 'fa035b40-4324-4140-8747-d163ef645b28', // residenceCertificate
      },
      {
        id: '8570a43a-b694-468e-8956-c4e906c9becd',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        certification_id: '5ec5b516-a152-4761-b0e0-ba5aa4ffae61', // indebtednessCertificate
      },
      {
        id: 'c8b66543-fe0d-45ee-98bc-3d3bc9a0ad66',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        certification_id: 'b3f37a69-2700-45f5-88e6-03fc09fcf6cc', // criminalRecordStamped
      },
      {
        id: '65486db0-cd26-4db8-ba8c-9989ff389904',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        certification_id: '72127323-56f3-40ff-8ae4-68c20e80ff37', // criminalRecordUnstamped
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organization_certification', null, {})
  },
}
