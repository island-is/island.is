import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  // Messages shared across General Petition application
  externalDataSection: defineMessages({
    title: {
      id: 'gpt.application:terms.title',
      defaultMessage: 'Skilmálar',
      description: 'External data title',
    },
    subtitle: {
      id: 'gpt.application:terms.subtitle',
      defaultMessage: 'Eftirfarandi gildir um söfnun meðmæla',
      description: 'External data subtitle',
    },
    termsAndConditions: {
      id: 'gpt.application:dmr.subtitle',
      defaultMessage:
        'Vakin er athygli á lögum um persónuvernd og vinnslu persónuupplýsinga nr. 90/2018. Ábyrgðaraðili staðfestir hér með að listinn sé í samræmi við lög og reglur landsins og stjórnarskrá Íslands. Vinnsluaðila er heimilt að loka lista niður fari hann gegn ofangreindu.',
      description: 'External data DRM subtitle',
    },
    agree: {
      id: 'gpt.application:terms.checkbox',
      defaultMessage: 'Ég samþykki skilmála hér að ofan',
      description: 'Agree terms and conditions',
    },
  }),
  collectEndorsements: defineMessages({
    title: {
      id: 'gpt.application:collect.endorsements.title',
      defaultMessage: 'Safna meðmælum',
      description: 'Collect endorsements title',
    },
  }),
  endorsementList: defineMessages({
    linkDescription: {
      id: 'gpt.application:endorsement.list.link.description',
      defaultMessage: 'Hér er hlekkur til að senda út á meðmælendur',
      description: 'Link description',
    },
    copyLinkButton: {
      id: 'gpt.application:endorsement.list.link.button',
      defaultMessage: 'Afrita hlekk',
      description: 'Copy link button',
    },
    namesCount: {
      id: 'gpt.application:endorsement.list.names.count',
      defaultMessage: 'meðmæli á lista',
      description: 'X names on list',
    },
    invalidEndorsements: {
      id: 'gpt.application:endorsement.list.invalid.endorsements',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Only show invalid endorsements',
    },
    searchbar: {
      id: 'gpt.application:endorsement.list.search',
      defaultMessage: 'Leitaðu að nafni',
      description: 'Searchbar placeholder',
    },
  }),
  email: defineMessages({
    title: {
      id: 'gpt.application:email.title',
      defaultMessage: 'Vinsamlegast sláðu inn rétt netfang',
      description: 'Overview title',
    },
    titleSidebar: {
      id: 'gpt.application:email.titleSidebar',
      defaultMessage: 'Netfang og staðfesting',
      description: 'Overview title',
    },
    subtitle: {
      id: 'gpt.application:email.subtitle',
      defaultMessage: '',
      description: 'Overview subtitle',
    },
  }),
  information: defineMessages({
    title: {
      id: 'gpt.application:information.title',
      defaultMessage: 'Upplýsingar um lista',
      description: 'Information about the list',
    },
    titleSidebar: {
      id: 'gpt.application:information.titleSidebar',
      defaultMessage: 'Upplýsingar',
      description: 'Information',
    },
    listName: {
      id: 'gpt.application:information.listName',
      defaultMessage: 'Heiti meðmælendalista',
      description: 'List name',
    },
    aboutList: {
      id: 'gpt.application:information.aboutList',
      defaultMessage: 'Um meðmælendalista',
      description: 'About list',
    },
    aboutListPlaceholder: {
      id: 'gpt.application:information.aboutListPlaceholder',
      defaultMessage:
        'Texti sem birtist með meðmælendalista. Ekki er hægt að breyta texta eftir að meðmælendalisti hefur verið birtur',
      description: 'About list placeholder',
    },
    dateTitle: {
      id: 'gpt.application:information.dateTitle',
      defaultMessage: 'Tímabil lista',
      description: 'Date period',
    },
    dateFromPlaceholder: {
      id: 'gpt.application:information.dateFromPlaceholder',
      defaultMessage: 'Frá',
      description: 'Date from',
    },
    dateToPlaceholder: {
      id: 'gpt.application:information.dateToPlaceholder',
      defaultMessage: 'Til',
      description: 'Date to',
    },
  }),
  participants: defineMessages({
    titleSidebar: {
      id: 'gpt.application:participants.titleSidebar',
      defaultMessage: 'Þátttakendur',
      description: 'Participants',
    },
    title: {
      id: 'gpt.application:participants.title',
      defaultMessage: 'Veldu þátttakendur',
      description: 'Select participants',
    },
  }),
  overview: defineMessages({
    title: {
      id: 'gpt.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview title',
    },
    subtitle: {
      id: 'gpt.application:overview.subtitle',
      defaultMessage:
        'Vinsamlegast farðu yfir upplýsingarnar hér að neðan og staðfestu að þær séu réttar. Eftir að listi er stofnaður er ekki hægt að breyta upplýsingum um lista.',
      description: 'Overview subtitle',
    },
    overviewTitle: {
      id: 'gpt.application:overview.overviewTitle',
      defaultMessage: 'Upplýsingar um meðmælendalista',
      description: 'Overview review title',
    },
    applicant: {
      id: 'gpt.application:overview.applicant',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Applicant',
    },
    listName: {
      id: 'gpt.application:overview.listName',
      defaultMessage: 'Heiti meðmælendalista',
      description: 'List name',
    },
    aboutList: {
      id: 'gpt.application:overview.aboutList',
      defaultMessage: 'Um meðmælendalista',
      description: 'About list',
    },
    listPeriod: {
      id: 'gpt.application:overview.listPeriod',
      defaultMessage: 'Tímabil lista',
      description: 'List period',
    },
    ageInterval: {
      id: 'gpt.application:overview.ageInterval',
      defaultMessage: 'Aldursbil á lista',
      description: 'Age interval of the list',
    },
    participants: {
      id: 'gpt.application:overview.participants',
      defaultMessage: 'Þátttakendur',
      description: 'List participants',
    },
    submitButton: {
      id: 'gpt.application:overview.submit',
      defaultMessage: 'Senda inn umsókn',
      description: 'Overview submit button',
    },
    finalTitle: {
      id: 'gpt.application:overview.final.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Title after submit',
    },
    finalSubtitle: {
      id: 'gpt.application:overview.final.subtitle',
      defaultMessage:
        'Þú munt fá skilaboð í tölvupósti þegar umsókn er í vinnslu',
      description: 'Subtitle after submit',
    },
  }),
  listSubmitted: defineMessages({
    title: {
      id: 'gpt.application.list.submitted.title',
      defaultMessage: 'Með hefur verið skilað',
      description: 'Title for conlcusion',
    },
    approvedTitle: {
      id: 'gpt.application.list.submitted.title',
      defaultMessage: 'Meðmælendalista hefur verið skilað til Ísland.is',
      description: 'Title for approved card',
    },
    approvedSubtitle: {
      id: 'gpt.application.list.submitted.subtitle',
      defaultMessage:
        'Staðfesting á móttöku verður send í pósthólf á Mínum Síðum. Hægt er að sýsla með lista þar.',
      description: 'Subtitle for approved card',
    },
    bulletListTitle: {
      id: 'gpt.application.list.submitted.bulletListTitle',
      defaultMessage: 'Vert að skoða',
      description: 'Title for bullet point list',
    },
    bulletLink1: {
      id: 'gpt.application.list.submitted.bulletLink1',
      defaultMessage:
        'https://www.stjornarradid.is/raduneyti/domsmalaraduneytid/',
      description: 'Link to Vefur dómsmálaráðuneytis',
    },
    bulletLink1Title: {
      id: 'gpt.application.list.submitted.bulletLink1Title',
      defaultMessage: 'Vefur dómsmálaráðuneytis',
      description: 'Link title',
    },
    bulletLink2: {
      id: 'gpt.application.list.submitted.bulletLink2',
      defaultMessage:
        'https://www.stjornarradid.is/verkefni/kosningar/althingiskosningar/frambod-leidbeiningar/listabokstafir/',
      description: 'Link to kosning.is',
    },
    bulletLink2Title: {
      id: 'gpt.application.list.submitted.bulletLink2Title',
      defaultMessage: 'kosning.is',
      description: 'Link title',
    },
  }),
  validationMessages: defineMessages({
    approveTerms: {
      id: 'gpt.application:validationmessages.approveTerms',
      defaultMessage: 'Vinsamlegast samþykktu skilmála',
      description: 'Error message for terms and conditions',
    },
    listName: {
      id: 'gpt.application:validationmessages.party.name',
      defaultMessage: 'Vinsamlegast veldu nafn á listann',
      description: 'Error message if list name is empty',
    },
    aboutList: {
      id: 'gpt.application:validationmessages.party.name',
      defaultMessage: 'Vinsamlegast veldu lýsingu á listann',
      description: 'Error message if list decription is empty',
    },
    date: {
      id: 'gpt.application:validationmessages.party.name',
      defaultMessage: 'Vinsamlegast veldu dagsetningu',
      description: 'Error message if date is empty',
    },
  }),
  endorsementForm: defineMessages({
    title: {
      id: 'gpt.application:endorsement.form.title',
      defaultMessage: 'Meðmæli með listabókstafnum',
      description: 'Title for endorsements application',
    },
    stepTitle: {
      id: 'gpt.application:endorsement.form.steptitle',
      defaultMessage: 'Samþykkja',
      description: 'Title for section step',
    },
    sectionTitle: {
      id: 'gpt.application:endorsement.form.secitontitle',
      defaultMessage: 'Listabókstafs meðmælendalisti',
      description:
        'Partial title for section, party letter will be added programmatically',
    },
    nameInput: {
      id: 'gpt.application:endorsement.form.name.input',
      defaultMessage: 'Nafn',
      description: 'Label and placeholder for name input field',
    },
    descriptionPt1: {
      id: 'gpt.application:endorsement.form.descripton.pt.one',
      defaultMessage:
        'Með því veiti ég viðkomandi stjórnmálasamtökum, dómsmálaráðuneytinu og Þjóðskrá Íslands aðgang að þeim upplýsingum sem skráðar eru á meðmælendalistan, þ.e. nafn, kt og heimilsfang. Óheimilt er að miðla meðmælunum eða þeim upplýsingum sem þar koma fram.',
      description: 'Disclaimer description, first paragraph',
    },
    descriptionPt2: {
      id: 'gpt.application:endorsement.form.descripton.pt.two',
      defaultMessage:
        'Þjóðskrá Íslands er heimilt, að beiðni dómsmálaráðuneytisins, að samkeyra meðmælendalistann við þjóðskrá að fullnægðum heimildum laga um persónuvernd og vinnslu persónuupplýsinga gilda hverju sinni.',

      description: 'Disclaimer description, second paragraph',
    },
    agreeTermsLabel: {
      id: 'gpt.application:endorsement.form.agree.label',
      defaultMessage:
        'Ég hef kynnt mér ofangreint málefni og samþykki uppflettingu úr Þjóðskrá',
      description: 'Label for terms and conditions',
    },
    allowNameLabel: {
      id: 'gpt.application:endorsement.form.allow.name.label',
      defaultMessage: 'Ekki birta nafn mitt á lista',
      description:
        'Label for allowing your name to be shown in public petition list',
    },
    isClosedMessage: {
      id: 'gpt.application:endorsement.form.isClosed.message',
      defaultMessage: 'Meðmælendalista hefur verið lokað',
      description: 'Error message if endorsement list has been closed',
    },
    submitButton: {
      id: 'gpt.application:endorsement.form.submit.button',
      defaultMessage: 'Setja nafn mitt á lista',
      description: 'Title for submit button',
    },
    errorToast: {
      id: 'gpt.application:endorsement.form.toast.error',
      defaultMessage:
        'Ekki tókst að setja nafn þitt á lista. Vinsamlegast reyndu aftur síðar',
      description: 'Error message for error on endorse',
    },
  }),
  endorsementDisclaimer: defineMessages({
    part1: {
      id: 'gpt.application:endorsement.disclaimer.pt1',
      defaultMessage: 'Ég lýsi því hér með yfir að ég mæli með því að',
      description: 'Part 1 of endorsement disclaimer',
    },
    part2: {
      id: 'gpt.application:endorsement.disclaimer.pt2',
      defaultMessage: 'fái úthlutað listabókstafnum',
      description: 'Part 2 of endorsement disclaimer',
    },
  }),
  logo: defineMessages({
    imgAlt: {
      id: 'gpt.application:logo.img.alt',
      defaultMessage: 'Skjaldamerkið',
      description: 'Alt for image',
    },
    service: {
      id: 'gpt.application:logo.service',
      defaultMessage: 'Þjónustuaðili',
      description: 'Service for',
    },
    organization: {
      id: 'gpt.application:logo.organization',
      defaultMessage: 'Dómsmálaráðuneytið',
      description: 'Name of organization',
    },
  }),
  endorsementApproved: defineMessages({
    title: {
      id: 'gpt.application:endorsement.approved.title',
      defaultMessage: 'Staðfesting',
      description: 'Approved card title',
    },
    cardTitle: {
      id: 'gpt.application:endorsement.approved.card.title',
      defaultMessage: 'Þú hefur sett nafn þitt á listann',
      description: 'Approved card title',
    },
    cardSubtitle: {
      id: 'gpt.application:endorsement.approved.card.subtitle',
      defaultMessage: 'Yfirlit yfir öll meðmæli má finna á Mínum Síðum',
      description: 'Approved card subtitle',
    },
    myPagesButton: {
      id: 'gpt.application:endorsement.approved.button.mypages',
      defaultMessage: 'Til baka á mínar síður',
      description: 'Button back to my pages',
    },
    myPagesUrl: {
      id: 'gpt.application:endorsement.approved.url.mypages',
      defaultMessage: 'https://island.is/minarsidur/min-gogn/minar-upplysingar',
      description: 'Url back to my pages',
    },
    partyListButton: {
      id: 'gpt.application:endorsement.approved.button.partylist',
      defaultMessage: 'Skoða lista',
      description: 'Button to party list',
    },
    partyListUrl: {
      id: 'gpt.application:endorsement.approved.url.partylist',
      defaultMessage:
        'https://island.is/althingiskosningar2021/medmaeli-kjosenda',
      description: 'Url to party list',
    },
  }),
  ministryOfJustice: defineMessages({
    title: {
      id: 'gpt.application:ministry.justicet.title',
      defaultMessage: 'Dómsmálaráðuneytið',
      description: 'Ministry of justiice review title',
    },
    description: {
      id: 'gpt.application:ministry.justice.description',
      defaultMessage:
        'Vinsamlegast farðu yfir upplýsingarnar hér að neðan og staðfestu að þær séu réttar.',
      description: 'Ministry of justice review description',
    },
    subtitle: {
      id: 'gpt.application:ministry.justice.subtitle',
      defaultMessage: 'Yfirlit yfir framboðslista',
      description: 'Ministry of justice review subtitle',
    },
    steps: {
      id: 'gpt.application:ministry.justice.steps',
      defaultMessage: 'Til skoðunar',
      description: 'Title for steps',
    },
    step1: {
      id: 'gpt.application:ministry.justice.step.1',
      defaultMessage: 'Yfirlit framboðs',
      description: 'Step one',
    },
    responsiblePersonLabel: {
      id: 'gpt.application:ministry.justice.responsibleperson.label',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Label for responsible person',
    },
    typeOfEndorsementLabel: {
      id: 'gpt.application:ministry.justice.endorsementtype.label',
      defaultMessage: 'Tegund framboðs',
      description: 'Label for endorsement type',
    },
    numberOfEndorsementsLabel: {
      id: 'gpt.application:ministry.justice.no.endorsements.label',
      defaultMessage: 'Fjöldi meðmæla',
      description: 'Label for number of endorsements',
    },
    constituencyLabel: {
      id: 'gpt.application:ministry.justice.constituency.label',
      defaultMessage: 'Kjördæmi',
      description: 'Label for constituency',
    },
    commentsLabel: {
      id: 'gpt.application:ministry.justice.comments.label',
      defaultMessage: 'Athugasemdir',
      description: 'Label for comments',
    },
    csvButton: {
      id: 'gpt.application:ministry.justice.csv.button',
      defaultMessage: 'Hlaða niður meðmælum',
      description: 'Download endorsements button',
    },
    rejectButton: {
      id: 'gpt.application:ministry.justice.reject.button',
      defaultMessage: 'Hafna',
      description: 'Reject button',
    },
    approveButton: {
      id: 'gpt.application:ministry.justice.approve.button',
      defaultMessage: 'Samþykkja lista',
      description: 'Approve button',
    },
    approvedTitle: {
      id: 'gpt.application:ministry.justice.approved.title',
      defaultMessage: 'Takk fyrir',
      description: 'Title for approved screen',
    },
    approvedDescription: {
      id: 'gpt.application:ministry.justice.approved.description',
      defaultMessage:
        'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
      description: 'Text after MOJ has submitted',
    },
  }),
}
