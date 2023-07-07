'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'tag',
      [
        {
          id: 'A359DC46-9A9A-418C-960C-85C621E63961',
          code: 'lifriki_umhverfi_og_audlindir',
          name_is: 'Lífríki, umhverfi og auðlindir',
          name_en: 'Biodiversity, environment and resources',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'F86324D7-0937-4D11-9C80-AD416FFCB5E2',
          code: 'samfelag_og_stjornmal',
          name_is: 'Samfélag og stjórnmál',
          name_en: 'Society and politics',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'DC00C6B3-8352-4CAC-9395-BC7554CB3D7E',
          code: 'efnahagur_log_og_rekstur',
          name_is: 'Efnahagur, lög og rekstur',
          name_en: 'Economy, law and operation',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'AE2AF8F6-953F-497A-9CAE-0EF511CBDE18',
          code: 'kennsla_sidfraedi_og_mannleg_hegdun',
          name_is: 'Kennsla, siðfræði og mannleg hegðun',
          name_en: 'Teaching, ethics and human behavior',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: '4B7EE795-4A7A-42AA-BE2C-27208560721C',
          code: 'fjolmidlar_upplysingataekni_og_midlun',
          name_is: 'Fjölmiðlar, upplýsingatækni og miðlun',
          name_en: 'Media, information technology and communication',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: '4AE20CD7-6E34-48EB-BAA6-FAB2819B4F7D',
          code: 'saga_menning_listir_og_tru',
          name_is: 'Saga, menning, listir og trú',
          name_en: 'History, culture, arts and religion',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'E0278622-6087-4CAA-9A5F-6A61EA2B2ED8',
          code: 'tungumal_og_malvisindi',
          name_is: 'Tungumál og málvísindi',
          name_en: 'Language and Linguistics',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: '3733605B-F724-4A6A-AE2B-D3C2F528BEFF',
          code: 'liftaekni_og_lyf',
          name_is: 'Líftækni og lyf',
          name_en: 'Biotechnology and medicine',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'CBDA06D2-4F03-4587-8B99-877FA805F6FA',
          code: 'heilsa_likama_og_lidan',
          name_is: 'Heilsa, líkami og líðan',
          name_en: 'Health, body and well-being',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'F23BE989-A0E6-42B3-AB16-701800DE4F84',
          code: 'verkfraedi_raunvisindi_taekni_og_tolur',
          name_is: 'Verkfræði, raunvísindi, tækni og tölur',
          name_en: 'Engineering, science, technology and mathematics',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'F88DE129-F125-4367-9E52-02D8EEA9DA90',
          code: 'honnun_listir_og_menning',
          name_is: 'Hönnun, listir og menning',
          name_en: 'Design, arts and culture',
          created: new Date(),
          modified: new Date(),
        },
        {
          id: 'FC00ECAB-F866-4975-881A-95932CC3AC74',
          code: 'landbunadur_og_sjavarutvegur',
          name_is: 'Landbúnaður og sjávarútvegur',
          name_en: 'Agriculture and Fisheries',
          created: new Date(),
          modified: new Date(),
        },
      ],
      {},
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tag', {
      code: [
        'lifriki_umhverfi_og_audlindir',
        'samfelag_og_stjornmal',
        'efnahagur_log_og_rekstur',
        'kennsla_sidfraedi_og_mannleg_hegdun',
        'fjolmidlar_upplysingataekni_og_midlun',
        'saga_menning_listir_og_tru',
        'tungumal_og_malvisindi',
        'liftaekni_og_lyf',
        'heilsa_likama_og_lidan',
        'verkfraedi_raunvisindi_taekni_og_tolur',
        'honnun_listir_og_menning',
        'landbunadur_og_sjavarutvegur',
      ],
    })
  },
}
