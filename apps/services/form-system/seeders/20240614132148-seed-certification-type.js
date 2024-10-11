'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('certification_type', [
      {
        id: '329e9b75-62a6-41af-a1cb-2052d26ac31b',
        type: 'estateGuardianshipCertificateStamped',
        name: '{ "is": "Búsforræðisvottorð", "en": "Certificate of authority to manage an estate" }',
        description:
          '{ "is": "Búsforræðisvottorð með stimpli", "en": "A document stating that the party in question has custody of his estate, ie. has not been declared bankrupt." }',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '37b8a86e-5787-4007-be40-d3f7b0070cca',
        type: 'estateGuardianshipCertificateUnstamped',
        name: '{ "is": "Búsforræðisvottorð án stimpils", "en": "Certificate of authority to manage an estate" }',
        description:
          '{ "is": "Búsforræðisvottorð án stimpils", "en": "A document stating that the party in question has custody of his estate, ie. has not been declared bankrupt." }',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'fa035b40-4324-4140-8747-d163ef645b28',
        type: 'residenceCertificate',
        name: '{ "is": "Búsetuvottorð", "en": "Residence certificate" }',
        description: '{ "is": "Búsetuvottorð", "en": "Residence certificate" }',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '5ec5b516-a152-4761-b0e0-ba5aa4ffae61',
        type: 'indebtednessCertificate',
        name: '{ "is": "Skuldleysisvottorð", "en": "Certificate of indebtedness" }',
        description:
          '{ "is": "Skuldleysisvottorð", "en": "Certificate of indebtedness" }',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'b3f37a69-2700-45f5-88e6-03fc09fcf6cc',
        type: 'criminalRecordStamped',
        name: '{ "is": "Sakavottorð", "en": "Criminal record" }',
        description:
          '{ "is": "Sakavottorð með stimpli", "en": "Document containing your criminal record with stamp" }',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '72127323-56f3-40ff-8ae4-68c20e80ff37',
        type: 'criminalRecordUnstamped',
        name: '{ "is": "Sakavottorð án stimpils", "en": "Criminal record without stamp" }',
        description:
          '{ "is": "Sakavottorð án stimpils", "en": "Document containing your criminal record without stamp" }',
        created: new Date(),
        modified: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('certification_type', null, {})
  },
}
