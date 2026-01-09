import {
    buildDescriptionField,
    buildForm,
    buildSection,
  } from '@island.is/application/core'
  
  export const notAllowedForm = buildForm({
    id: 'notAllowedForm',
    children: [
      buildSection({
        id: 'notAllowedSection',
        title: '',
        children: [
          buildDescriptionField({
            id: 'notAllowedDescription',
            title: 'Aðeins bílaleigu fyrirtæki eða prófkúruhafar þeirra hafa aðgang að þessari umsókn',
            description: 'Ef þú telur að þú ættir að hafa aðgang að þessari umsókn, vinsamlegast hafðu samband við Skattinn í síma 442 1000',
          }),
        ],
      }),
    ],
  })
  
