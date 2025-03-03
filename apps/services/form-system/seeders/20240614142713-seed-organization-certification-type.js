module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organization_certification_type', [
      {
        id: 'aeac43a3-daf0-4bca-9079-7dffe6121d75',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        certification_type_id: 'ESTATE_GUARDIANSHIP_CERTIFICATE_STAMPED',
      },
      {
        id: '2d324d06-2e2a-4da3-b6fd-f18a3e4e2dd4',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        certification_type_id: 'ESTATE_GUARDIANSHIP_CERTIFICATE_UNSTAMPED',
      },
      {
        id: 'b825f585-aa5d-48e5-91d6-0e056e41b5f3',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        certification_type_id: 'RESIDENCE_CERTIFICATE',
      },
      {
        id: '8570a43a-b694-468e-8956-c4e906c9becd',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        certification_type_id: 'INDEBTEDNESS_CERTIFICATE',
      },
      {
        id: 'c8b66543-fe0d-45ee-98bc-3d3bc9a0ad66',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        certification_type_id: 'CRIMINAL_RECORD_STAMPED',
      },
      {
        id: '65486db0-cd26-4db8-ba8c-9989ff389904',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        certification_type_id: 'CRIMINAL_RECORD_UNSTAMPED',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organization_certification_type', null, {})
  },
}
