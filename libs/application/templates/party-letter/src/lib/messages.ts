import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  // Messages shared across party letter application
  externalDataSection: defineMessages({
    title: {
      id: 'ple.application:terms.title',
      defaultMessage: 'Skilmálar',
      description: 'External data title',
    },
    subtitle: {
      id: 'ple.application:terms.subtitle',
      defaultMessage:
        'Eftirfarandi gildir um umsókn og  meðmælendasöfnun vegna listabókstafa',
      description: 'External data subtitle',
    },
    dmrTitle: {
      id: 'ple.application:dmr.title',
      defaultMessage: 'Dómsmálaráðuneyti',
      description: 'External data DRM title',
    },
    dmrSubtitle: {
      id: 'ple.application:dmr.subtitle',
      defaultMessage:
        'Vakin er athygli á lögum um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018. Stjórnmálasamtökum er óheimilt að miðla  meðmælendalistanum eða upplýsingum úr honum. ',
      description: 'External data DRM subtitle',
    },
    nationalRegistryTitle: {
      id: 'ple.application:nationalRegistry.title',
      defaultMessage: 'Persónupplýsingar úr Þjóðskrá',
      description: 'External data national registry title',
    },
    nationalRegistrySubtitle: {
      id: 'ple.application:nationalRegistry.subtitle',
      defaultMessage: 'Nafn og kennitala.',
      description: 'External data national registry subtitle',
    },
    islandTitle: {
      id: 'ple.application:island.title',
      defaultMessage: 'Fyrirtækjaskrá',
      description: 'Grunnupplýsingar úr fyrirtækjaskrá eru sóttar',
    },
    islandSubtitle: {
      id: 'ple.application:island.subtitle',
      defaultMessage: 'Nafn fyrirtækis og kennitala.',
      description: 'External data island.is subtitle',
    },
    agree: {
      id: 'ple.application:terms.checkbox',
      defaultMessage: 'Ég veiti umboð',
      description: 'Agree terms and conditions',
    },
  }),
  collectEndorsements: defineMessages({
    title: {
      id: 'ple.application:collect.endorsements.title',
      defaultMessage: 'Safna meðmælum',
      description: 'Collect endorsements title',
    },
  }),
  endorsementList: defineMessages({
    linkDescription: {
      id: 'ple.application:endorsement.list.link.description',
      defaultMessage: 'Hér er hlekkur til að senda út á meðmælendur',
      description: 'Link description',
    },
    copyLinkButton: {
      id: 'ple.application:endorsement.list.link.button',
      defaultMessage: 'Afrita hlekk',
      description: 'Copy link button',
    },
    namesCount: {
      id: 'ple.application:endorsement.list.names.count',
      defaultMessage: 'meðmæli á lista',
      description: 'X names on list',
    },
    invalidEndorsements: {
      id: 'ple.application:endorsement.list.invalid.endorsements',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Only show invalid endorsements',
    },
    searchbar: {
      id: 'ple.application:endorsement.list.search',
      defaultMessage: 'Leitaðu að nafni',
      description: 'Searchbar placeholder',
    },
  }),
  endorsementTable: defineMessages({
    thDate: {
      id: 'ple.application:endorsementTable.th.date',
      defaultMessage: 'Dags skráð',
      description: 'Table header date',
    },
    thName: {
      id: 'ple.application:endorsementTable.th.name',
      defaultMessage: 'Nafn',
      description: 'Table header name',
    },
    thNationalNumber: {
      id: 'ple.application:endorsementTable.th.nationalnumber',
      defaultMessage: 'Kennitala',
      description: 'Table header national number',
    },
    thAddress: {
      id: 'ple.application:endorsementTable.th.address',
      defaultMessage: 'Heimilisfang',
      description: 'Table header address',
    },
  }),
  fileUpload: defineMessages({
    includePapers: {
      id: 'pa.application:file.upload.includePapers',
      defaultMessage: 'Ég ætla skila inn meðmælum á pappír*',
      description: 'Include paper signatures',
    },
    includePapersDisclaimerPt1: {
      id: 'ple.application:file.upload.disclaimer.pt1',
      defaultMessage:
        '*Fyrir meðmæli á pappír þarf að lista upp kennitölur meðmælenda í Excel skjal og hlaða upp hér að neðan.',
      description: 'Include paper endorsements disclaimer part 1',
    },
    includePapersDisclaimerPt2: {
      id: 'ple.application:file.upload.disclaimer.pt2',
      defaultMessage:
        '*Pappírsmeðmæli skulu einnig sendast með bréfpósti til yfirkjörstjórnar.',
      description: 'Include paper endorsements disclaimer part 2',
    },
    includePapersDisclaimerPt3: {
      id: 'ple.application:file.upload.disclaimer.pt3',
      defaultMessage:
        '*Skjalið skal innihalda eina kennitölu per reit. Allar kennitölur skulu vera í fyrsta dálk (dálk A), fyrsta kennitalan skal vera staðsett í reit A1.',
      description: 'Include paper signatures disclaimer part 3',
    },
    fileUploadHeader: {
      id: 'ple.application:file.upload.header',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Header for file upload',
    },
    uploadDescription: {
      id: 'ple.application:file.upload.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .xlsx',
      description: 'Description for file upload',
    },
    uploadButtonLabel: {
      id: 'ple.application:file.upload.label',
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
  selectNationalId: defineMessages({
    title: {
      id: 'ple.application:select.national.id.title',
      defaultMessage: 'Kennitala framboðs',
      description: 'Select national id title',
    },
  }),
  selectPartyLetter: defineMessages({
    title: {
      id: 'ple.application:partyletter.title',
      defaultMessage: 'Skráðu nafn og listabókstaf',
      description: 'Party Letter title',
    },
    sectionTitle: {
      id: 'ple.application:partyletter.section.title',
      defaultMessage: 'Nafn flokks',
      description: 'Party Letter section title',
    },
    partyLetterLabel: {
      id: 'ple.application:partyletter.partyletter.label',
      defaultMessage: 'Listabókstafur sem óskað er eftir',
      description: 'Label for party letter input box',
    },
    partyLetterPlaceholder: {
      id: 'ple.application:partyletter.partyletter.placeholder',
      defaultMessage: 'Listabókstafur',
      description: 'Placeholder for party letter input box',
    },
    partyNameLabel: {
      id: 'ple.application:partyletter.partyname.label',
      defaultMessage: 'Nafn flokks',
      description: 'Label for party name input box',
    },
    partyNamePlaceholder: {
      id: 'ple.application:partyletter.partyname.placeholder',
      defaultMessage: 'Nafn',
      description: 'Placeholder for party name input box',
    },
    partyLetterSubtitle: {
      id: 'ple.application:partyletter.subtitle',
      defaultMessage:
        'Við alþingiskosningarnar 28. október 2017 buðu eftirtalin stjórnmálasamtök fram lista og voru þeir merktir sem hér segir:',
      description: 'Description before listing upp unavailable party letters',
    },
  }),
  overview: defineMessages({
    title: {
      id: 'ple.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview title',
    },
    subtitle: {
      id: 'ple.application:overview.subtitle',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplisýngar hafi verið gefnar upp.',
      description: 'Overview subtitle',
    },
    reviewTitle: {
      id: 'ple.application:overview.review.title',
      defaultMessage: 'Upplýsingar um listabókstaf',
      description: 'Overview review title',
    },
    email: {
      id: 'ple.application:overview.review.email',
      defaultMessage: 'Netfang',
      description: 'Registered email for party letter',
    },
    partyLetter: {
      id: 'ple.application:overview.partyletter',
      defaultMessage: 'Listabókstafur',
      description: 'Overview label for party letter',
    },
    partyName: {
      id: 'ple.application:overview.partyname',
      defaultMessage: 'Nafn flokks',
      description: 'Overview label for party name',
    },
    responsibleParty: {
      id: 'ple.application:overview.responsible.party',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Overview label for responsible party',
    },
    endorsementsCount: {
      id: 'ple.application:overview.endorsements.count',
      defaultMessage: 'Fjöldi meðmælenda',
      description: 'Overview label for endorsements count',
    },
    warningCount: {
      id: 'ple.application:overview.warning.count',
      defaultMessage: 'Fjöldi meðmælenda í vafa',
      description: 'Overview label for endorsements count with warning',
    },
    includedPapers: {
      id: 'ple.application:overview.include.papers',
      defaultMessage: 'Meðmælendur á pappír',
      description: 'Overview label for include papers checkbox',
    },
    submitButton: {
      id: 'ple.application:overview.submit.button',
      defaultMessage: 'Loka söfnun',
      description: 'Overview submit button',
    },
    finalTitle: {
      id: 'ple.application:overview.final.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Title after submit',
    },
    finalSubtitle: {
      id: 'ple.application:overview.final.subtitle',
      defaultMessage:
        'Þú munt fá skilaboð í tölvupósti þegar umsókn er í vinnslu',
      description: 'Subtitle after submit',
    },
  }),
  validationMessages: defineMessages({
    approveTerms: {
      id: 'ple.application:validationmessages.approveTerms',
      defaultMessage: 'Vinsamlegast samþykktu skilmála',
      description: 'Error message for terms and conditions',
    },
    ssd: {
      id: 'ple.application:validationmessages.ssd',
      defaultMessage: 'Vinsamlegast veldu kennitölu',
      description: 'Error message for selection ssd',
    },
    partyLetterOccupied: {
      id: 'ple.application:validationmessages.letter.occupied',
      defaultMessage: 'Bókstafur þegar á skrá',
      description: 'Error message if party letter is occupied',
    },
    partyLetterSingle: {
      id: 'ple.application:validationmessages.letter.single',
      defaultMessage: 'Bókstafur skal vera stakur',
      description: 'Error message if party letter is empty or > 1',
    },
    partyName: {
      id: 'ple.application:validationmessages.party.name',
      defaultMessage: 'Vinsamlegast veldu nafn á flokkinn',
      description: 'Error message if party name is empty',
    },
    signatureInvalid: {
      id: 'ple.application:validationmessages.signature.invalid',
      defaultMessage: 'Undirskrift ekki lengur gild',
      description: 'Error message if signature has new address',
    },
    emailInvalid: {
      id: 'ple.application:validationmessages.email.invalid',
      defaultMessage: 'Netfang þarf að vera gilt',
      description: 'Error message if email is invalid',
    },
  }),
  endorsementForm: defineMessages({
    title: {
      id: 'ple.application:endorsement.form.title',
      defaultMessage: 'Meðmæli með listabókstafnum',
      description: 'Title for endorsements application',
    },
    stepTitle: {
      id: 'ple.application:endorsement.form.steptitle',
      defaultMessage: 'Samþykkja',
      description: 'Title for section step',
    },
    sectionTitle: {
      id: 'ple.application:endorsement.form.secitontitle',
      defaultMessage: 'Listabókstafs meðmælendalisti',
      description:
        'Partial title for section, party letter will be added programmatically',
    },
    nameInput: {
      id: 'ple.application:endorsement.form.name.input',
      defaultMessage: 'Nafn',
      description: 'Label and placeholder for name input field',
    },
    descriptionPt1: {
      id: 'ple.application:endorsement.form.descripton.pt.one',
      defaultMessage:
        'Með því veiti ég viðkomandi stjórnmálasamtökum, dómsmálaráðuneytinu og Þjóðskrá Íslands aðgang að þeim upplýsingum sem skráðar eru á meðmælendalistan, þ.e. nafn, kt og heimilsfang. Óheimilt er að miðla meðmælunum eða þeim upplýsingum sem þar koma fram.',
      description: 'Disclaimer description, first paragraph',
    },
    descriptionPt2: {
      id: 'ple.application:endorsement.form.descripton.pt.two',
      defaultMessage:
        'Þjóðskrá Íslands er heimilt, að beiðni dómsmálaráðuneytisins, að samkeyra meðmælendalistann við þjóðskrá að fullnægðum heimildum laga um persónuvernd og vinnslu persónuupplýsinga gilda hverju sinni.',

      description: 'Disclaimer description, second paragraph',
    },
    agreeTermsLabel: {
      id: 'ple.application:endorsement.form.agree.label',
      defaultMessage: 'Ég hef kynnt mér framangreint',
      description: 'Label for terms and conditions',
    },
    isClosedMessage: {
      id: 'ple.application:endorsement.form.isClosed.message',
      defaultMessage: 'Meðmælendalista hefur verið lokað',
      description: 'Error message if endorsement list has been closed',
    },
    submitButton: {
      id: 'ple.application:endorsement.form.submit.button',
      defaultMessage: 'Setja nafn mitt á lista',
      description: 'Title for submit button',
    },
  }),
  endorsementDisclaimer: defineMessages({
    part1: {
      id: 'ple.application:endorsement.disclaimer.pt1',
      defaultMessage: 'Ég lýsi því hér með yfir að ég mæli með því að',
      description: 'Part 1 of endorsement disclaimer',
    },
    part2: {
      id: 'ple.application:endorsement.disclaimer.pt2',
      defaultMessage: 'fái úthlutað listabókstafnum',
      description: 'Part 2 of endorsement disclaimer',
    },
  }),
  logo: defineMessages({
    imgAlt: {
      id: 'ple.application:logo.img.alt',
      defaultMessage: 'Skjaldamerkið',
      description: 'Alt for image',
    },
    service: {
      id: 'ple.application:logo.service',
      defaultMessage: 'Þjónustuaðili',
      description: 'Service for',
    },
    organization: {
      id: 'ple.application:logo.organization',
      defaultMessage: 'Dómsmálaráðuneytið',
      description: 'Name of organization',
    },
  }),
  endorsementApproved: defineMessages({
    title: {
      id: 'ple.application:endorsement.approved.title',
      defaultMessage: 'Staðfesting',
      description: 'Approved card title',
    },
    cardTitle: {
      id: 'ple.application:endorsement.approved.card.title',
      defaultMessage: 'Þú hefur verið skráður sem meðmælandi',
      description: 'Approved card title',
    },
    cardSubtitle: {
      id: 'ple.application:endorsement.approved.card.subtitle',
      defaultMessage: 'Hægt er að skoða virka lista undir ',
      description: 'Approved card subtitle',
    },
    myPagesButton: {
      id: 'ple.application:endorsement.approved.button.mypages',
      defaultMessage: 'Til baka á mínar síður',
      description: 'Button back to my pages',
    },
    myPagesUrl: {
      id: 'ple.application:endorsement.approved.url.mypages',
      defaultMessage: 'https://island.is/minarsidur/min-gogn/minar-upplysingar',
      description: 'Url back to my pages',
    },
    partyListButton: {
      id: 'ple.application:endorsement.approved.button.partylist',
      defaultMessage: 'Skoða lista',
      description: 'Button to party list',
    },
    partyListUrl: {
      id: 'ple.application:endorsement.approved.url.partylist',
      defaultMessage:
        'https://island.is/althingiskosningar2021/medmaeli-kjosenda',
      description: 'Url to party list',
    },
  }),
  ministryOfJustice: defineMessages({
    title: {
      id: 'ple.application:ministry.justicet.title',
      defaultMessage: 'Dómsmálaráðuneytið',
      description: 'Ministry of justiice review title',
    },
    description: {
      id: 'ple.application:ministry.justice.description',
      defaultMessage:
        'Vinsamlegast farðu yfir upplýsingarnar hér að neðan og staðfestu að þær séu réttar.',
      description: 'Ministry of justice review description',
    },
    subtitle: {
      id: 'ple.application:ministry.justice.subtitle',
      defaultMessage: 'Yfirlit yfir framboðslista',
      description: 'Ministry of justice review subtitle',
    },
    steps: {
      id: 'ple.application:ministry.justice.steps',
      defaultMessage: 'Til skoðunar',
      description: 'Title for steps',
    },
    step1: {
      id: 'ple.application:ministry.justice.step.1',
      defaultMessage: 'Yfirlit framboðs',
      description: 'Step one',
    },
    partyNameLabel: {
      id: 'ple.application:ministry.justice.partyname.label',
      defaultMessage: 'Nafn flokks',
      description: 'Label for party name',
    },
    partyLetterLabel: {
      id: 'ple.application:ministry.justice.partyletter.label',
      defaultMessage: 'Listabókstafur',
      description: 'Label for party letter',
    },
    responsiblePersonLabel: {
      id: 'ple.application:ministry.justice.responsibleperson.label',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Label for responsible person',
    },
    typeOfEndorsementLabel: {
      id: 'ple.application:ministry.justice.endorsementtype.label',
      defaultMessage: 'Tegund framboðs',
      description: 'Label for endorsement type',
    },
    numberOfEndorsementsLabel: {
      id: 'ple.application:ministry.justice.no.endorsements.label',
      defaultMessage: 'Fjöldi meðmæla',
      description: 'Label for number of endorsements',
    },
    constituencyLabel: {
      id: 'ple.application:ministry.justice.constituency.label',
      defaultMessage: 'Kjördæmi',
      description: 'Label for constituency',
    },
    commentsLabel: {
      id: 'ple.application:ministry.justice.comments.label',
      defaultMessage: 'Athugasemdir',
      description: 'Label for comments',
    },
    csvButton: {
      id: 'ple.application:ministry.justice.csv.button',
      defaultMessage: 'Hlaða niður meðmælum',
      description: 'Download endorsements button',
    },
    noEndorsementsMessage: {
      id: 'ple.application:ministry.justice.no.endorsements',
      defaultMessage: 'Umsækjandi hefur ekki skilað inn neinum meðmælum',
      description:
        'Message that will appear in the .csv file if there are no endorsements',
    },
    rejectButton: {
      id: 'ple.application:ministry.justice.reject.button',
      defaultMessage: 'Opna á ný',
      description: 'Reject button',
    },
    approveButton: {
      id: 'ple.application:ministry.justice.approve.button',
      defaultMessage: 'Samþykkja lista',
      description: 'Approve button',
    },
    approvedTitle: {
      id: 'ple.application:ministry.justice.approved.title',
      defaultMessage: 'Takk fyrir',
      description: 'Title for approved screen',
    },
    approvedDescription: {
      id: 'ple.application:ministry.justice.approved.description',
      defaultMessage:
        'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
      description: 'Text after MOJ has submitted',
    },
  }),
  partyLetterApprovedOverview: defineMessages({
    title: {
      id: 'ple.application:letter.approved.overview.title',
      defaultMessage: 'Umsókn samþykkt',
      description: 'title',
    },
  }),
}
