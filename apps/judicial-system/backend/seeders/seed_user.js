'use strict'

const userSeeds = `[
  {
    "id": "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
    "national_id": "0000000009",
    "name": "Áki Ákærandi",
    "title": "ákærandi",
    "mobile_number": "0000000",
    "email": "aki@dummy.dd",
    "role": "PROSECUTOR",
    "institution_id": "53581d7b-0591-45e5-9cbe-c96b2f82da85",
    "can_confirm_indictment": true
  },
  {
    "id": "7ac41587-061b-44b8-8028-fb19f997c8e7",
    "national_id": "0000006669",
    "name": "Finnur Fulltrúi",
    "title": "fulltrúi",
    "mobile_number": "6666666",
    "email": "finnur@dummy.dd",
    "role": "PROSECUTOR_REPRESENTATIVE",
    "institution_id": "53581d7b-0591-45e5-9cbe-c96b2f82da85"
  },
  {
    "id": "cef1ba9b-99b6-47fc-a216-55c8194830aa",
    "national_id": "0000001119",
    "name": "Dalli Dómritari",
    "title": "dómritari",
    "mobile_number": "1111111",
    "email": "dalli@dummy.dd",
    "role": "DISTRICT_COURT_REGISTRAR",
    "institution_id": "d1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf"
  },
  {
    "id": "9c0b4106-4213-43be-a6b2-ff324f4ba0c2",
    "national_id": "0000002229",
    "name": "Dóra Dómari",
    "title": "dómari",
    "mobile_number": "2222222",
    "email": "dora@dummy.dd",
    "role": "DISTRICT_COURT_JUDGE",
    "institution_id": "d1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf"
  },
  {
    "id": "4bbf247c-c14f-40b5-8f4c-dd3236e7f667",
    "national_id": "0000003339",
    "name": "Lalli Landsréttardómari",
    "title": "landsréttardómari",
    "mobile_number": "3333333",
    "email": "lalli@dummy.dd",
    "role": "COURT_OF_APPEALS_JUDGE",
    "institution_id": "4676f08b-aab4-4b4f-a366-697540788088"
  },
  {
    "id": "3bbf247c-c14f-40b5-8f4c-dd3236e7f667",
    "national_id": "0000033339",
    "name": "Lára Landsréttardómari",
    "title": "landsréttardómari",
    "mobile_number": "2333333",
    "email": "lara@dummy.dd",
    "role": "COURT_OF_APPEALS_JUDGE",
    "institution_id": "4676f08b-aab4-4b4f-a366-697540788088"
  },
  {
    "id": "2bbf247c-c14f-40b5-8f4c-dd3236e7f667",
    "national_id": "0000000001",
    "name": "Lilja Landsréttardómari",
    "title": "landsréttardómari",
    "mobile_number": "1333333",
    "email": "lilja@dummy.dd",
    "role": "COURT_OF_APPEALS_JUDGE",
    "institution_id": "4676f08b-aab4-4b4f-a366-697540788088"
  },
  {
    "id": "1bbf247c-c14f-40b5-8f4c-dd3236e7f667",
    "national_id": "0033333339",
    "name": "Dóri Dómritari",
    "title": "landsréttardómari",
    "mobile_number": "5333333",
    "email": "dori@dummy.dd",
    "role": "COURT_OF_APPEALS_ASSISTANT",
    "institution_id": "4676f08b-aab4-4b4f-a366-697540788088"
  },
  {
    "id": "a9506891-96cc-4c5d-ad14-eb2f2ef39bb7",
    "national_id": "0000007779",
    "name": "Aðalheiður aðstoðar",
    "title": "aðstoðarmaður dómara",
    "mobile_number": "7777777",
    "email": "adalheidur@dummy.dd",
    "role": "DISTRICT_COURT_ASSISTANT",
    "institution_id": "d1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf"
  },
  {
    "id": "1e08b81e-2aa4-11ec-8d3d-0242ac130003",
    "national_id": "0000004449",
    "name": "Pétur í FMST",
    "title": "starfsmaður",
    "mobile_number": "4444444",
    "email": "petur@dummy.dd",
    "role": "PRISON_SYSTEM_STAFF",
    "institution_id": "c9b3b124-2a85-11ec-8d3d-0242ac130003"
  },
  {
    "id": "1e08ba30-2aa4-11ec-8d3d-0242ac130003",
    "national_id": "0000005559",
    "name": "Valgarð á Hólmsheiði",
    "title": "starfsmaður",
    "mobile_number": "5555555",
    "email": "valgard@dummy.dd",
    "role": "PRISON_SYSTEM_STAFF",
    "institution_id": "c9b3b3ae-2a85-11ec-8d3d-0242ac130003"
  },
  {
    "id": "b129c0f6-d8db-4ac1-a1de-f517657b6e83",
    "national_id": "9999999999",
    "name": "Test Sækjandi",
    "title": "Test Saksóknari",
    "mobile_number": "9999999",
    "email": "testsaekjandi@dummy.dd",
    "role": "PROSECUTOR",
    "institution_id": "53581d7b-0591-45e5-9cbe-c96b2f82da85"
  },
  {
    "id": "12301c51-2bb7-4014-9469-f7ac2cd9c794",
    "national_id": "0000000000",
    "name": "Test Dómari",
    "title": "Test Dómari",
    "mobile_number": "0000009",
    "email": "testdomari@dummy.dd",
    "role": "DISTRICT_COURT_JUDGE",
    "institution_id": "d1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf"
  },
	{
		"id": "5e8309e7-8e01-4762-adad-46e1e5f1e44e",
		"national_id": "0000007777",
		"name": "Test Skrifstofa Ríkissaksóknara",
		"mobile_number": "0000000",
		"role": "PUBLIC_PROSECUTOR_STAFF",
		"title": "Skrifstofa Ríkissaksóknara",
		"email": "testskrifstofariksak@dummy.dd",
		"active": true,
		"institution_id": "8f9e2f6d-6a00-4a5e-b39b-95fd110d762e"
	},
	{
		"id": "1599448b-5ec4-4232-8796-7ec6bfbde0a1",
		"national_id": "0000998888",
		"name": "Test Ríkissaksóknari",
		"mobile_number": "0000000",
		"role": "PROSECUTOR",
		"title": "Ríkissaksóknari",
		"email": "testrikissaksoknari@dummy.dd",
		"active": true,
		"institution_id": "8f9e2f6d-6a00-4a5e-b39b-95fd110d762e",
		"can_confirm_indictment": true
	}
]`

module.exports = {
  up: (queryInterface, Sequelize) => {
    var model = queryInterface.sequelize.define('user', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      created: Sequelize.DATE,
      updated: Sequelize.DATE,
      national_id: Sequelize.STRING,
      name: Sequelize.STRING,
      title: Sequelize.STRING,
      mobile_number: Sequelize.STRING,
      email: Sequelize.STRING,
      role: Sequelize.STRING,
      institution_id: Sequelize.UUID,
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        JSON.parse(userSeeds).map((user) =>
          queryInterface.upsert(
            'user',
            {
              ...user,
              created: new Date(),
              modified: new Date(),
            },
            {
              ...user,
              modified: new Date(),
            },
            { id: user.id },
            { transaction: t, model },
          ),
        ),
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete('user', null, { transaction: t }),
    )
  },
}
