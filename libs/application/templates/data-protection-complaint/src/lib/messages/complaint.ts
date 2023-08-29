import { defineMessages } from 'react-intl'

enum SubjectOfComplaint {
  WITH_AUTHORITIES = 'withAuthorities',
  LACK_OF_EDUCATION = 'lackOfEducation',
  SOCIAL_MEDIA = 'socialMedia',
  REQUEST_FOR_ACCESS = 'requestForAccess',
  RIGHTS_OF_OBJECTION = 'rightOfObjection',
  EMAIL = 'email',
  NATIONAL_ID = 'nationalId',
  EMAIL_IN_WORKPLACE = 'emailInWorkplace',
  UNAUTHORIZED_PUBLICATION = 'unauthorizedPublication',
  VANSKILASKRA = 'vanskilaskra',
  VIDEO_RECORDINGS = 'videoRecordings',
  OTHER = 'other',
}

export const complaint = {
  general: defineMessages({
    complaineePageTitle: {
      id: 'dpac.application:section.complaint.complaineePageTitle',
      defaultMessage:
        'Upplýsingar um fyrirtæki, stofnun eða einstakling sem kvartað er yfir',
      description: 'Complainee page title',
    },
    complaineePageDescription: {
      id: 'dpac.application:section.complaint.complaineePageDescription',
      defaultMessage: `Stjörnumerkta reiti þarf að fylla út. Annað er valkvætt.`,
      description: 'Complainee page description',
    },
    subjectOfComplaintPageTitle: {
      id: 'dpac.application:section.complaint.subjectOfComplaintPageTitle',
      defaultMessage: 'Efni kvörtunar',
      description: 'Subject of complaint page title',
    },
    subjectOfComplaintPageDescription: {
      id: 'dpac.application:section.complaint.subjectOfComplaintPageDescription',
      defaultMessage: `Merktu við allt sem á við um kvörtunina þína.
      Upplýsingar um efni kvörtunarinnar hjálpa Persónuvernd að setja
      málið í réttan farveg hjá stofnuninni og geta flýtt fyrir afgreiðslu þess.`,
      description: 'Subject of complaint page description',
    },
    complaintPageTitle: {
      id: 'dpac.application:section.complaint.complaintPageTitle',
      defaultMessage: 'Kvörtun',
      description: 'complaint page title',
    },
    complaintPageDescription: {
      id: 'dpac.application:section.complaint.complaintPageDescription',
      defaultMessage: `Hér þarf að greina frá helstu málsatvikum og
      hvernig þú telur að hafi verið brotið á þér.
      Mikilvægt er að lýsingin sé skýr og hnitmiðuð.`,
      description: 'complaint page description',
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
      id: 'dpac.application:section.complaint.labels.complaineeOperatesWithinEurope',
      defaultMessage:
        'Er viðkomandi aðili með starfsemi í öðru landi innan Evrópska efnahagssvæðisins?',
      description:
        'Does the complainee operate within in another country within Europe?',
    },
    complaineeCountryOfOperation: {
      id: 'dpac.application:section.complaint.labels.complaineeCountryOfOperation',
      defaultMessage: 'Í hvaða landi/löndum?',
      description: 'Complainee country of operation',
    },
    complaineeOperatesWithinEuropeMessage: {
      id: 'dpac.application:section.complaint.labels.complaineeOperatesWithinEuropeMessage',
      defaultMessage:
        'Ef viðkomandi aðili er með starfsemi í öðru landi getur afgreiðslutími kvörtunarinnar lengst um a.m.k. 4-6 mánuði.',
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
      id: 'dpac.application:section.complaint.labels.subjectPersonalInformation',
      defaultMessage: 'Vinnsla persónuupplýsinga',
      description: 'The subject regards the processing of personal information',
    },
    [SubjectOfComplaint.WITH_AUTHORITIES]: {
      id: 'dpac.application:section.complaint.labels.subjectAuthorities',
      defaultMessage: 'Vinnsla persónuupplýsinga hjá stjórnvöldum',
      description: 'The subject of the complaint regards authorities',
    },
    [SubjectOfComplaint.LACK_OF_EDUCATION]: {
      id: 'dpac.application:section.complaint.labels.subjectLackOfEducation',
      defaultMessage: 'Skortur á fræðslu',
      description: 'The subject of the complaint regards lack of educatin',
    },
    [SubjectOfComplaint.SOCIAL_MEDIA]: {
      id: 'dpac.application:section.complaint.labels.subjectSocialMedia',
      defaultMessage:
        'Vinnsla persónuupplýsinga á samfélagsmiðlum eða í smáforritum (öppum)',
      description: 'The subject of the complaint regards social media',
    },
    [SubjectOfComplaint.REQUEST_FOR_ACCESS]: {
      id: 'dpac.application:section.complaint.labels.subjectRequestForAccess',
      defaultMessage: 'Afgreiðsla á beiðni um aðgang eða eyðingu',
      description: 'The subject of the complaint regards request for access',
    },
    [SubjectOfComplaint.RIGHTS_OF_OBJECTION]: {
      id: 'dpac.application:section.complaint.labels.subjectRightOfObjection',
      defaultMessage: 'Andmælaréttur ekki virtur',
      description: 'The subject of the complaint regards right of objection',
    },
    subjectUseOfPersonalInformation: {
      id: 'dpac.application:section.complaint.labels.subjectUseOfPersonalInformation',
      defaultMessage: 'Notkun persónuupplýsinga',
      description:
        'The subject of the complaint regards use of personal information',
    },
    [SubjectOfComplaint.EMAIL]: {
      id: 'dpac.application:section.complaint.labels.subjectEmail',
      defaultMessage: 'Skráning eða notkun á netfangi',
      description:
        'The subject of the complaint regards use of personal information',
    },
    [SubjectOfComplaint.NATIONAL_ID]: {
      id: 'dpac.application:section.complaint.labels.subjectNationalId',
      defaultMessage: 'Notkun kennitölu',
      description: 'The subject of the complaint regards use of national id',
    },
    [SubjectOfComplaint.EMAIL_IN_WORKPLACE]: {
      id: 'dpac.application:section.complaint.labels.subjectEmailInWorkplace',
      defaultMessage: 'Meðferð tölvupósts/pósthólfs á vinnustað eða í skóla',
      description:
        'The subject of the complaint regards use of email at workplace or school',
    },
    [SubjectOfComplaint.UNAUTHORIZED_PUBLICATION]: {
      id: 'dpac.application:section.complaint.labels.subjectUnauthorizedPublication',
      defaultMessage: 'Birting persónuupplýsinga án heimildar',
      description:
        'The subject of the complaint regards unauthorized publication',
    },
    subjectOther: {
      id: 'dpac.application:section.complaint.labels.subjectOther',
      defaultMessage: 'Annað',
      description: 'The subject of the complaint regards something else',
    },
    [SubjectOfComplaint.VANSKILASKRA]: {
      id: 'dpac.application:section.complaint.labels.subjectVanskilaskra',
      defaultMessage: 'Vanskilaskrá eða lánshæfismat',
      description:
        'The subject of the complaint regards vanskilaskra or lanshaefismat',
    },
    [SubjectOfComplaint.VIDEO_RECORDINGS]: {
      id: 'dpac.application:section.complaint.labels.subjectVideoRecording',
      defaultMessage: 'Eftirlitsmyndavélar, upptökur eða önnur vöktun ',
      description: 'The subject of the complaint regards video recordings',
    },
    [SubjectOfComplaint.OTHER]: {
      id: 'dpac.application:section.complaint.labels.subjectOtherOther',
      defaultMessage: 'Annað',
      description: 'The subject of the complaint regards none of the above',
    },
    subjectSomethingElse: {
      id: 'dpac.application:section.complaint.labels.subjectSomethingElse',
      defaultMessage: 'Hvað varðar kvörtunin?',
      description: 'Subject Something else field label',
    },
    subjectSomethingElsePlaceholder: {
      id: 'dpac.application:section.complaint.labels.subjectSomethingElsePlaceholder',
      defaultMessage: 'Útskýrðu í stuttu máli',
      description: 'Explain shortly',
    },
    complaintDescription: {
      id: 'dpac.application:section.complaint.labels.complaintDescription',
      defaultMessage: 'Kvörtun',
      description: 'Complaint Description',
    },
    complaintDescriptionPlaceholder: {
      id: 'dpac.application:section.complaint.labels.complaintDescriptionPlaceholder',
      defaultMessage:
        '500 orð hámark. Ef þörf er á frekari skýringum er hægt að koma þeim á framfæri í fylgiskjali.',
      description: 'Complaint Description Placeholder',
    },
    complaintDescriptionLabel: {
      id: 'dpac.application:section.complaint.labels.complaintDescriptionLabel',
      defaultMessage: 'Yfir hverju er kvartað í meginatriðum?',
      description: 'Complaint Description Label',
    },
    complaintDocumentsTitle: {
      id: 'dpac.application:section.complaint.labels.complaintDocumentsTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Complaint Documents Title',
    },
    complaintDocumentsIntroduction: {
      id: 'dpac.application:section.complaint.labels.complaintDocumentsIntroduction',
      defaultMessage:
        'Vinsamlegast settu hér inn skjöl og önnur gögn sem eiga að fylgja kvörtuninni.',
      description: 'Complaint Documents Intro',
    },
    complaintDocumentsHeader: {
      id: 'dpac.application:section.complaint.labels.complaintDocumentsHeader',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Complaint Documents Header',
    },
    complaintDocumentsDescription: {
      id: 'dpac.application:section.complaint.labels.complaintDocumentsDescription',
      defaultMessage:
        'Tekið er við skjölum með endingunum: .pdf, .docx, .rtf, .jpg, png.',
      description: 'Complaint Documents Description',
    },
    complaintDocumentsButtonLabel: {
      id: 'dpac.application:section.complaint.labels.complaintDocumentsButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Complaint Documents Button Label',
    },
    complaintDocumentsInfoAlertMessageTitle: {
      id: 'dpac.application:section.complaint.labels.complaintDocumentsInfoAlertMessageTitle',
      defaultMessage: 'Athugið',
      description: 'Title of alert message in complaint screen',
    },
    complaintDocumentsInfoLabel: {
      id: 'dpac.application:section.complaint.labels.complaintDocumentsInfoLabel',
      defaultMessage:
        'Hafðu samband við Persónuvernd símleiðis eða í tölvupósti ef þú vilt senda inn myndbönd og/eða hljóðupptökur.',
      description:
        'Notifies the user that he should contact DPA if they want to send in images or videos',
    },
  }),
}
