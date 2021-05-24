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
  disclaimerSection: defineMessages({
    title: {
      id: 'pa.application:disclaimerSection.title',
      defaultMessage: 'Skilmálar',
      description: 'Title of disclaimer section',
    },
    subtitle: {
      id: 'pa.application:disclaimerSection.subtitle',
      defaultMessage: 'Eftirfarandi gildir um söfnun meðmælenda',
      description: 'Subtitle of disclaimer section',
    },
    descriptionPt1: {
      id: 'pa.application:disclaimerSection.descrtipion.p1',
      defaultMessage:
        'Eingöngu Þjóðskrá Íslands og yfirkjörstjórnir hafa aðgang  að söfnun meðmælanna ásamt þeim stjórnmálaflokki sem stofnar viðkomandi söfnun. Óheimilt er að dreifa meðmælunum eða þeim upplýsingum sem þar koma fram.',
      description: 'Description part one',
    },
    checkboxLabel: {
      id: 'pa.application:disclaimerSection.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér framangreint',
      description: 'Checkbox label',
    },
  }),
  overviewSection: defineMessages({
    title: {
      id: 'pa.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview title',
    },
    description: {
      id: 'pa.application:overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Overview description',
    },
    subtitle: {
      id: 'pa.application:overview.subtitle',
      defaultMessage: 'Upplýsingar um meðmælendalista',
      description: 'Overview subtitle',
    },
    partyType: {
      id: 'pa.application:overview.party.type',
      defaultMessage: 'Tegund framboðs',
      description: 'Type of party',
    },
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
    signatureCount: {
      id: 'pa.application:overview.signature.count',
      defaultMessage: 'Fjöldi meðmælenda',
      description: 'Signatures count',
    },
    signaturesInvalid: {
      id: 'pa.application:endorsementListSubmission.signaturesInvalid',
      defaultMessage:
        'Ekki er hægt að sannreyna að meðmæli uppfylli skilyrði yfirkjörstjórnar',
      description: 'Warning message for invalid endorsements',
    },
    signaturesInvalidTitle: {
      id: 'pa.application:overview.signatures.invalid',
      defaultMessage: 'Fjöldi meðmælenda í vafa',
      description: 'Invalid signatures count',
    },
    emailLabel: {
      id: 'pa.application:overview.email.label',
      defaultMessage: 'Tengiliðaupplýsingar',
      description: 'Label for email field',
    },
    emailPlaceholder: {
      id: 'pa.application:overview.email.placeholder',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Placeholder for email field',
    },
    submitButton: {
      id: 'pa.application:overview.submit',
      defaultMessage: 'Hefja söfnun',
      description: 'Submit button title',
    },
    submitApplication: {
      id: 'pa.application:overview.submit.application',
      defaultMessage: 'Skila meðmælum',
      description: 'Submit application',
    },
  }),
  endorsementList: defineMessages({
    title: {
      id: 'pa.application:endorsementList.title',
      defaultMessage: 'Safna meðmælum',
      description: 'Gather signatures title',
    },
    description: {
      id: 'pa.application:endorsementList.description',
      defaultMessage: '',
      description: 'Gather signatures description',
    },
    copyLinkButton: {
      id: 'pa.application:endorsementList.copylink',
      defaultMessage: 'Afrita tengil',
      description: 'Copy link title',
    },
    nameCount: {
      id: 'pa.application:endorsementList.name.count',
      defaultMessage: 'nafn á lista (af 500)',
      description: 'X name on list',
    },
    namesCount: {
      id: 'pa.application:endorsementList.names.count',
      defaultMessage: 'nöfn á lista (af 500)',
      description: 'X names on list',
    },
    invalidSignatures: {
      id: 'pa.application:endorsementList.invalid.signatures',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Only show invalid signatures',
    },
    searchbar: {
      id: 'pa.application:endorsementList.search',
      defaultMessage: 'Leitaðu hér',
      description: 'Searchbar placeholder',
    },
    thDate: {
      id: 'pa.application:endorsementList.th.date',
      defaultMessage: 'Dags skráð',
      description: 'Table header date',
    },
    thName: {
      id: 'pa.application:endorsementList.th.name',
      defaultMessage: 'Nafn',
      description: 'Table header name',
    },
    thNationalNumber: {
      id: 'pa.application:endorsementList.th.nationalnumber',
      defaultMessage: 'Kennitala',
      description: 'Table header national number',
    },
    thAddress: {
      id: 'pa.application:endorsementList.th.address',
      defaultMessage: 'Heimilisfang',
      description: 'Table header address',
    },
    signatureInvalid: {
      id: 'pa.application:endorsementList.invalid',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Invalid signatures message',
    },
  }),
  endorsementListSubmission: defineMessages({
    title: {
      id: 'pa.application:endorsementListSubmission.title',
      defaultMessage: 'Veljið meðmæli til innsendingar',
      description: 'Choose endorsements to be sent',
    },
    shortTitle: {
      id: 'pa.application:endorsementListSubmission.title',
      defaultMessage: 'Innsending',
      description: 'Choose endorsements to be sent',
    },
    description: {
      id: 'pa.application:endorsementListSubmission.description',
      defaultMessage:
        'Fjöldi meðmælenda skal vera margfeldi af þingsætatölu kjördæmisins og talnanna 30 að lágmarki og 40 að hámarki.',
      description: 'Choose endorsements description',
    },
    invalidEndorsement: {
      id: 'pa.application:endorsementListSubmission.invalidEndorsement',
      defaultMessage:
        'Ekki er hægt að sannreyna að meðmæli uppfylli skilyrði yfirkjörstjórnar',
      description: 'Warning message for invalid endorsements',
    },
    selectAuto: {
      id: 'pa.application:endorsementListSubmission.selectAuto',
      defaultMessage: 'Senda inn fyrstu ',
      description: 'Radio button title for auto selecting endorsements',
    },
    selectRandom: {
      id: 'pa.application:endorsementListSubmission.chooseRandom',
      defaultMessage: 'Valið af handahófi',
      description: 'Radio button title for selecting random endorsements',
    },
    chosenEndorsements: {
      id: 'pa.application:endorsementListSubmission.chosenEndorsements',
      defaultMessage: 'Fjöldi atkvæða valin:',
      description: 'Chosen endorsements',
    },
    warningMessageTitleHigh: {
      id: 'pa.application:endorsementListSubmission.warningMessageTitleHigh',
      defaultMessage: 'Leyfilegur fjöldi meðmæla of mikill',
      description: 'Warning message title when nr of endorsements is too high',
    },
    warningMessageTitleLow: {
      id: 'pa.application:endorsementListSubmission.warningMessageTitleLow',
      defaultMessage: 'Leyfilegur fjöldi meðmæla of lítill',
      description: 'Warning message title when nr of endorsements is too low',
    },
    warningMessagePt1: {
      id: 'pa.application:endorsementListSubmission.warningMessagePt1',
      defaultMessage: 'Fjöldi í þessu kjördæmi þarf að vera á milli ',
      description: 'Warning message',
    },
    warningMessagePt2: {
      id: 'pa.application:endorsementListSubmission.warningMessagePt2',
      defaultMessage: '. Afhakaðu í réttan fjölda til að skila lista.',
      description: 'Warning message',
    },
  }),
  applicationApproved: defineMessages({
    title: {
      id: 'pa.application:application.approved.title',
      defaultMessage: 'Meðmælendalista hefur verið skilað.',
      description: 'Title for conlcusion',
    },
    approvedTitle: {
      id: 'pa.application:application.approved.card.title',
      defaultMessage:
        'Meðmælendalista hefur verið skilað til yfirkjörstjórnar.',
      description: 'Title for approved card',
    },
    approvedSubtitle: {
      id: 'pa.application:application.approved.card.subtitle',
      defaultMessage:
        'Staðfesting á móttöku verður send í pósthólf á Mínum síðum. Frekari upplýsingar veitir viðkomandi yfirkjörstjórn.',
      description: 'Subtitle for approved card',
    },
    bulletListTitle: {
      id: 'pa.application:application.approved.card.bulletListTitle',
      defaultMessage: 'Vert að skoða',
      description: 'Title for bullet point list',
    },
    bulletLink1: {
      id: 'pa.application:application.approved.card.bulletLink1',
      defaultMessage:
        'https://www.stjornarradid.is/raduneyti/domsmalaraduneytid/',
      description: 'Link to Vefur dómsmálaráðuneytis',
    },
    bulletLink1Title: {
      id: 'pa.application:application.approved.card.bulletLink1Title',
      defaultMessage: 'Vefur dómsmálaráðuneytis',
      description: 'Link title',
    },
    bulletLink2: {
      id: 'pa.application:application.approved.card.bulletLink2',
      defaultMessage: 'https://www.stjornarradid.is/verkefni/kosningar/',
      description: 'Link to kosning.is',
    },
    bulletLink2Title: {
      id: 'pa.application:application.approved.card.bulletLink2Title',
      defaultMessage: 'kosning.is',
      description: 'Link title',
    },
  }),
  collectEndorsements: defineMessages({
    applicationTitle: {
      id: 'pa.application:collect.applicationtitle',
      defaultMessage: 'Framboð í kjördæmi',
      description: 'Title for collect signatures application',
    },
    stepTitle: {
      id: 'pa.application:collect.steptitle',
      defaultMessage: 'Samþykkja',
      description: 'Title for section step',
    },
    sectionTitle: {
      id: 'pa.application:collect.secitontitle',
      defaultMessage: 'Listabókstafs meðmælendalisti',
      description:
        'Partial title for section, party letter will be added programmatically',
    },
    nameInput: {
      id: 'pa.application:collect.name.input',
      defaultMessage: 'Nafn',
      description: 'Label and placeholder for name input field',
    },
    descriptionPt1: {
      id: 'ppale.application:collect.descripton.pt.one',
      defaultMessage:
        'Með því að mæla með úthlutun tiltekins listabókstafs til tilgreinds stjórnamálaflokks samþykkir þú að viðkomandi stjórnmálaflokkur, dómsmálaráðuneytið og Þjóðskrá Íslands fái aðgang að þeim upplýsingum sem skráðar eru. Þeir aðilar hafa ekki heimild til að miðla þeim upplýsingum frekar.',
      description: 'Disclaimer description, first paragraph',
    },
    descriptionPt2: {
      id: 'pa.application:collect.descripton.pt.two',
      defaultMessage:
        'Þjóðskrá Íslands er heimilt, að beiðni dómsmálaráðuneytisins, að samkeyra meðmælendalistann við þjóðskrá að fullnægðum heimildum laga um persónuvernd og vinnslu persónuupplýsinga gilda hverju sinni.',
      description: 'Disclaimer description, second paragraph',
    },
    agreeTermsLabel: {
      id: 'pa.application:collect.agree.label',
      defaultMessage: 'Ég hef kynnt mér framangreint',
      description: 'Label for terms and conditions',
    },
    submitButton: {
      id: 'pa.application:collect.submit.button',
      defaultMessage: 'Setja nafn mitt á lista',
      description: 'Title for submit button',
    },
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
  endorsementDisclaimer: defineMessages({
    title: {
      id: 'pa.application:endorsement.disclaimer.title',
      defaultMessage: 'Meðmæli með framboðslista',
      description: 'Title for signature disclaimer',
    },
    messagePt1: {
      id: 'pa.application:endorsement.disclaimer.message.pt1',
      defaultMessage: 'Ég undirritaður kjósandi í',
      description: 'Part 1 of signature disclaimer',
    },
    messagePt2: {
      id: 'pa.application:endorsement.disclaimer.message.pt2',
      defaultMessage:
        'lýsi hér með yfir stuðningi eftirfarandi lista vegna alþingiskosninganna 25. september 2021.',
      description: 'Part 2 of signature disclaimer',
    },
    descriptionPt1: {
      id: 'pa.application:endorsement.disclaimer.description.pt1',
      defaultMessage:
        'Með því að mæla með framboði tiltekinna stjórnmálasamtaka til tilgreinds kjördæmis samþykkir þú að viðkomandi stjórnmálaflokkur, dómsmálaráðuneytið og Þjóðskrá Íslands fái aðgang að þeim upplýsingum sem skráðar eru. Þeir aðilar hafa ekki heimild til að miðla þeim upplýsingum frekar.',
      description: 'Part 1 of message disclaimer',
    },
    descriptionPt2: {
      id: 'pa.application:endorsement.disclaimer.description.pt2',
      defaultMessage:
        'Þjóðskrá Íslands er heimilt, að beiðni dómsmálaráðuneytisins, að samkeyra meðmælendalistann við þjóðskrá að fullnægðum heimildum laga um persónuvernd og vinnslu persónuupplýsinga gilda hverju sinni.',
      description: 'Part 2 of message disclaimer',
    },
    partyLetter: {
      id: 'pa.application:endorsement.disclaimer.party.letter',
      defaultMessage: 'Listi',
      description: 'Label for party letter',
    },
    partyName: {
      id: 'pa.application:endorsement.disclaimer.party.name',
      defaultMessage: 'Stjórnmálasamtök',
      description: 'Label for party name',
    },
  }),
  endorsementApproved: defineMessages({
    title: {
      id: 'pa.application:endorsement.approved.title',
      defaultMessage: 'Staðfesting',
      description: 'Approved card title',
    },
    cardTitle: {
      id: 'pa.application:endorsement.approved.card.title',
      defaultMessage: 'Þú hefur verið skráður sem meðmælandi',
      description: 'Approved card title',
    },
    cardSubtitle: {
      id: 'pa.application:endorsement.approved.card.subtitle',
      defaultMessage: 'Hægt er að skoða virka lista undir ',
      description: 'Approved card subtitle',
    },
    myPagesButton: {
      id: 'pa.application:endorsement.approved.button.mypages',
      defaultMessage: 'Til baka á mínar síður',
      description: 'Button back to my pages',
    },
    partyListButton: {
      id: 'pa.application:endorsement.approved.button.partylist',
      defaultMessage: 'Skoða lista',
      description: 'Button to party list',
    },
  }),
  validation: defineMessages({
    selectConstituency: {
      id: 'pa.application:validation.select.constituency',
      defaultMessage: 'Vinsamlegast veldu kjördæmi',
      description: 'Select constituency',
    },
    approveTerms: {
      id: 'pa.application:validation.approve.terms',
      defaultMessage: 'Vinsamlegast samþykktu skilmála',
      description: 'Approve terms and conditions',
    },
  }),
  logo: defineMessages({
    imgAlt: {
      id: 'pa.application:logo.img.alt',
      defaultMessage: 'Skjaldamerkið',
      description: 'Alt for image',
    },
    service: {
      id: 'pa.application:logo.service',
      defaultMessage: 'Þjónustuaðili',
      description: 'Service for',
    },
    organization: {
      id: 'pa.application:logo.organization',
      defaultMessage: 'Dómsmálaráðuneytið',
      description: 'Name of organization',
    },
  }),
  supremeCourt: defineMessages({
    title: {
      id: 'pa.application:supreme.court.title',
      defaultMessage: 'Yfirkjörstjórn',
      description: 'Supreme court review title',
    },
    description: {
      id: 'pa.application:supreme.court.description',
      defaultMessage:
        'Vinsamlegast farðu yfir upplýsingarnar hér að neðan og staðfestu að þær séu réttar.',
      description: 'Supreme court review description',
    },
    subtitle: {
      id: 'pa.application:supreme.court.subtitle',
      defaultMessage: 'Yfirlit yfir framboðslista',
      description: 'Supreme court review subtitle',
    },
    steps: {
      id: 'pa.application:supreme.court.steps',
      defaultMessage: 'Til skoðunar',
      description: 'Title for steps',
    },
    step1: {
      id: 'pa.application:supreme.court.step.1',
      defaultMessage: 'Yfirlit framboðs',
      description: 'Step one',
    },
    partyNameLabel: {
      id: 'pa.application:supreme.court.partyname.label',
      defaultMessage: 'Nafn flokks',
      description: 'Label for party name',
    },
    partyLetterLabel: {
      id: 'pa.application:supreme.court.partyletter.label',
      defaultMessage: 'Listabókstafur',
      description: 'Label for party letter',
    },
    responsiblePersonLabel: {
      id: 'pa.application:supreme.court.responsibleperson.label',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Label for responsible person',
    },
    typeOfEndorsementLabel: {
      id: 'pa.application:supreme.court.endorsementtype.label',
      defaultMessage: 'Tegund framboðs',
      description: 'Label for endorsement type',
    },
    numberOfEndorsementsLabel: {
      id: 'pa.application:supreme.court.no.endorsements.label',
      defaultMessage: 'Fjöldi meðmæla',
      description: 'Label for number of endorsements',
    },
    constituencyLabel: {
      id: 'pa.application:supreme.court.constituency.label',
      defaultMessage: 'Kjördæmi',
      description: 'Label for constituency',
    },
    commentsLabel: {
      id: 'pa.application:supreme.court.comments.label',
      defaultMessage: 'Athugasemdir',
      description: 'Label for comments',
    },
    csvButton: {
      id: 'pa.application:supreme.court.csv.button',
      defaultMessage: 'Hlaða niður atkvæðum',
      description: 'Download endorsements button',
    },
    noEndorsementsMessage: {
      id: 'pa.application:supreme.court.no.endorsements',
      defaultMessage: 'Umsækjandi hefur ekki skilað inn neinum meðmælum',
      description:
        'Message that will appear in the .csv file if there are no endorsements',
    },
    rejectButton: {
      id: 'pa.application:supreme.court.reject.button',
      defaultMessage: 'Hafna',
      description: 'Reject button',
    },
    approveButton: {
      id: 'pa.application:supreme.court.approve.button',
      defaultMessage: 'Samþykkja lista',
      description: 'Approve button',
    },
    approvedTitle: {
      id: 'pa.application:supreme.court.approved.title',
      defaultMessage: 'Takk fyrir',
      description: 'Title for approved screen',
    },
    approvedDescription: {
      id: 'pa.application:supreme.court.approved.description',
      defaultMessage:
        'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
      description: 'Text after supreme court has submitted',
    },
  }),
}
