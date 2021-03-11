import { defineMessages } from 'react-intl'

export const complaint = {
  general: defineMessages({
    complaineePageTitle: {
      id: 'dpac.application:section.complaint.complaineePageTitle',
      defaultMessage:
        'Fyrirtæki, stofnun eða einstaklingur sem kvartað er yfir',
      description: 'Complainee page title',
    },
    complaineePageDescription: {
      id: 'dpac.application:section.complaint.complaineePageDescription',
      defaultMessage: `Vinsamlegast athugið að þegar kvörtun er tekin til
      meðferðar er gagnaðila tilkynnt um að borist hafi kvörtun frá tilteknum
      nafngreindum aðila og honum gefinn kostur á að koma áframfæri andmælum sínum.
      Kvartanda er einnig gefið færi á að koma að athugasemdum við andmæli
      þess sem kvartað er yfir. Svarfrestur málsaðila er að jafnaði þrjár vikur. `,
      description: 'Complainee page description',
    },
  }),
  labels: defineMessages({
    complaineeName: {
      id: 'dpac.application:section.complaint.labels.complaineeName',
      defaultMessage: 'Nafn þess sem kvartað er yfir',
      description: 'The name of the one being complained about',
    },
    complaineeAddress: {
      id: 'dpac.application:section.complaint.labels.complaineeAddress',
      defaultMessage: 'Heimilisfang þess sem kvartað er yfir',
      description: 'The address of the one being complained about',
    },
    complaineeNationalId: {
      id: 'dpac.application:section.complaint.labels.complaineeNationalId',
      defaultMessage: 'Kennitala þess sem kvartað er yfir',
      description: 'The national id of the one being complained about',
    },
    complaineeInfoLabel: {
      id: 'dpac.application:section.complaint.labels.complaineeInfoLabel',
      defaultMessage: 'Upplýsingar um þann sem kvartað er yfir',
      description: 'Complainee Info Label',
    },
    complaineeOperatesWithinEurope: {
      id:
        'dpac.application:section.complaint.labels.complaineeOperatesWithinEurope',
      defaultMessage:
        'Veistu hvort viðkomandi aðili er með starfsemi í öðru landi innan Evrópu? ',
      description:
        'Does the complainee operate within in another country within Europe?',
    },
    complaineeCountryOfOperation: {
      id:
        'dpac.application:section.complaint.labels.complaineeCountryOfOperation',
      defaultMessage:
        'Í hvaða öðru landi innan Evrópu er viðkomandi aðili með starfsemi',
      description: 'Complainee country of operation',
    },
    complaineeOperatesWithinEuropeMessage: {
      id:
        'dpac.application:section.complaint.labels.complaineeOperatesWithinEuropeMessage',
      defaultMessage:
        'Ath. Ef viðkomandi aðili er með starfsemi í öðru landi getur úrvinnsla umsóknar dregist um 4-6 mánuði.',
      description: 'Notifies the user that the response might take longer',
    },
    complaineeAddPerson: {
      id: 'dpac.application:section.complaint.labels.complaineeAddPerson',
      defaultMessage: 'Beinist kvörtunin að fleiri aðilum?',
      description: 'Does the complaint regard other people',
    },
    complaineeAdd: {
      id: 'dpac.application:section.complaint.labels.complaineeAdd',
      defaultMessage: 'Bæta við aðila',
      description: 'Add other complainees',
    },
  }),
}
