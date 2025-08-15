import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'aa.application:applicant.general.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Applicant section title',
    },
    pageTitle: {
      id: 'aa.application:applicant.general.pageTitle',
      defaultMessage: 'Umsækjandi',
      description: `Applicant page title`,
    },
    description: {
      id: 'aa.application:applicant.general.description',
      defaultMessage:
        'Vinsamlegast leiðréttið eftirfarandi upplýsingar ef þörf er á',
      description: `Applicant description`,
    },
  }),
  labels: defineMessages({
    name: {
      id: 'aa.application:applicant.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'aa.application:applicant.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'aa.application:applicant.labels.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    postalCode: {
      id: 'aa.application:applicant.labels.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'aa.application:applicant.labels.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'aa.application:applicant.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'aa.application:applicant.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    alertMessage: {
      id: 'aa.application:applicant.labels.alertMessage',
      defaultMessage:
        'Ef netfang og símanúmer er ekki rétt hér að ofan þá verður að breyta þeim upplýsingum á mínum síðum Ísland.is og opna nýja umsókn.',
      description: 'Applicant alert message',
    },
    alertMessageLink: {
      id: 'aa.application:applicant.labels.alertMessageLink',
      defaultMessage: '/minarsidur',
      description: 'Link for mínar síður',
    },
    alertMessageLinkTitle: {
      id: 'aa.application:applicant.labels.alertMessageLinkTitle',
      defaultMessage: 'Fara á mínar síður',
      description: 'title for mínar síður link',
    },
    checkboxLabel: {
      id: 'aa.application:applicant.labels.checkboxLabel',
      defaultMessage: 'Dvalarstaður ef annar en lögheimili',
      description: 'Checkbox label for applicant information',
    },
    postalCodeAndCity: {
      id: 'aa.application:applicant.labels.postalCodeAndCity',
      defaultMessage: 'Póstnúmer og staður',
      description: 'Postal code and city label for applicant information',
    },
    nationalAddress: {
      id: 'aa.application:applicant.labels.nationalAddress',
      defaultMessage: 'Ríkisfang',
      description: 'National address label for applicant information',
    },
    passwordMessage: {
      id: 'aa.application:applicant.labels.passwordMessage',
      defaultMessage:
        'Vinsamlegast veljið lykilorð vegna mögulegra símasamskipta. Lykilorð verður að vera minnst 4 stafir, tölustafir og/eða bókstafir.',
      description: 'Password message for applicant information',
    },
    password: {
      id: 'aa.application:applicant.labels.password',
      defaultMessage: 'Lykilorð',
      description: 'Password label for applicant information',
    },
    passwordPlaceholder: {
      id: 'aa.application:applicant.labels.passwordPlaceholder',
      defaultMessage: '123ABC',
      description: 'Password placeholder for applicant information',
    },
  }),
}
