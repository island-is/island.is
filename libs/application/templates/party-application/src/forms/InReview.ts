import {
    buildForm,
    buildMultiField,
    buildSection,
    buildSubmitField,
    buildDescriptionField,
    Form,
    FormModes,
    buildCustomField,
  } from '@island.is/application/core'
  import { m } from '../lib/messages'
  import Logo from '../assets/Logo'



  export const InReview: Form = buildForm({
    id: 'inReview',
    title: 'Til skoðunar',
    mode: FormModes.REVIEW,
    logo: Logo,
    children: [
      buildSection({
        id: 'review',
        title: 'Yfirlit',
        children: [
          buildMultiField({
            id: 'multi',
            title: 'Yfirkjörstjórn',
            description: 'Vinsamlegast farðu yfir upplýsingarnar hér að neðan og staðfestu að þær séu réttar.',
            children: [

              buildCustomField({
                id: 'collectEndorsements',
                title: m.endorsementList.title,
                component: 'SupremeCourtOverview',
              }),
              buildSubmitField({
                id: 'submit',
                title: 'Submit',
                placement: 'footer',
                actions: [
                  { name: 'Hafna', type: 'reject', event: 'REJECT' },
                  { name: 'Samþykkja lista', type: 'primary', event: 'APPROVE' },
                ],
              }),
            ],
          }),
          buildDescriptionField({
            id: 'final',
            title: 'Takk',
            description: 'Bæ description',
          }),
        ],
      }),
    ],
  })
  