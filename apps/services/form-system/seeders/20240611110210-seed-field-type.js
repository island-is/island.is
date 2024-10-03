'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('field_type', [
      {
        id: '09206657-9a89-4265-b58e-13b220f805a2',
        type: 'default',
        name: '{ "is": "", "en": "" }',
        description: '{ "is": "", "en": "" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'db7ef634-3bec-4051-8370-e13315a7885e',
        type: 'textbox',
        name: '{ "is": "Textainnsláttur", "en": "Textbox" }',
        description:
          '{ "is": "Notandi slær inn texta", "en": "User enters text" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '2bd485da-08a3-4554-8ffc-f6632e6e5a84',
        type: 'numberbox',
        name: '{ "is": "Tölustafir", "en": "Numbers" }',
        description:
          '{ "is": "Notandi slær inn tölustafi", "en": "User enters numbers" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '59a38f6d-f369-4adc-8af6-9df91370073b',
        type: 'message',
        name: '{ "is": "Skilaboð", "en": "Message" }',
        description:
          '{ "is": "Skilaboð sem birtast í texta", "en": "Message that appears as text" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '25a339fb-2d16-4d7f-97c5-b9fe990e7b06',
        type: 'checkbox',
        name: '{ "is": "Hakbox", "en": "Checkbox" }',
        description: '{ "is": "Já/nei val", "en": "Yes/no options" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '29b23a4b-f94b-406b-b169-d4254fac1c56',
        type: 'datePicker',
        name: '{ "is": "Dagssetning", "en": "Date picker" }',
        description:
          '{ "is": "Notandi velur dagssetningu úr dagatali", "en": "User chooses date from calendar" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '9c68695e-8205-41a9-a84f-7c741ac09c05',
        type: 'dropdownList',
        name: '{ "is": "Fellilisti", "en": "Dropdown list" }',
        description:
          '{ "is": "Notandi velur eitt gildi af nokkrum möguleikum úr lista", "en": "User chooses a single value from a dropdown list of options" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '75cbc28a-c13f-4f75-bd06-26dbb37ebdde',
        type: 'radioButtons',
        name: '{ "is": "Valhnappar", "en": "Radio buttons" }',
        description:
          '{ "is": "Notandi velur eitt gildi af nokkrum möguleikum", "en": "User chooses a single value from several options" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '81e61315-ce40-4619-b33a-b5a6a5019a77',
        type: 'homestayNumber',
        name: '{ "is": "Heimagistingarnúmer", "en": "Homestay number" }',
        description:
          '{ "is": "Notandi slær inn heimagistingarnúmer sitt", "en": "User enters their homestay number" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'bac7d3f2-9614-4173-8e60-1e9d07f24510',
        type: 'homestayOverview',
        name: '{ "is": "Heimagistingaryfirlit", "en": "Homestay overview" }',
        description:
          '{ "is": "Notandi fyllir út nýtingaryfirlit fyrir almanaksár", "en": "Users fills out their homestay overview for the calendar year" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '15a57466-0be3-451d-988d-5b807fea3459',
        type: 'propertyNumber',
        name: '{ "is": "Fasteignanúmer", "en": "Property number" }',
        description:
          '{ "is": "Notandi velur fasteign úr lista eða slær inn fasteignanúmer", "en": "User chooses property from a list or enters their property number" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '80bbf10c-0598-46a8-baea-1db4933a54da',
        type: 'bankAccount',
        name: '{ "is": "Bankareikningsnúmer", "en": "Bank account" }',
        description:
          '{ "is": "Notandi slær inn bankareikningsnúmer sitt", "en": "User enters their bank account" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '80cecd52-798d-424f-96b7-8b0a50bc70ba',
        type: 'nationalId',
        name: '{ "is": "Kennitala", "en": "National Id" }',
        description:
          '{ "is": "Notandi slær inn kennitölu sína", "en": "User enters their national Id" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '44b1c9b1-5a59-4c5f-b631-bc9695a91469',
        type: 'payer',
        name: '{ "is": "Greiðandi", "en": "Payer" }',
        description:
          '{ "is": "Notandi slær inn kennitölu greiðanda", "en": "User enters the national Id of the payer" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '2261d835-6be8-40b5-a5d9-ca39a2ba9150',
        type: 'iskNumberbox',
        name: '{ "is": "Krónutala", "en": "ISK number box" }',
        description:
          '{ "is": "Notandi slær inn krónutölu", "en": "User enters ISK number" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '8bcfe82c-9819-45a7-9172-f00301f5a0d9',
        type: 'iskSumbox',
        name: '{ "is": "Krónutölusamtala", "en": "ISK sum box" }',
        description:
          '{ "is": "Kerfið reiknar út samtölu krónutalna", "en": "The system calculates the sum of ISK number boxes" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '0ca1d057-99e2-46d4-b12a-e07af79e52d5',
        type: 'email',
        name: '{ "is": "Netfang", "en": "Email" }',
        description:
          '{ "is": "Notandi slær inn netfang", "en": "User enters email" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '5786bc16-b531-406e-83fe-511c4c39464e',
        type: 'phoneNumber',
        name: '{ "is": "Símanúmer", "en": "Phone number" }',
        description:
          '{ "is": "Notandi slær inn símanúmer", "en": "User enters phone number" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'ae7486cb-c434-48ce-8e8e-3f79e890ac46',
        type: 'timeInput',
        name: '{ "is": "Tími", "en": "time" }',
        description:
          '{ "is": "Notandi velur/slær inn tíma", "en": "User chooses/enters time" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '7cbbe78f-cd5f-4fb9-a77c-86af2bf986b1',
        type: 'document',
        name: '{ "is": "Skjal", "en": "Document" }',
        description:
          '{ "is": "Notandi hleður upp skjali/skjölum", "en": "User uploads file/s" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'c1e82fc0-e609-4503-87bd-37379e4f5d54',
        type: 'payment',
        name: '{ "is": "Greiðsla", "en": "Payment" }',
        description: '{ "is": "Greiðsla", "en": "Payment" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '49599a07-4d06-4ad4-9927-b55eab2dd97d',
        type: 'nationaIdEstate',
        name: '{ "is": "Kennitala dánarbús", "en": "National Id estate" }',
        description:
          '{ "is": "Notandi slær inn kennitölu sem við flettum upp í gagnagrunni látinna", "en": "User enters national Id that we look up in database of deceaced" }',
        is_common: false,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'ad67a9c3-f5d9-47eb-bcf9-dd34becf4b76',
        type: 'nationalIdAll',
        name: '{ "is": "Kennitala allt", "en": "National Id all" }',
        description:
          '{ "is": "Notandi slær inn kennitölu sem við flettum upp í öllum gagnagrunnum", "en": "User enters national Id that we look up in all databases" }',
        is_common: false,
        created: new Date(),
        modified: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('field_type', null, {})
  },
}
