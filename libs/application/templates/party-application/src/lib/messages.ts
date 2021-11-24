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
        'Vinsamlegast farðu yfir upplýsingarnar hér að neðan til að staðfesta að þær séu réttar.',
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
      defaultMessage:
        'Eftirfarandi gildir um söfnun meðmæla fyrir framboðslista',
      description: 'Subtitle of disclaimer section',
    },
    descriptionPt1: {
      id: 'pa.application:disclaimerSection.descrtipion.p1',
      defaultMessage:
        'Vakin er athygli á lögum um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018. Yfirkjörstjórn ber ábyrgð á vinnslu persónuupplýsinga sem unnið er með.',
      description: 'Description part one',
    },
    descriptionPt2: {
      id: 'pa.application:disclaimerSection.descrtipion.p2',
      defaultMessage:
        'Óheimilt er að miðla meðmælunum eða þeim upplýsingum sem þar koma fram eða nota í öðrum tilgangi.',
      description: 'Description part one',
    },
    descriptionPt3: {
      id: 'pa.application:disclaimerSection.descrtipion.p3',
      defaultMessage:
        'Nánari upplýsingar um vinnsluna þ.á m. réttindi einsstaklinga má nálgast á persónuverndarstefnu Ísland.is ',
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
        'Vinsamlegast farðu yfir upplýsingarnar hér að neðan til að staðfesta að þær séu réttar.',
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
        'Ekki er hægt að sannreyna að meðmæli uppfylli lagaskilyrði',
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
      defaultMessage: 'Loka söfnun',
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
    namesCount: {
      id: 'pa.application:endorsementList.names.count',
      defaultMessage: 'meðmæli á lista',
      description: 'X names on list',
    },
    invalidSignatures: {
      id: 'pa.application:endorsementList.invalid.signatures',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Only show invalid signatures',
    },
    searchbar: {
      id: 'pa.application:endorsementList.search',
      defaultMessage: 'Leitaðu að nafni',
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
    signatureInvalidTooltip: {
      id: 'pa.application:endorsementList.tooltip',
      defaultMessage:
        'Meðmæli í vafa, yfirkjörstjórn þarf að yfirfara aldur, búsetu og kjördæmi',
      description: 'Invalid signature tooltip',
    },
    isClosedMessage: {
      id: 'pa.application:endorsement.form.isClosed.message',
      defaultMessage: 'Meðmælendalista hefur verið lokað',
      description: 'Error message if endorsement list has been closed',
    },
  }),
  endorsementListSubmission: defineMessages({
    title: {
      id: 'pa.application:endorsementListSubmission.title',
      defaultMessage: 'Veljið meðmæli til að senda yfirkjörstjórn',
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
        'Ekki er hægt að sannreyna að meðmæli uppfylli lagaskilyrði',
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
      defaultMessage: 'Fjöldi meðmæla valin:',
      description: 'Chosen endorsements',
    },
    warningMessageTitleHigh: {
      id: 'pa.application:endorsementListSubmission.warningMessageTitleHigh',
      defaultMessage: 'Meðmæli of mörg',
      description: 'Warning message title when nr of endorsements is too high',
    },
    warningMessageTitleLow: {
      id: 'pa.application:endorsementListSubmission.warningMessageTitleLow',
      defaultMessage: 'Meðmæli of fá',
      description: 'Warning message title when nr of endorsements is too low',
    },
    warningMessagePt1: {
      id: 'pa.application:endorsementListSubmission.warningMessagePt1',
      defaultMessage: 'Fjöldi meðmæla í þessu kjördæmi þarf að vera á milli ',
      description: 'Warning message',
    },
    warningMessagePt2: {
      id: 'pa.application:endorsementListSubmission.warningMessagePt2',
      defaultMessage: '. Hakaðu í réttan fjölda til að skila lista.',
      description: 'Warning message',
    },
  }),
  applicationApproved: defineMessages({
    title: {
      id: 'pa.application:application.approved.title',
      defaultMessage: 'Meðmælendalista hefur verið skilað',
      description: 'Title for conlcusion',
    },
    approvedTitle: {
      id: 'pa.application:application.approved.card.title',
      defaultMessage: 'Meðmælendalista hefur verið skilað til yfirkjörstjórnar',
      description: 'Title for approved card',
    },
    approvedSubtitle: {
      id: 'pa.application:application.approved.card.subtitle',
      defaultMessage: 'Frekari upplýsingar veitir viðkomandi yfirkjörstjórn.',
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
      defaultMessage:
        'https://www.stjornarradid.is/verkefni/kosningar/althingiskosningar/frambod-leidbeiningar/listabokstafir/',
      description: 'Link to kosning.is',
    },
    bulletLink2Title: {
      id: 'pa.application:application.approved.card.bulletLink2Title',
      defaultMessage: 'kosning.is',
      description: 'Link title',
    },
  }),
  applicationApprovedOverview: defineMessages({
    title: {
      id: 'pa.application:application.approved.title',
      defaultMessage: 'Umsokn samþykkt',
      description: 'Title for overview',
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
      id: 'pa.application:collect.descripton.pt.one',
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
        '*Fyrir meðmæli sem safnað hefur verið á pappír þarf að skrá kennitölu meðmælenda í excel skrá og hlaða upp hér að neðan.',
      description: 'Include paper signatures disclaimer part 1',
    },
    includePapersDisclaimerPt2: {
      id: 'pa.application:recommendations.includePapers.disclaimer2',
      defaultMessage:
        '*Excel skráin skal innihalda eina kennitölu í reit. Allar kennitölur skulu vera í fyrsta dálki (dálkur A), fyrsta kennitalan skal vera staðsett í reit A1.',
      description: 'Include paper signatures disclaimer part 2',
    },
    includePapersDisclaimerPt3: {
      id: 'pa.application:recommendations.includePapers.disclaimer3',
      defaultMessage:
        '*Frumrit meðmæla sem safnað hefur verið á pappír skulu afhent yfirkjörstjórn.',
      description: 'Include paper signatures disclaimer part 3',
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
    uploadSuccess: {
      id: 'pa.application:uploadButton.uploadSuccess',
      defaultMessage: 'Pappírsmeðmælum hefur verið hlaðið upp!',
      description: 'Upload succeeded text',
    },
    uploadFail: {
      id: 'pa.application:uploadButton.uploadSuccess',
      defaultMessage: 'Ekki tókst að hlaða upp pappírsmeðmælum',
      description: 'Upload failed text',
    },
    attention: {
      id: 'pa.application:uploadButton.attention',
      defaultMessage: 'Athugið!',
      description: 'Warning title',
    },
    uploadWarningText: {
      id: 'pa.application:uploadButton.warningDescription',
      defaultMessage: 'Ekki tókst að hlaða upp eftirfarandi kennitölur: ',
      description: 'Warning description',
    },
  }),
  endorsementDisclaimer: defineMessages({
    title: {
      id: 'pa.application:endorsement.disclaimer.title',
      defaultMessage: 'Mæla með framboðslista',
      description: 'Title for signature disclaimer',
    },
    messagePt1: {
      id: 'pa.application:endorsement.disclaimer.message.pt1',
      defaultMessage: 'Ég kjósandi í',
      description: 'Part 1 of signature disclaimer',
    },
    messagePt2: {
      id: 'pa.application:endorsement.disclaimer.message.pt2',
      defaultMessage:
        'lýsi hér með yfir stuðningi við neðangreindan lista vegna alþingiskosninganna 25.september 2021.',
      description: 'Part 2 of signature disclaimer',
    },
    descriptionPt1: {
      id: 'pa.application:endorsement.disclaimer.description.pt1',
      defaultMessage:
        'Yfirkjörstjórn og þau stjórnmálasamtök sem stofnað hafa söfnunina hafa aðgang að upplýsingum sem skráðar eru á meðmælendalistann, þ.e. nafni, kennitölu og heimilsfangi meðmælandans og að meðmælandi hafi mælt með tilteknum framboðslista. Óheimilt er að miðla meðmælum eða þeim upplýsingum sem þar koma fram eða nota í öðrum tilgangi.',
    },
    descriptionPt2: {
      id: 'pa.application:endorsement.disclaimer.description.pt2',
      defaultMessage:
        'Þjóðskrá Íslands er heimilt skv. beiðni yfirkjörstjórnar að sannreyna upplýsingar úr meðmælendalista við þjóðskrá að fullnægðum heimildum laga um persónuvernd og vinnslu persónuupplýsinga.',
      description: 'Part 2 of message disclaimer',
    },
    descriptionPt3: {
      id: 'pa.application:endorsement.disclaimer.description.pt3',
      defaultMessage:
        'Nánari upplýsingar um vinnsluna þ.á m. réttindi einsstaklinga má nálgast á persónuverndarstefnu Island.is',
      description: 'Part 3 of message disclaimer',
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
    alertMessageTitle: {
      id: 'pa.application:endorsement.alert.title',
      defaultMessage: 'Athugið',
      description: 'Alert message title',
    },
    alertDescriptionVoterRegistryNotFound: {
      id: 'pa.application:endorsement.alert.descrtipion.voter.registry',
      defaultMessage:
        'Þú ert ekki með skráða búsetu skv. bráðabirgðakjörskrá í þessu kjördæmi.  Meðmæli þarfnast yfirferðar hjá yfirkjörstjórn, ert þú viss um að þú viljir skrá meðmæli í völdu kjördæmi?',
      description:
        'Alert message if signaturee was not found in temp voter reg',
    },
    alertDescriptionWrongConstituency: {
      id: 'pa.application:endorsement.alert.descrtipion.wrong.constituency',
      defaultMessage:
        'Þú ert ekki með skráða búsetu í þessu kjördæmi ertu viss um að vilja halda áfram?',
      description: 'Alert message if signaturee is in the wrong constituency',
    },
    toastMessage: {
      id: 'pa.application:endorsement.alert.descrtipion.toast.message',
      defaultMessage:
        'Ekki tókst að ná sambandi við vefþjónustu. Vinsamlegast reyndu aftur síðar',
      description: 'Toast message on error',
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
    cardTitleWarning: {
      id: 'pa.application:endorsement.warning.card.title',
      defaultMessage: 'Þú hefur þegar mælt með framboði',
      description: 'Warning card title',
    },
    cardSubtitle: {
      id: 'pa.application:endorsement.approved.card.subtitle',
      defaultMessage: 'Hægt er að skoða virk meðmæli á Mínum Síðum.',
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
  partyLetterFailed: defineMessages({
    title: {
      id: 'pa.application:partyletter.failed.title',
      defaultMessage: 'Listabókstafur ekki á skrá',
      description: 'Title for party letter failed',
    },
    description: {
      id: 'pa.application:partyletter.failed.description',
      defaultMessage:
        'Þú ert ekki á skrá sem umsjónarmaður stjórnmálasamtaka vinsamlegast hafðu samband við postur@dmr.is',
      description: 'Description for party letter failed',
    },
  }),
  supremeCourt: defineMessages({
    title: {
      id: 'pa.application:supreme.court.title',
      defaultMessage:
        'Meðmæli með framboðslista stjórnmálasamtaka til yfirkjörstjórnar',
      description: 'Supreme court review title',
    },
    description: {
      id: 'pa.application:supreme.court.description',
      defaultMessage:
        'Meðfylgjandi meðmælum með framboðslista hefur verið skilað. Hnappinn "hafna" er unnt að nota til að setja athugasemd um að meðmæli séu ófullnægjandi og þá opnast fyrir söfnun á ný. Hnappinn "samþykkja lista" er unnt að nota ef yfirkjörstjórn vill koma skilaboðum til stjórnmálasamtaka um að meðmæli séu fullnægjandi.',
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
      defaultMessage: 'Hlaða niður meðmælum',
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
      defaultMessage: 'Opna á ný',
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
      defaultMessage: 'Skilaboðum hefur verið komið til stjórnmálasamtaka',
      description: 'Text after supreme court has submitted',
    },
  }),
}
