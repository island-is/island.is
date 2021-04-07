import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  // Messages shared accross party application
  constituencySection: defineMessages({
    title: {
      id: 'pa.application:title',
      defaultMessage: 'Framboð í kjördæmi',
      description: 'Title of application',
    },
    selectConstituency: {
      id: 'pa.application:constituency.title',
      defaultMessage: 'Veldu kjördæmi',
      description: 'Title of constituency radio section',
    },
    confirmationTitle: {
      id: 'pa.application:confirmation.title',
      defaultMessage: 'Staðfesta',
      description: 'Title of confirmation step',
    },
    confirmation: {
      id: 'pa.application:confirmation',
      defaultMessage: 'Upplýsingar',
      description: 'Title of confirmation',
    },
    confirmationDescription: {
      id: 'pa.application:confirmation.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp fyrir nýja meðmælendalista.',
      description: 'Description of confirmation',
    },
  }),
  overviewSection: defineMessages({
    partyletter: {
      id: 'pa.application:overview.party.letter',
      defaultMessage: 'Listabókstafur',
      description: 'Party letter',
    },
    party: {
      id: 'pa.application:overview.party.name',
      defaultMessage: 'Heiti stjórmálaflokks',
      description: 'Party name',
    },
    responsiblePerson: {
      id: 'pa.application:overview.responsible.person',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Responsible person',
    },
    constituency: {
      id: 'pa.application:overview.constituency',
      defaultMessage: 'Kjördæmi',
      description: 'Selected constituency',
    },
    submitButton: {
      id: 'pa.application:overview.submit',
      defaultMessage: 'Hefja söfnun',
      description: 'Submit button title',
    },
  }),
  gatherSignatures: defineMessages({
    title: {
      id: 'pa.application:gatherSignatures.title',
      defaultMessage: 'Safna meðmælum',
      description: 'Gather signatures title',
    },
    description: {
      id: 'pa.application:gatherSignatures.description',
      defaultMessage: '',
      description: 'Gather signatures description',
    },
    copyLinkButton: {
      id: 'pa.application:gatherSignatures.copylink',
      defaultMessage: 'Afrita tengil',
      description: 'Copy link title',
    },
    nameCount: {
      id: 'pa.application:gatherSignatures.name.count',
      defaultMessage: 'nafn á lista (af 500)',
      description: 'X name on list',
    },
    namesCount: {
      id: 'pa.application:gatherSignatures.names.count',
      defaultMessage: 'nöfn á lista (af 500)',
      description: 'X names on list',
    },
    invalidSignatures: {
      id: 'pa.application:gatherSignatures.invalid.signatures',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Only show invalid signatures',
    },
    searchbar: {
      id: 'pa.application:gatherSignatures.search',
      defaultMessage: 'Leitaðu hér',
      description: 'Searchbar placeholder',
    },
    thDate: {
      id: 'pa.application:gatherSignatures.th.date',
      defaultMessage: 'Dags skráð',
      description: 'Table header date',
    },
    thName: {
      id: 'pa.application:gatherSignatures.th.name',
      defaultMessage: 'Nafn',
      description: 'Table header name',
    },
    thNationalNumber: {
      id: 'pa.application:gatherSignatures.th.nationalnumber',
      defaultMessage: 'Kennitala',
      description: 'Table header national number',
    },
    thAddress: {
      id: 'pa.application:gatherSignatures.th.address',
      defaultMessage: 'Heimilisfang',
      description: 'Table header address',
    },
    signatureInvalid: {
      id: 'pa.application:gatherSignatures.invalid',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Invalid signatures message',
    },
  }),
  recommendations: defineMessages({
    includePapers: {
      id: 'pa.application:recommendations.includePapers',
      defaultMessage: 'Ég ætla skila inn meðmælum á pappír*',
      description: 'Include paper signatures',
    },
    includePapersDisclaimerPt1: {
      id: 'pa.application:recommendations.includePapers.disclaimer1',
      defaultMessage:
        '*Fyrir meðmæli á pappír þarf að lista upp kennitölur meðmælenda í skjal og hlaða upp hér að neðan.',
      description: 'Include paper signatures disclaimer part 1',
    },
    includePapersDisclaimerPt2: {
      id: 'pa.application:recommendations.includePapers.disclaimer2',
      defaultMessage:
        '*Pappírsmeðmæli skulu einnig sendast með bréfpósti til yfirkjörstjórnar.',
      description: 'Include paper signatures disclaimer part 2',
    },
    noPaper: {
      id: 'pa.application:recommendations.paper.no',
      defaultMessage: 'Nei, ég er ekki með meðmælendur á pappír',
      description: 'No paper signatures',
    },
    yesPaper: {
      id: 'pa.application:recommendations.paper.yes',
      defaultMessage: 'Já, ég er með meðmælendur á pappír',
      description: 'Yes paper signatures',
    },
    fileUploadHeader: {
      id: 'pa.application:recommendations.fileupload.header',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Header for file upload',
    },
    uploadDescription: {
      id: 'pa.application:recommendations.fileupload.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .xlsx',
      description: 'Description for file upload',
    },
    uploadButtonLabel: {
      id: 'pa.application:recommendations.fileupload.label',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Label for file upload',
    },
  }),
}
