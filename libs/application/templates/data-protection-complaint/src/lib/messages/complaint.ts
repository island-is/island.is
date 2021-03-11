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
    subjectOfComplaintPageTitle: {
      id: 'dpac.application:section.complaint.subjectOfComplaintPageTitle',
      defaultMessage: 'Efni kvörtunar',
      description: 'Subject of complaint page title',
    },
    subjectOfComplaintPageDescription: {
      id:
        'dpac.application:section.complaint.subjectOfComplaintPageDescription',
      defaultMessage: `Vantar texta`,
      description: 'Subject of complaint page description',
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
    subjectPersonalInformation: {
      id:
        'dpac.application:section.complaint.labels.subjectPersonalInformation',
      defaultMessage: 'Vinnsla persónuupplýsinga',
      description: 'The subject regards the processing of personal information',
    },
    subjectAuthorities: {
      id: 'dpac.application:section.complaint.labels.subjectAuthorities',
      defaultMessage: 'Hjá stjórnvöldum',
      description: 'The subject of the complaint regards authorities',
    },
    subjectLackOfEducation: {
      id: 'dpac.application:section.complaint.labels.subjectLackOfEducation',
      defaultMessage: 'Skortur á fræðslu',
      description: 'The subject of the complaint regards lack of educatin',
    },
    subjectSocialMedia: {
      id: 'dpac.application:section.complaint.labels.subjectSocialMedia',
      defaultMessage: 'Á samfélagsmiðlum / smáforritum',
      description: 'The subject of the complaint regards social media',
    },
    subjectRequestForAccess: {
      id: 'dpac.application:section.complaint.labels.subjectRequestForAccess',
      defaultMessage: 'Beiðni um aðgang / eyðingu',
      description: 'The subject of the complaint regards request for access',
    },
    subjectRightOfObjection: {
      id: 'dpac.application:section.complaint.labels.subjectRightOfObjection',
      defaultMessage: 'Andmælaréttur ekki virtur',
      description: 'The subject of the complaint regards right of objection',
    },
    subjectUseOfPersonalInformation: {
      id:
        'dpac.application:section.complaint.labels.subjectUseOfPersonalInformation',
      defaultMessage: 'Notkun persónuupplýsinga',
      description:
        'The subject of the complaint regards use of personal information',
    },
    subjectEmail: {
      id: 'dpac.application:section.complaint.labels.subjectEmail',
      defaultMessage: 'Skráning / notkun á netfangi',
      description:
        'The subject of the complaint regards use of personal information',
    },
    subjectNationalId: {
      id: 'dpac.application:section.complaint.labels.subjectNationalId',
      defaultMessage: 'Notkun kennitölu',
      description: 'The subject of the complaint regards use of national id',
    },
    subjectEmailInWorkplace: {
      id: 'dpac.application:section.complaint.labels.subjectEmailInWorkplace',
      defaultMessage: 'Notkun tölvupósthólf á vinnustað / skóla',
      description:
        'The subject of the complaint regards use of email at workplace or school',
    },
    subjectUnauthorizedPublication: {
      id:
        'dpac.application:section.complaint.labels.subjectUnauthorizedPublication',
      defaultMessage: 'Birting án heimildar',
      description:
        'The subject of the complaint regards unauthorized publication',
    },
    subjectOther: {
      id: 'dpac.application:section.complaint.labels.subjectOther',
      defaultMessage: 'Annað',
      description: 'The subject of the complaint regards something else',
    },
    subjectVanskilaskra: {
      id: 'dpac.application:section.complaint.labels.subjectVanskilaskra',
      defaultMessage: 'Vanskilaskrá / lánshæfismat',
      description:
        'The subject of the complaint regards vanskilaskra or lanshaefismat',
    },
    subjectVideoRecording: {
      id: 'dpac.application:section.complaint.labels.subjectVideoRecording',
      defaultMessage: 'Eftirlitsmyndavélar, upptökur eða önnur vöktun ',
      description: 'The subject of the complaint regards video recordings',
    },
    subjectOtherOther: {
      id: 'dpac.application:section.complaint.labels.subjectOtherOther',
      defaultMessage: 'Annað...',
      description: 'The subject of the complaint regards none of the above',
    },
    subjectSomethingElse: {
      id: 'dpac.application:section.complaint.labels.subjectSomethingElse',
      defaultMessage: 'Hvað varðar kvörtunin',
      description: 'Subject Something else field label',
    },
    subjectSomethingElsePlaceholder: {
      id:
        'dpac.application:section.complaint.labels.subjectSomethingElsePlaceholder',
      defaultMessage: 'Útskýrðu í stuttu máli',
      description: 'Explain shortly',
    },
  }),
}
