import {
    buildCustomField,
    buildDescriptionField,
    buildForm,
    buildMultiField,
    buildSection,
    buildSubmitField,
  } from '@island.is/application/core'
  import { Form } from '@island.is/application/types'
  
  import Logo from '../assets/Logo'
  import { parentalLeaveFormMessages } from '../lib/messages'
  import { actionsResidenceGrant } from '../lib/parentalLeaveUtils'
  
  export const ResidenceGrantNoBirthDate: Form = buildForm({
    id: 'residenceGrantApplicationNoBirthDate',
    title: parentalLeaveFormMessages.residenceGrantMessage
    .residenceGrantClosedTitle,
    logo: Logo,
    children: [
      buildSection({
        id: 'residenceGrantApplicationNoBirthDate.section',
        title:'',
          
        children: [
          buildMultiField({
            title: parentalLeaveFormMessages.residenceGrantMessage
            .residenceGrantClosedTitle,
            id: 'residenceGrantApplicationNoBirthDate.multiTwo',
            description:
              parentalLeaveFormMessages.residenceGrantMessage
                .residenceGrantClosedDescription,
            children: [
              buildSubmitField({
                id: 'residenceGrantApplicationNoBirthDate.submit',
                placement: 'footer',
                title: '',
                refetchApplicationAfterSubmit: true,
                actions: actionsResidenceGrant('reject', [
                ]),
              }),
              buildCustomField({
                id: 'residenceGrantApplicationNoBirthDate.submit',
                title: '',
                defaultValue: 1,
                component: 'ImageField',
              }),
            ],
          }),
          buildDescriptionField({
            id: 'unused',
            title: '',
            description: '',
          }),
        ],
      }),
    ],
  })
  