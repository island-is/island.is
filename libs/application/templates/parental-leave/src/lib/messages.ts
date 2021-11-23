import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const parentalLeaveFormMessages: MessageDir = {
  // Messages shared across the Parental Leave application templates
  shared: defineMessages({
    institution: {
      id: 'pl.application:institution.name',
      defaultMessage: 'Vinnumálastofnun',
      description: 'Name of the institution responsible of the application',
    },
    name: {
      id: 'pl.application:name',
      defaultMessage: 'Umsókn um fæðingarorlof',
      description: 'Application for parental leave',
    },
    formTitle: {
      id: 'pl.application:form.title',
      defaultMessage: 'Fæðingarorlof',
      description: 'Parental Leave',
    },
    prerequisitesSection: {
      id: 'pl.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    applicationName: {
      id: 'pl.application:application.name',
      defaultMessage: 'Umsókn um fæðingarorlof',
      description: 'Application for parental leave',
    },
    applicantSection: {
      id: 'pl.application:applicant.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'Applicant information',
    },
    dateOfBirthNotAvailable: {
      id: 'pl.application:externalData.dobNotAvailable',
      defaultMessage:
        'Gat ekki sótt fæðingardaginn. Vinsamlegast reyndu aftur síðar.',
      description:
        'Could not retrieve the date of birth. Please try again later.',
    },
    externalDataSubSection: {
      id: 'pl.application:externalData.subSection',
      defaultMessage: 'Sækja gögn',
      description: 'External Data',
    },
    existingParentalLeavesTitle: {
      id: 'pl.application:existingParentalLeaves.title',
      defaultMessage: 'Núverandi umsóknir um fæðingarorlof',
      description: 'Existing parental leave applications',
    },
    existingParentalLeavesSubTitle: {
      id: 'pl.application:existingParentalLeaves.subtitle',
      defaultMessage:
        'Þessar umsóknir gætu verið fyrir önnur börnin þín, eða útistandandi fæðingarorlofsumsókn sem hitt foreldrið hefur gert fyrir ófætt barn ykkar.',
      description:
        'These applications could be for already born children, or an application made by you or the other parent for parental leave for your unborn child.',
    },
    otherParentSubSection: {
      id: 'pl.application:otherParent.subSection',
      defaultMessage: 'Hitt foreldrið',
      description: 'The other parent',
    },
    otherParentDescription: {
      id: 'pl.application:otherParent.description',
      defaultMessage:
        'Sjálfgefið er skráður maki. Ef það er ekkert annað foreldri í myndinni að þessu sinni, þá þarf ekki að fylla þetta út',
      description:
        'This person is by default your spouse or partner. If there is no other parent in the picture at this point in time, leave this empty.',
    },
    otherParentTitle: {
      id: 'pl.application:otherParent.title',
      defaultMessage: 'Vinsamlegast staðfestu hitt foreldrið (ef það á við)',
      description: 'Please confirm the other parent (if any)',
    },
    otherParentSubTitle: {
      id: 'pl.application:otherParent.sub.title',
      defaultMessage: 'Annað foreldri',
      description: 'Sub title for the other parent question',
    },
    otherParentName: {
      id: 'pl.application:otherParent.name',
      defaultMessage: 'Nafn hins foreldrisins',
      description: 'Name of other parent',
    },
    otherParentID: {
      id: 'pl.application:otherParent.id',
      defaultMessage: 'Kennitala hins foreldrisins',
      description: 'National ID of other parent',
    },
    noOtherParent: {
      id: 'pl.application:otherParent.none',
      defaultMessage: 'Ég vil ekki staðfesta hitt foreldrið að svo stöddu',
      description: 'I do not want to confirm the other parent at this time.',
    },
    otherParentOption: {
      id: 'pl.application:otherParent.option',
      defaultMessage: 'Hitt foreldrið er:',
      description: 'The other parent is:',
    },
    otherParentSpouse: {
      id: 'pl.application:otherParent.spouse',
      defaultMessage: 'Hitt foreldrið er {spouseName} (kt. {spouseId})',
      description: `The other parent is {spouseName} (kt. {spouseId})`,
    },
    otherParentEmailSubSection: {
      id: 'pl.application:otherParentEmail.subSection',
      defaultMessage: 'Netfang hins foreldris',
      description: 'Other parent email',
    },
    otherParentEmailTitle: {
      id: 'pl.application:otherParentEmail.title',
      defaultMessage: 'Hvert er netfang hins foreldrisins?',
      description: 'Asking about the email address of the other parent',
    },
    otherParentEmailDescription: {
      id: 'pl.application:otherParentEmail.description',
      defaultMessage:
        'Þú ert að óska eftir réttindum frá hinu foreldrinu sem það þarf að samþykkja.',
      description:
        'We need the email if you are requesting days or personal discount from the other parent for them to verify',
    },
    paymentInformationSubSection: {
      id: 'pl.application:payment.information.subsection',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment Information',
    },
    paymentInformationName: {
      id: 'pl.application:payment.information.name',
      defaultMessage: 'Er allt eins og það á að vera?',
      description: 'Is everything how it is supposed to be?',
    },
    paymentInformationBank: {
      id: 'pl.application:payment.information.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    pensionFund: {
      id: 'pl.application:payment.information.pensionfund',
      defaultMessage: 'Lífeyrissjóður',
      description: 'Pension fund (optional)',
    },
    union: {
      id: 'pl.application:payment.information.union',
      defaultMessage: 'Stéttarfélag (valfrjálst)',
      description: 'Union (optional)',
    },
    privatePensionFund: {
      id: 'pl.application:payment.information.privatePensionFund',
      defaultMessage: 'Séreignarsjóður',
      description: 'Private pension fund',
    },
    privatePensionFundName: {
      id: 'pl.application:payment.information.privatePensionFund.name',
      defaultMessage: 'Óskarðu eftir því að greiða í séreignarsjóð?',
      description: 'Do you wish to pay to a private pension fund?',
    },
    privatePensionFundRatio: {
      id: 'pl.application:payment.information.privatePensionFund.ratio',
      defaultMessage: 'Séreignarsjóður %',
      description: 'Private pension fund %',
    },
    privatePensionFundDescription: {
      id: 'pl.application:payment.information.privatePensionFund.description',
      defaultMessage:
        'Vinsamlegast athugaðu að Fæðingarorlofssjóður greiðir ekki mótframlag í séreignarsjóð.',
      description:
        'Note that Department of Parental Leave does not pay counter-contribution.',
    },
    yesOptionLabel: {
      id: 'pl.application:yes.option.label',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    noOptionLabel: {
      id: 'pl.application:no.option.label',
      defaultMessage: 'Nei',
      description: 'No',
    },
    rightsSection: {
      id: 'pl.application:rights.section',
      defaultMessage: 'Réttindi til fæðingarorlofs',
      description: 'Parental leave rights',
    },
    yourRights: {
      id: 'pl.application:your.rights',
      defaultMessage: 'Réttindin þín',
      description: 'Your rights',
    },
    yourRightsInMonths: {
      id: 'pl.application:your.rights.inMonths',
      defaultMessage: '{months} mánuðir sjálfstæður réttur',
      description: '{months} months individual rights',
    },
    yourRightsInMonthsAndDay: {
      id: 'pl.application:your.rights.inMonthsAndDay',
      defaultMessage: '{months} mánuðir og {day} dagur sjálfstæður réttur',
      description: '{months} months and {day} day individual rights',
    },
    yourRightsInMonthsAndDays: {
      id: 'pl.application:your.rights.inMonthsAndDays',
      defaultMessage: '{months} mánuðir og {day} dagar sjálfstæður réttur',
      description: '{months} months {day} days individual rights',
    },
    theseAreYourRights: {
      id: 'pl.application:these.are.your.rights',
      defaultMessage: 'Þetta eru réttindin þín',
      description: 'These are your rights',
    },
    rightsDescription: {
      id: 'pl.application:rights.description',
      defaultMessage:
        'Sjálfstæður réttur hvers foreldris er sex mánuðir í fæðingarorlof, en annað foreldrið má yfirfæra allt að einn mánuð af sínum réttindum yfir á hitt foreldrið.',
      description: `Both parents have 6 months, but can transfer up to 45 days to the other parent.`,
    },
    requestRightsName: {
      id: 'pl.application:request.rights.name',
      defaultMessage:
        'Óskarðu eftir að fá allt að einn mánuð af réttindum hins foreldrisins yfirfært yfir á þig?',
      description: 'Do you want to request extra time from the other parent?',
    },
    day: {
      id: 'pl.application:day',
      defaultMessage: 'dagur',
      description: 'day',
    },
    days: {
      id: 'pl.application:days',
      defaultMessage: 'dagar',
      description: 'days',
    },
    month: {
      id: 'pl.application:month',
      defaultMessage: 'mánuður',
      description: 'month',
    },
    months: {
      id: 'pl.application:months',
      defaultMessage: 'mánuðir',
      description: 'months',
    },
    requestRightsDaysTitle: {
      id: 'pl.application:request.rights.daysTitle',
      defaultMessage: 'Hversu marga daga viltu biðja um?',
      description: 'How many days would you like to request?',
    },
    requestRightsDay: {
      id: 'pl.application:request.rights.day',
      defaultMessage: '{day} dagur óskað eftir af rétti hins foreldrisins',
      description: "{day} day requested from the other parent's rights",
    },
    requestRightsDays: {
      id: 'pl.application:request.rights.days',
      defaultMessage: '{day} dagar óskað eftir af rétti hins foreldrisins',
      description: "{day} days requested from the other parent's rights",
    },
    requestRightsMonths: {
      id: 'pl.application:request.rights.months',
      defaultMessage: 'óskað eftir af rétti hins foreldrisins',
      description: "1 month requested from the other parent's rights",
    },
    monthsTotal: {
      id: 'pl.application:months.total',
      defaultMessage: 'Samtals: {months} mánuðir *',
      description: 'Total: {months} months *',
    },
    rangeStartDate: {
      id: 'pl.application:range.startDate',
      defaultMessage: 'Upphafsdagur þinn er:',
      description: 'Your start day is:',
    },
    rangeEndDate: {
      id: 'pl.application:range.endDate',
      defaultMessage: 'Lokadagur þinn er:',
      description: 'Your end day is:',
    },
    transferRightsTitle: {
      id: 'pl.application:transferRights.title',
      defaultMessage: 'Tilfærsla réttinda',
      description: 'Transferal of rights',
    },
    transferRightsDescription: {
      id: 'pl.application:transferRights.description',
      defaultMessage:
        'Hægt er að færa allt að 45 daga á milli foreldra. Athugaðu að ef þú óskar eftir dögum þá þarf hitt foreldrið að samþykkja það.',
      description:
        'You can transfer up to {days} between parents. Note that if you choose to request days then the other parent will need to approve it.',
    },
    transferRightsNone: {
      id: 'pl.application:transferRights.option.none',
      defaultMessage: 'Ég vil ekki færa daga',
      description: 'I do not want to transfer days',
    },
    transferRightsRequest: {
      id: 'pl.application:transferRights.option.request',
      defaultMessage: 'Ég vil óska eftir dögum frá hinu foreldrinu',
      description: 'I want to request days from the other parent',
    },
    transferRightsGive: {
      id: 'pl.application:transferRights.option.give',
      defaultMessage: 'Ég vil færa daga yfir á hitt foreldrið',
      description: 'I want to give days to the other parent',
    },
    rightsTotalSmallPrint: {
      id: 'pl.application:months.total.smallprint',
      defaultMessage:
        '* Hitt foreldrið þarf að samþykkja beiðni þína ef þú óskaðir eftir\n' +
        '            yfirfærslu af réttindum þess til fæðingarorlofs. Ef hitt foreldrið\n' +
        '            neitar beiðni þinni, þá þarftu að breyta umsókn þinni aftur.',
      description:
        ' * The other parent has to approve if you requested extra month from\n' +
        '            their share. If they reject your request, you will have to change\n' +
        '            your application.',
    },
    requestRightsDescription: {
      id: 'pl.application:request.rights.description',
      defaultMessage: `Hitt foreldrið má yfirfæra allt að 45 dagar af réttindum þess yfir á þig. Kjósir þú að óska eftir þessu, þá þarf hitt foreldrið að samþykkja beiðni þína.`,
      description: `The other parent can transfer up to 45 days of their rights`,
    },
    requestRightsYes: {
      id: 'pl.application:request.rights.yes',
      defaultMessage:
        'Já, ég óska eftir yfirfærslu á réttindum frá hinu foreldrinu',
      description: 'Yes, I want to request extra time from my partner',
    },
    requestRightsNo: {
      id: 'pl.application:request.rights.no',
      defaultMessage: 'Nei, ég mun einungis nota mín réttindi',
      description: 'No, I will only use my rights',
    },
    giveRightsName: {
      id: 'pl.application:give.rights.name',
      defaultMessage:
        'Viltu yfirfæra allt að mánuð af þínum réttindum yfir á hitt foreldrið?',
      description:
        'Do you want to transfer up to one month of your parental leave rights to the other parent?',
    },
    giveRightsDaysTitle: {
      id: 'pl.application:give.rights.daysTitle',
      defaultMessage: 'Hve marga daga viltu gefa?',
      description: 'How many days would you like to give?',
    },
    giveRightsDescription: {
      id: 'pl.application:give.rights.description',
      defaultMessage: `Þú getur yfirfært allt að 45 dagar af þínum réttindum yfir á hitt foreldrið`,
      description: `You can give the other parent up to 45 days of your rights`,
    },
    giveRightsDay: {
      id: 'pl.application:give.rights.day',
      defaultMessage: '{day} dagur yfirfærður til hins foreldrisins',
      description: '{day} day given to the other parent',
    },
    giveRightsDays: {
      id: 'pl.application:give.rights.days',
      defaultMessage: '{day} dagar yfirfærður til hins foreldrisins',
      description: '{day} days given to the other parent',
    },
    giveRightsMonths: {
      id: 'pl.application:give.rights.months',
      defaultMessage: '1 mánuður yfirfærður til hins foreldrisins',
      description: '1 month given to the other parent',
    },
    giveRightsYes: {
      id: 'pl.application:give.rights.yes',
      defaultMessage: `Já, ég vil yfirfæra allt að 45 dagar af mínum réttindum til hins foreldrisins`,
      description: `Yes, I wish to give up to 45 days to the other parent`,
    },
    giveRightsNo: {
      id: 'pl.application:give.rights.no',
      defaultMessage: 'Nei, ég vil fullnýta réttindin mín',
      description: 'No, I want to keep my rights to myself',
    },
    rightsSummarySubSection: {
      id: 'pl.application:rights.summary.subsection',
      defaultMessage: 'Réttindi - samantekt',
      description: 'Rights summary',
    },
    rightsSummaryName: {
      id: 'pl.application:rights.summary.name',
      defaultMessage: 'Áætluð mánaðarleg útborgun í fæðingarorlofinu þínu',
      description: 'Estimated monthly salary for your parental leave',
    },
    introductionProvider: {
      id: 'pl.application:introduction.provider',
      defaultMessage: 'Sækja gögn',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'pl.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    dateOfBirthTitle: {
      id: 'pl.application:dateOfBirth.title',
      defaultMessage: 'Fæðingardagur',
      description: 'Birth date',
    },
    userProfileInformationTitle: {
      id: 'pl.application:userprofile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    userProfileInformationSubTitle: {
      id: 'pl.application:userprofile.subtitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa stillt netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
    familyInformationTitle: {
      id: 'pl.application:familyinformation.title',
      defaultMessage: 'Upplýsingar um fjölskyldumeðlimi',
      description: 'Your family information',
    },
    familyInformationSubTitle: {
      id: 'pl.application:familyinformation.subtitle',
      defaultMessage: 'Nafn, kennitala og tengsl',
      description: 'Name, national registry id and type of relation',
    },
    pregnancyStatusAndRightsError: {
      id: 'pl.application:pregnancyStatusAndRights.error',
      defaultMessage:
        'Ekki er hægt að ná fæðingardegi barnsins og ekki er hægt að reikna réttindin.',
      description: 'Error message for pregnancy status and rights providers',
    },
    childrenError: {
      id: 'pl.application:children.error',
      defaultMessage:
        'Engin börn fundust. Það fannst enginn áætlaður fæðingardagur né virk umsókn um fæðingarorlof.',
      description: `When no children is found. Can be because the primary parent didn't assign the secondary parent yet or if it's not part of the system yet.`,
    },
    childrenInformationTitle: {
      id: 'pl.application:expectedDateOfBirth.title',
      defaultMessage: 'Áætlaður fæðingardagur',
      description: 'Expected birth date',
    },
    childrenInformationSubTitle: {
      id: 'pl.application:expectedDateOfBirth.subtitle',
      defaultMessage: 'Staðfesting á að það sé yfir höfuð barn á leiðinni',
      description: 'Confirmation on date of birth',
    },
    salaryInformationTitle: {
      id: 'pl.application:permission.salaryInformation.title',
      defaultMessage: 'Upplýsingar um laun',
      description: 'Salary information',
    },
    salaryInformationSubTitle: {
      id: 'pl.application:permission.salaryInformation.subtitle',
      defaultMessage: 'Sóttar til Skattsins.',
      description: 'Salary information will be fetched from the tax office.',
    },
    salaryTitle: {
      id: 'pl.application:salary.title',
      defaultMessage: 'Áætlaður fæðingardagur barns',
      description: 'Estimated date of birth of a child',
    },
    salaryLabelYear: {
      id: 'pl.application:salary.label.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    salaryLabelMonth: {
      id: 'pl.application:salary.label.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    salaryLabelUnion: {
      id: 'pl.application:salary.label.union',
      defaultMessage: 'Stéttarfélag',
      description: 'Union',
    },
    salaryLabelPensionFund: {
      id: 'pl.application:salary.label.pensionfund',
      defaultMessage: 'Lífeyrissjóður',
      description: 'Pension fund',
    },
    salaryLabelTax: {
      id: 'pl.application:salary.label.tax',
      defaultMessage: 'Skattur',
      description: 'Tax',
    },
    salaryLabelPaidAmount: {
      id: 'pl.application:salary.label.paidamount',
      defaultMessage: 'Útborgun',
      description: 'Paid amount',
    },
    salaryLabelShowMore: {
      id: 'pl.application:salary.label.seeMore',
      defaultMessage: 'Sjá meira',
      description: 'See more',
    },
    salaryLabelShowLess: {
      id: 'pl.application:salary.label.seeLess',
      defaultMessage: 'Sjá minna',
      description: 'See less',
    },
    usageSubsection: {
      id: 'pl.application:usage.subsection',
      defaultMessage: 'Ráðstöfun',
      description: 'Usage',
    },
    usage: {
      id: 'pl.application:usage',
      defaultMessage: 'Hvað ætlar þú að nýta þér marga mánuði í fæðingarorlof?',
      description: 'How many months are you going to take paternity leave?',
    },
    calculationsSubsection: {
      id: 'pl.application:calculations.subsection',
      defaultMessage: 'Útreikningur',
      description: 'Calculation',
    },
    periods: {
      id: 'pl.application:periods',
      defaultMessage: 'Viltu breyta eða skipta upp tímabilinu?',
      description: 'Do you want to change or split the period?',
    },
    periodsSection: {
      id: 'pl.application:periods.section',
      defaultMessage: 'Tilhögun fæðingarorlofs',
      description: 'Leave periods',
    },
    periodsImageTitle: {
      id: 'pl.application:periods.image.title',
      defaultMessage: 'Nú skulum við skipuleggja tíma þinn með barninu þínu',
      description: "Let's plan your time with the baby",
    },
    firstPeriodName: {
      id: 'pl.application:first.period.name',
      defaultMessage: 'Fyrsta tímabil orlofsins',
      description: 'First leave period',
    },
    periodAllAtOnce: {
      id: 'pl.application:period.all.at.once',
      defaultMessage: 'Viltu taka fæðingarorlofið allt í einu lagi?',
      description: 'Do you plan to take your leave all at once?',
    },
    periodAllAtOnceDescription: {
      id: 'pl.application:period.all.at.once.description',
      defaultMessage:
        'Sumir óska þess að taka allt fæðingarorlofið í einu lagi, meðan aðrir kjósa að skipta því upp í nokkur tímabil.',
      description:
        'Some people choose to take the full leave all at once, while others choose to split their leave into separate periods.',
    },
    periodAllAtOnceYes: {
      id: 'pl.application:period.all.at.once.yes',
      defaultMessage: 'Já, ég vil taka fæðingarorlofið allt í einu lagi.',
      description: 'Yes, I plan to take my leave all at once',
    },
    periodAllAtOnceNo: {
      id: 'pl.application:period.all.at.once.no',
      defaultMessage:
        'Nei, ég vil skipta fæðingarorlofinu mínu upp í fleiri tímabil og/eða teygja það yfir lengra tímabil.',
      description:
        'I want to customize my leave into multiple periods and/or to stretch it out over time at less than 100% time off.',
    },
  }),

  selectChild: defineMessages({
    screenTitle: {
      id: 'pl.application:selectChild.screenTitle',
      defaultMessage: 'Veldu barn',
      description: 'Choose a child',
    },
    screenDescription: {
      id: 'pl.application:selectChild.screenDescription',
      defaultMessage: 'Börn sem þú getur sótt um fæðingarorlof fyrir.',
      description: 'Children you can apply for parental leave.',
    },
    activeApplications: {
      id: 'pl.application:selectChild.activeApplications',
      defaultMessage: 'Virkar umsóknir',
      description: 'Active applications',
    },
    choose: {
      id: 'pl.application:selectChild.choose',
      defaultMessage: 'Velja',
      description: 'Choose',
    },
    baby: {
      id: 'pl.application:selectChild.baby',
      defaultMessage: 'Barn væntanlegt {dateOfBirth}',
      description: 'Child copy radio button',
    },
    primaryParent: {
      id: 'pl.application:selectChild.primaryParent',
      defaultMessage: 'Þú ert aðalforeldri barnsins',
      description: 'Primary parent copy',
    },
    secondaryParent: {
      id: 'pl.application:selectChild.secondaryParent',
      defaultMessage:
        'Þú ert efri foreldri barnsins. Aðalforeldri er {nationalId}',
      description: 'Secondary parent copy',
    },
  }),

  notEligible: defineMessages({
    screenDescription: {
      id: 'pl.application:notEligible.screenDescription',
      defaultMessage: 'Börn sem þú getur sótt um fæðingarorlof fyrir',
      description: 'Children you can apply for parental leave',
    },
    title: {
      id: 'pl.application:notEligible.title',
      defaultMessage: 'Börn sem þú getur sótt um fyrir',
      description: 'Children you can apply for',
    },
    choose: {
      id: 'pl.application:notEligible.choose',
      defaultMessage: 'Velja',
      description: 'Choose',
    },
  }),

  applicant: defineMessages({
    subSection: {
      id: 'pl.application:applicant.subSection',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    title: {
      id: 'pl.application:applicant.title',
      defaultMessage: 'Er þetta réttur sími og netfang?',
      description: 'What is your email and phone number?',
    },
    description: {
      id: 'pl.application:applicant.description',
      defaultMessage: 'Vinsamlegast breyttu ef þetta er ekki rétt.',
      description: 'Please make changes if this is invalid.',
    },
    email: {
      id: 'pl.application:applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phoneNumber: {
      id: 'pl.application:applicant.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
  }),

  errors: defineMessages({
    loading: {
      id: 'pl.application:errors.loading',
      defaultMessage: 'Úps! Eitthvað fór úrskeiðis',
      description: 'Oops! Something went wrong',
    },
    requiredAnswer: {
      id: 'pl.application:errors.required.answer',
      defaultMessage:
        'Þú verður að svara þessari spurningu til að halda áfram.',
      description: 'You need to answer this question to continue.',
    },
  }),

  personalAllowance: defineMessages({
    useYours: {
      id: 'pl.application:use.personal.allowance',
      defaultMessage: 'Viltu nýta persónuafsláttinn þinn?',
      description: 'Do you wish to use your personal allowance',
    },
    useFromSpouse: {
      id: 'pl.application:use.personal.allowance.spouse',
      defaultMessage: 'Viltu nýta persónuafsláttinn maka þíns?',
      description:
        'Do you wish to use the personal allowance from your spouse?',
    },
    title: {
      id: 'pl.application:personal.allowance.title',
      defaultMessage: 'Persónuafsláttur',
      description: 'Personal Discount',
    },
    description: {
      id: 'pl.application:personal.allowance.description',
      defaultMessage:
        'Hægt er að biðja um að nýta eins mikinn persónuafslátt og þú mögulega átt rétt á, eða stimpla inn ákveðið hlutfall.',
      description:
        'You can ask to take advantage as much personal allowance as you may be entitled to, or stamp a rate.',
    },
    spouseTitle: {
      id: 'pl.application:personal.allowance.from.spouse.title',
      defaultMessage: 'Beiðni um persónuafslátt frá maka',
      description: 'Personal Discount from spouse',
    },
    spouseDescription: {
      id: 'pl.application:personal.allowance.from.spouse.description',
      defaultMessage:
        'Makinn þinn fær tilkynningu og þarf að samþykkja þessa beiðni. Hægt er að biðja um að nýta eins mikinn persónuafslátt og þú mögulega átt rétt á, eða stimpla inn ákveðið hlutfall.',
      description: 'Translation needed',
    },
    useAsMuchAsPossibleFromSpouse: {
      id: 'pl.application:personal.allowance.useAsMuchAsPossibleFromSpouse',
      defaultMessage: 'Viltu fullnýta persónuafslátt maka?',
      description:
        "We ask the user if they want to use as much of the spouse's personal allowance as they can.",
    },
    useAsMuchAsPossible: {
      id: 'pl.application:personal.allowance.useAsMuchAsPossible',
      defaultMessage:
        'Viltu nota eins mikið af persónuafslættinum og þú hefur rétt á?',
      description: 'Do you wish to use as much personal allowance as possible?',
    },
    manual: {
      id: 'pl.application:personal.allowance.manual',
      defaultMessage: 'Hvað viltu nota hátt hlutfall af persónuafslættinum?',
      description: 'What percentage do you want to use?',
    },
    zeroToHundred: {
      id: 'pl.application:personal.allowance.zeroToHundred',
      defaultMessage: 'Stimplaðu inn tölu á bilinu 0-100',
      description: 'Type a number from 0 to 100',
    },
    allowanceUsage: {
      id: 'pl.application:allowance.allowance.usage',
      defaultMessage: 'Hlutfall af persónuafslættinum',
      description: 'Review copy for the usage percentage',
    },
  }),

  leavePlan: defineMessages({
    subSection: {
      id: 'pl.application:periods.subsection',
      defaultMessage: 'Bættu við fleiri tímabilum',
      description: 'Add more periods',
    },
    title: {
      id: 'pl.application:leave.plan.title',
      defaultMessage: 'Hér er tilhögun fæðingarorlofsins þíns',
      description: 'Here is your current leave plan',
    },
    emptyDescription: {
      id: 'pl.application:leave.plan.emptyDescription',
      defaultMessage: 'Nú er komið að því að velja tímabil',
      description: 'Description when no period has been added',
    },
    description: {
      id: 'pl.application:leave.plan.description',
      defaultMessage:
        'Þetta eru þau tímabil sem þú hefur nú þegar valið til að haga fæðingarorlofinu þínu. Ef hitt foreldrið hefur samþykkt að deila upplýsingum um tilhögun fæðingarorlofsins síns með þér, þá sjást þau tímabil einnig.',
      description:
        'These are your already selected parental leave periods. If the other parent has agreed to share their period leave information, then those period leaves are visible below.',
    },
    addFirst: {
      id: 'pl.application:periods.add.first',
      defaultMessage: 'Búa til fyrsta tímabilið',
      description: 'Create first period',
    },
    addAnother: {
      id: 'pl.application:periods.add.another',
      defaultMessage: 'Bættu við öðru tímabili',
      description: 'Add another period',
    },
    change: {
      id: 'pl.application:periods.change',
      defaultMessage: 'Breyta tilhögun fæðingarorlofs',
      description: 'Change the periods',
    },
    limit: {
      id: 'pl.application:periods.limit',
      defaultMessage:
        'Þú hefur náð þeim mörkum sem þú getur tekið fyrir fæðingarorlofinu þínu',
      description:
        'You reached the limit of days you can take for your parental leave',
    },
    usage: {
      id: 'pl.application:period.usage',
      defaultMessage: 'Þú hefur notað {alreadyUsed} af {rights} dögum',
      description: 'Copy of how many days are being used and how many are left',
    },
    cannotCreatePeriod: {
      id: 'pl.application:period.cannotCreatePeriod',
      defaultMessage:
        'Þú átt bara eftir {daysLeft} daga og lágmarkslengd tímabils eru {minimumNumberOfDays} dagar',
      description:
        'Copy to explain why a user cannot add a new period even though there are some days left of rights but they are < minimum number of days',
    },
    empty: {
      id: 'pl.application:period.empty',
      defaultMessage: 'Ekkert tímabil valið',
      description: 'Copy when no period has been added',
    },
  }),

  firstPeriodStart: defineMessages({
    title: {
      id: 'pl.application:periods.first.period.title',
      defaultMessage: 'Hvenær viltu hefja fæðingarorlofið?',
      description: 'When do you want to start your parental leave',
    },
    description: {
      id: 'pl.application:periods.first.period.description',
      defaultMessage: `Athugaðu að ekki er hægt að nýta réttindi til fæðingarorlofs 24 mánuðum eftir fæðingu barnsins.`,
      description: `Please note, that your rights end 24 months after the date of birth.`,
    },
    estimatedDateOfBirthOption: {
      id: 'pl.application:periods.first.period.estimatedDateOfBirth',
      defaultMessage: 'Ég vil byrja á áætluðum fæðingardegi',
      description:
        'When a user first picks the period start date, they will have three options (estimated dob, actual dob, and certain a date)',
    },
    dateOfBirthOption: {
      id: 'pl.application:periods.first.period.actualDateOfBirth',
      defaultMessage: 'Ég vil byrja frá raunverulegum fæðingardegi',
      description:
        'When a user first picks the period start date, they will have three options (estimated dob, actual dob, and certain a date)',
    },
    specificDateOption: {
      id: 'pl.application:periods.first.period.specificDate',
      defaultMessage: 'Ég vil byrja á ákveðinni dagsetningu',
      description:
        'When a user first picks the period start date, they will have three options (estimated dob, actual dob, and certain a date)',
    },
    specificDateOptionTooltip: {
      id: 'pl.application:periods.first.period.specificDate.tooltip',
      defaultMessage:
        'Ef barnið fæðist á annarri dagsetningu en áætlað er, þá mun fæðingarorlofið og lengd þess EKKI aðlagast út frá raunverulegum fæðingardegi barnsins ef þessi valmöguleiki er valinn.',
      description:
        'If the child is born on another date than the expected date of birth, the parental leave and its duration will NOT adjust to the real date of birth',
    },
  }),

  endDate: defineMessages({
    title: {
      id: 'pl.application:end.date.title',
      defaultMessage: 'Vinsamlegast veldu lokadag tímabilsins',
      description: 'Please pick the end date',
    },
    description: {
      id: 'pl.application:end.date.description',
      defaultMessage: `Athugaðu að ekki er hægt að nýta réttindi til fæðingarorlofs 24 mánuðum eftir fæðingu barnsins. Fæðingarorlof getur styst verið 14 dagar.`,
      description: `Please note, that your parental leave rights end 24 months after the date of birth. A parental leave period can be no shorter than 14 days.`,
    },
    label: {
      id: 'pl.application:end.date.label',
      defaultMessage: 'Lokadagur',
      description: 'End date',
    },
    placeholder: {
      id: 'pl.application:end.date.placeholder',
      defaultMessage: 'Veldu lokadag tímabilsins',
      description: 'Pick the end date',
    },
  }),

  startDate: defineMessages({
    title: {
      id: 'pl.application:start.date.title',
      defaultMessage: 'Vinsamlegast veldu upphafsdag tímabilsins',
      description: 'Please pick the start date',
    },
    description: {
      id: 'pl.application:start.date.description',
      defaultMessage: `Athugaðu að ekki er hægt að nýta réttindi til fæðingarorlofs 24 mánuðum eftir fæðingu barnsins.`,
      description: `Please note, that your parental leave rights end 24 months after the date of birth`,
    },
    label: {
      id: 'pl.application:start.date.label',
      defaultMessage: 'Upphafsdagur',
      description: 'Start date',
    },
    placeholder: {
      id: 'pl.application:start.date.placeholder',
      defaultMessage: 'Veldu upphafsdaginn',
      description: 'Pick the start date',
    },
  }),

  duration: defineMessages({
    title: {
      id: 'pl.application:duration.title',
      defaultMessage: 'Vinsamlegast staðfestu lengd tímabilsins',
      description: 'Please confirm your leave duration',
    },
    description: {
      id: 'pl.application:duration.description',
      defaultMessage:
        'Hægt er að velja lengd tímabilsins í fjölda mánaða, eða velja ákveðna endadagsetningu. Fæðingarorlof getur styst verið tvær vikur í senn',
      description: 'Add translation',
    },
    monthsOption: {
      id: 'pl.application:duration.months.option',
      defaultMessage: 'Í fjölda mánaða',
      description: 'A certain duration in months',
    },
    specificDateOption: {
      id: 'pl.application:duration.specific.date.option',
      defaultMessage: 'Fram að ákveðinni dagsetningu',
      description: 'Until a specific date',
    },
    monthsDescription: {
      id: 'pl.application:duration.months.description',
      defaultMessage:
        'Hægt er að dreifa rétti sínum yfir lengra tímabil en það hefur bein áhrif á greiðslur til þín úr fæðingarorlofssjóði. Dragðu stikuna til að stilla lengd tímabilsins ímánuðum.',
      description: 'Add translation',
    },
    paymentsRatio: {
      id: 'pl.application:duration.payments.ratio',
      defaultMessage:
        'Fyrir svona langt tímabil fást greiðslur að hlutfalli af hámarksréttindum þínum: ',
      description: 'For this length of time you will get payments up to',
    },
  }),

  employer: defineMessages({
    subSection: {
      id: 'pl.application:employer.subsection',
      defaultMessage: 'Vinnuveitandi',
      description: 'Employer',
    },
    title: {
      id: 'pl.application:employer.title',
      defaultMessage: 'Hver er vinnuveitandi þinn?',
      description: 'Who is your employer?',
    },
    description: {
      id: 'pl.application:employer.description',
      defaultMessage:
        'Vinnuveitandinn þinn þarf að samþykkja tilhögun fæðingarorlofsins þíns. ' +
        'Þegar þú hefur sent umsóknina inn mun verða sendur vefpóstur á þetta netfang hér fyrir neðan. ' +
        'Viðtakandi vefpóstsins mun fá aðgang að umsókninni, en einungis sjá upplýsingar sem varða tilhögun fæðingarorlofs.' +
        'Ef vinnuveitandinn þinn hafnar umsókninni, þá fer umsóknin aftur á ákveðinn byrjunarreit, þar sem þú getur sótt um aftur.',
      description: 'Add translation',
    },
    email: {
      id: 'pl.application:employer.email',
      defaultMessage: 'Netfang vinnuveitanda',
      description: 'Employer email',
    },
    emailConfirm: {
      id: 'pl.application:employer.email.confirm',
      defaultMessage: 'Staðfestu netfang vinnuveitanda',
      description: 'Confirm employer email',
    },
  }),

  selfEmployed: defineMessages({
    title: {
      id: 'pl.application:selfEmployed.title',
      defaultMessage: 'Ertu sjálfstætt starfandi?',
      description: 'Are you self employed?',
    },
    description: {
      id: 'pl.application:selfEmployed.description',
      defaultMessage:
        'Sjáflstætt starfandi einstaklingar þurfa að skila staðfestingu á lækkun á reiknuðu endurgjaldi ef við á.',
      description: 'Add translation',
    },
    attachmentTitle: {
      id: 'pl.application:selfEmployed.attachment.title',
      defaultMessage: 'Reiknað endurgjald',
      description: 'Title for the attachement required for self employed',
    },
    attachmentDescription: {
      id: 'pl.application:selfEmployed.attachment.description',
      defaultMessage:
        'Sjálfstætt starfandi foreldri þarf að skila staðfestingu á lækkun á reiknuðu endurgjaldi ef við á (fæst hjá RSK).',
      description: 'Description for the attachement required for self employed',
    },
    attachmentButton: {
      id: 'pl.application:selfEmployed.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Button copy for the self employed attachement',
    },
  }),

  ratio: defineMessages({
    title: {
      id: 'pl.application:ratio.title',
      defaultMessage:
        'Hversu hátt hlutfall viltu að fæðingarorlofið sé af starfshlutfalli þínu?',
      description: 'What percent off will you take for this period?',
    },
    description: {
      id: 'pl.application:ratio.description',
      defaultMessage:
        '100% þýðir að þú sért í fullu fæðingarorlofi. Lægra hlutfall hefur bein áhrif á greiðslur til þín úr fæðingarorlofssjóði. Sumir velja 50% fæðingarorlof á móti 50% starfi.',
      description:
        'For example, you could work 50% of the time, and have 50% paid leave.',
    },
    label: {
      id: 'pl.application:ratio.label',
      defaultMessage: 'Hlutfall fæðingarorlofs',
      description: 'Percent leave',
    },
    placeholder: {
      id: 'pl.application:ratio.placeholder',
      defaultMessage: 'Veldu þitt hlutfall',
      description: 'Pick your percent',
    },
  }),

  paymentPlan: defineMessages({
    subSection: {
      id: 'pl.application:paymentPlan.subSection',
      defaultMessage: 'Greiðsluáætlun',
      description: 'Payment Plan',
    },
    title: {
      id: 'pl.application:paymentPlan.title',
      defaultMessage: 'Hér er núverandi greiðsluáætlunin þín',
      description: 'Here is your current payment plan',
    },
    description: {
      id: 'pl.application:paymentPlan.description',
      defaultMessage:
        'Heildargreiðslur á mánuði reiknast að hámarki 80% af meðallaunum umsækjanda á ákveðnu tímabili fyrir fæðingu barnsins, en þó ekki hærri en 600.000 kr.',
      description:
        'Payments amount to 80% of the average of the parent’s total wages during a specific period before the birth of the child.',
    },
  }),

  shareInformation: defineMessages({
    subSection: {
      id: 'pl.application:shareInformation.subSection',
      defaultMessage: 'Deila upplýsingum með hinu foreldrinu',
      description: 'Share information with the other parent',
    },
    title: {
      id: 'pl.application:shareInformation.title',
      defaultMessage:
        'Viltu deila upplýsingum um tilhögun fæðingarorlofsins þíns með hinu foreldrinu',
      description:
        'Do you want to share your leave information with the other parent?',
    },
    description: {
      id: 'pl.application:shareInformation.description',
      defaultMessage:
        'Það einfaldar fólki að skipuleggja fæðingarorlofið sitt þar sem þá fær það að sjá þau tímabil sem hitt foreldrið valdi.',
      description:
        'Some people share their information to coordinate their parental leaves.',
    },
    yesOption: {
      id: 'pl.application:shareInformation.yes',
      defaultMessage:
        'Já, ég vil deila þessum upplýsingum með hinu foreldrinu.',
      description:
        'Yes, I want to share my leave information with the other parent.',
    },
    noOption: {
      id: 'pl.application:shareInformation.no',
      defaultMessage:
        'Nei, ég vil ekki deila þessum upplýsingum að svo stöddu.',
      description: 'No, I do not want to share my information.',
    },
  }),

  rightOfAccess: defineMessages({
    title: {
      id: 'pl.application:rightOfAccess.title',
      defaultMessage: 'Staðfesting á umgengnisrétti forsjárlauss foreldris',
      description: 'Add translation',
    },
    description: {
      id: 'pl.application:rightOfAccess.description',
      defaultMessage:
        'Þar sem valið foreldri er ekki skráð/ur í sambúð með þér þá þarf að staðfesta umgengnisrétt þess sem forsjárlaust foreldri.',
      description: 'Add translation',
    },
    yesOption: {
      id: 'pl.application:rightOfAccess.yesOption',
      defaultMessage:
        'Ég innsrkáður umsækjandi veiti forsjárlausu foreldri samþykki mitt fyrir umgengni í þessu fæðingarorlofi',
      description: 'Add translation',
    },
  }),

  reviewScreen: defineMessages({
    titleInReview: {
      id: 'pl.application:review.titleInReview',
      defaultMessage: 'Umsókn þín er í skoðun',
      description: 'Your application is in review',
    },
    titleApproved: {
      id: 'pl.application:review.titleApproved',
      defaultMessage: 'Umsókn þín er samþykkt',
      description: 'Your application is in approved',
    },
    estimatedBirthDate: {
      id: 'pl.application:review.estimatedBirthDate',
      defaultMessage: 'Áætlaður fæðingardagur',
      description: 'Estimated date of birth',
    },
    desc: {
      id: 'pl.application:review.desc',
      defaultMessage: 'Hér að neðan eru skrefin sem gerast næst.',
      description: 'Below are the steps that will happen next.',
    },
    descReview: {
      id: 'pl.application:review.descReview',
      defaultMessage: 'Hér að neðan er umsókn þín sem þú sendir inn.',
      description: 'Below is your submitted application.',
    },
    buttonsView: {
      id: 'pl.application:review.buttonsView',
      defaultMessage: 'Skoða forrit',
      description: 'View application',
    },
    buttonsViewProgress: {
      id: 'pl.application:review.buttonsViewProgress',
      defaultMessage: 'Skoða framfarir',
      description: 'View progress',
    },
    buttonsEdit: {
      id: 'pl.application:review.buttonsEdit',
      defaultMessage: 'Breyta / bæta við tímabilum',
      description: 'Edit or add periods to the application',
    },
    editApplicationModalTitle: {
      id: 'pl.application:review.edit.modal.title',
      defaultMessage: 'Breyta umsókn?',
      description: 'Edit application?',
    },
    editApplicationModalDesc: {
      id: 'pl.application:review.edit.modal.desc',
      defaultMessage:
        'Ef þú heldur áfram að breyta umsókn þinni, þá verður að endurtaka sumar eða allar samþykktirnar.',
      description:
        'If you continue to edit your submitted application, then some or all of the approvals will have to be repeated.',
    },
    editApplicationModalAria: {
      id: 'pl.application:review.edit.modal.aria',
      defaultMessage:
        'Venjulegur valmynd til að staðfesta hvort þú viljir breyta forritinu.',
      description:
        'A modal dialog to confirm if you want to edit your application.',
    },
    editApplicationModalConfirmButton: {
      id: 'pl.application:review.edit.modal.confirmButton',
      defaultMessage: 'Haltu áfram',
      description: 'Continue',
    },
    editApplicationModalCancelButton: {
      id: 'pl.application:review.edit.modal.cancelButton',
      defaultMessage: 'Hætta við',
      description: 'Cancel',
    },
    otherParentTitle: {
      id: 'pl.application:review.otherParent.title',
      defaultMessage: 'Annað foreldri samþykkir umsóknina',
      description: 'Other parent approves the application',
    },
    otherParentDescRequestingBoth: {
      id: 'pl.application:review.otherParent.otherParentDescRequestingBoth',
      defaultMessage:
        'Hitt foreldrið þarf að samþykkja aukadagana sem þú hefur beðið um og notkun persónuafsláttarins.',
      description:
        'The other parent will need to approve the extra days you’ve requested and the use of their personal allowance.',
    },
    otherParentDescRequestingRights: {
      id: 'pl.application:review.otherParent.otherParentDescRequestingRights',
      defaultMessage:
        'Hitt foreldrið þarf að samþykkja aukadagana sem þú hefur beðið um.',
      description:
        'The other parent will need to approve the extra days you’ve requested.',
    },
    otherParentDescRequestingPersonalDiscount: {
      id:
        'pl.application:review.otherParent.otherParentDescRequestingPersonalDiscount',
      defaultMessage:
        'Hitt foreldrið þarf að samþykkja notkun persónuafsláttar síns.',
      description:
        'The other parent will need to approve the use of their personal discount.',
    },
    employerTitle: {
      id: 'pl.application:review.employer.title',
      defaultMessage: 'Vinnuveitandi samþykkir leyfi þitt',
      description: 'Employer approves your leave',
    },
    employerDesc: {
      id: 'pl.application:review.employer.description',
      defaultMessage:
        'Vinnuveitandi þinn mun staðfesta dagsetningar fæðingarorlofs þíns.',
      description:
        'Your employer will confirm the dates of your parental leave.',
    },
    deptTitle: {
      id: 'pl.application:review.dept.title',
      defaultMessage: 'Vinnumálastofnun samþykkir umsókn',
      description: 'Vinnumálastofnun approves application',
    },
    deptDesc: {
      id: 'pl.application:review.dept.description',
      defaultMessage:
        'Vinnumálastofnun mun fara yfir og samþykkja umsókn þína.',
      description: 'Vinnumálastofnun will review and approve your application.',
    },
    rightsTotal: {
      id: 'pl.application:review.rights.total',
      defaultMessage: 'Samtals: {months}',
      description:
        'Copy for the total of months for the parental leave on the review screen',
    },
    rightsPersonalMonths: {
      id: 'pl.application:review.rights.personal.months',
      defaultMessage: '{months} persónulegir mánuðir',
      description: 'Copy for the number of personal months',
    },
    rightsAllowanceRequested: {
      id: 'pl.application:review.rights.allowance.requested',
      defaultMessage: '{requested} mánuður veittur af öðru foreldri',
      description: 'Requested months from other parent',
    },
    rightsAllowanceGiven: {
      id: 'pl.application:review.rights.allowance.given',
      defaultMessage: '{given} mánuður gefinn hinu foreldrinu',
      description: 'Given months to the other parent',
    },
    period: {
      id: 'pl.application:review.period',
      defaultMessage: 'Tímabilinu {index} - {ratio}%',
      description: 'Period copy',
    },
    periodActualDob: {
      id: 'pl.application:review.period.actual.dob',
      defaultMessage: 'Raunverulegum fæðingardegi - {duration} mánuðir',
      description: 'Actual DOB period copy',
    },
    usePersonalAllowance: {
      id: 'pl.application:review.use.personal.allowance',
      defaultMessage: 'Nota allan persónuafsláttinn',
      description: 'If parent decided to use all its personal discount',
    },
    useSpousePersonalAllowance: {
      id: 'pl.application:review.use.spouse.personal.allowance',
      defaultMessage: 'Fullnýta persónuafslátt maka',
      description:
        'If parent decided to use all the other parent personal discount',
    },
  }),

  draftFlow: defineMessages({
    draftNotApprovedTitle: {
      id: 'pl.application:draftFlow.requiresAction.title',
      defaultMessage: 'Your application was not approved',
      description: 'Your application was not approved',
    },
    draftNotApprovedOtherParentDesc: {
      id: 'pl.application:draftFlow.requiresAction.otherParentDesc',
      defaultMessage: 'The other parent did not approve your request.',
      description: 'The other parent did not approve your request.',
    },
    draftNotApprovedEmployerDesc: {
      id: 'pl.application:draftFlow.requiresAction.employerDesc',
      defaultMessage: 'Your employer did not approve your application.',
      description: 'Your employer did not approve your application.',
    },
    draftNotApprovedVMLSTDesc: {
      id: 'pl.application:draftFlow.requiresAction.VMLSTDesc',
      defaultMessage: 'Vinnumalastofnun did not approve your application.',
      description: 'Vinnumalastofnun did not approve your application.',
    },
    modifyDraftDesc: {
      id: 'pl.application:draftFlow.modifyDesc',
      defaultMessage:
        'You can make edits to your application and re-submit for consideration.',
      description:
        'You can make edits to your application and re-submit for consideration.',
    },
    modifyDraftButton: {
      id: 'pl.application:draftFlow.modifyDraftButton',
      defaultMessage: 'Make changes',
      description: 'Make changes',
    },
  }),

  editFlow: defineMessages({
    // For EditFlowInReviewSteps
    employerApprovesTitle: {
      id: 'pl.application:editFlow.employer.approves.title',
      defaultMessage: 'Vinnuveitandi samþykkir breytingar þínar á tímabilinu',
      description: 'Employer approves your period edits',
    },
    employerApprovesDesc: {
      id: 'pl.application:editFlow.employer.approves.desc',
      defaultMessage:
        'Vinnuveitandi þinn mun staðfesta breytingarnar sem þú gerðir á foreldraorlofstímabilinu þínu.',
      description:
        'Your employer will confirm the edits you made to your your parental leave periods.',
    },

    // For Requires Action screen (when edits are not approved)
    editsNotApprovedTitle: {
      id: 'pl.application:editFlow.requiresAction.title',
      defaultMessage: 'Your edits were not approved',
      description: 'Your edits were not approved',
    },
    editsNotApprovedEmployerDesc: {
      id: 'pl.application:editFlow.requiresAction.employerDesc',
      defaultMessage:
        'Your edits were not approved by your employer, you can choose to modify them and re-submit or discard the modifications.',
      description:
        'Your edits were not approved by your employer, you can choose to modify them and re-submit or discard the modifications.',
    },
    editsNotApprovedVMLSTDesc: {
      id: 'pl.application:editFlow.requiresAction.VMLSTDesc',
      defaultMessage:
        'Your edits were not approved by Vinnumalastofnun, you can choose to modify them and re-submit or discard the modifications.',
      description:
        'Your edits were not approved by Vinnumalastofnun, you can choose to modify them and re-submit or discard the modifications.',
    },
    editsNotApprovedCTA: {
      id: 'pl.application:editFlow.requiresAction.CTA',
      defaultMessage: 'What action would you like to take?',
      description: 'What action would you like to take?',
    },
    editsNotApprovedEditButton: {
      id: 'pl.application:editFlow.requiresAction.editButtonLabel',
      defaultMessage: 'Modify my edits and re-submit',
      description: 'Modify my edits and re-submit',
    },
    editsNotApprovedDiscardButton: {
      id: 'pl.application:editFlow.requiresAction.discardButtonLabel',
      defaultMessage: 'Discard my edits',
      description: 'Discard my edits',
    },
  }),

  confirmation: defineMessages({
    epxandAll: {
      id: 'pl.application:confirmation.buttons.expandAll',
      defaultMessage: 'Sýna allt',
      description: 'Expand all',
    },
    collapseAll: {
      id: 'pl.application:confirmation.buttons.collapseAll',
      defaultMessage: 'Fela allt',
      description: 'Collapse all',
    },
    section: {
      id: 'pl.application:confirmation.section',
      defaultMessage: 'Samþykkja',
      description: 'Confirmation',
    },
    title: {
      id: 'pl.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    description: {
      id: 'pl.application:confirmation.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description:
        'Please review your information before submitting the application.',
    },
  }),

  finalScreen: defineMessages({
    title: {
      id: 'pl.application:finalscreen.title',
      defaultMessage: 'Til hamingju, hér að neðan eru næstu skref',
      description: 'Congratulations, below are the next steps',
    },
    description: {
      id: 'pl.application:finalscreen.description',
      defaultMessage: `Hitt foreldrið þarf að samþykkja umsókn þína ef þú óskaðir eftir yfirfærslu á
        hluta réttinda þess til þín, eða nýtingu á persónuafslætti þess. Síðan þarf
        vinnuveitandinn þinn að samþykkja tilhögun þína til fæðingarorlofs. Að lokum
        fer umsóknin á borð Fæðingarorlofssjóðs þar sem lokaúrvinnsla hennar fer fram.`,
      description: `The other parent will need to approve your request to use their shared month
        (if you did so). Then, your employer will approve your parental leave dates.
        And finally Vinnumálastofnun will review your application.`,
    },
    step3: {
      id: 'pl.application:finalscreen.step3',
      defaultMessage:
        'Að lokum fer umsóknin á borð Fæðingarorlofssjóðs þar sem lokaúrvinnsla hennar fer fram.',
      description:
        'Finally, the application goes to the Parental Leave Fund, where its final processing takes place.',
    },
  }),
}

export const employerFormMessages = defineMessages({
  formTitle: {
    id: 'pl.application:employer.form.title',
    defaultMessage: 'Samþykki vinnuveitanda fyrir umsókn um fæðingarorlof',
    description: 'Employer approval for parental leave application',
  },
  employerNationalRegistryIdSection: {
    id: 'pl.application:employer.nationalRegistryId.subSection',
    defaultMessage: 'Kennitala fyrirtækis',
    description: 'Company national registry id',
  },
  employerNationalRegistryId: {
    id: 'pl.application:employer.nationalRegistryId',
    defaultMessage: 'Kennitala fyrirtækis',
    description: 'Company national registry id',
  },
  employerNationalRegistryIdDescription: {
    id: 'pl.application:employer.nationalRegistryId.description',
    defaultMessage:
      'Starfsmaður með kennitöluna {nationalId} hefur sótt um fæðingarorlof. Áður en tímabil eru samþykkt þarf að gefa upp kennitölu fyrirtækis.',
    description:
      'An employee with national registry id {id} has applied for parental leave. Before approving you need to enter the companys national registry id',
  },
  confirmationSubSection: {
    id: 'pl.application:employer.confirm.subSection',
    defaultMessage: 'Staðfesting',
    description: 'Confirmation',
  },
  reviewSection: {
    id: 'pl.application:employer.review.section',
    defaultMessage: 'Samþykki vinnuveitanda',
    description: 'Employer approval',
  },
  reviewMultiTitle: {
    id: 'pl.application:employer.review.multi.title',
    defaultMessage:
      'Starfsmaður þinn hefur sótt um fæðingarorlof. Samþykkir þú tímabilið sem hann valdi?',
    description:
      'Your employee has applied for parental leave. Do you approve of his/her selected periods?',
  },
  buttonReject: {
    id: 'pl.application:employer.review.reject',
    defaultMessage: 'Óska eftir breytingum',
    description: 'Request changes',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'pl.application:inReview.form.title',
    defaultMessage: 'Fæðingarorlof',
    description: 'Parental Leave',
  },
})

export const otherParentApprovalFormMessages = defineMessages({
  formTitle: {
    id: 'pl.application:otherParent.form.title',
    defaultMessage: 'Annað foreldra samþykki fyrir umsókn um fæðingarorlof',
    description: 'Other parent approval for parental leave application',
  },
  reviewSection: {
    id: 'pl.application:otherParent.review.section',
    defaultMessage: 'Annað samþykki foreldra',
    description: 'Other parent approval',
  },
  requestRights: {
    id: 'pl.application:otherParent.requestRights',
    defaultMessage:
      'Viltu gefa hinu foreldrinu 45 dagar af fæðingarorlofsrétti þínum?',
    description:
      'Do you allow the transfer of 45 days of your parental leave rights to the other parent?',
  },
  requestAllowance: {
    id: 'pl.application:otherParent.requestAllowance',
    defaultMessage:
      'Leyfir þú að flytja persónuafslátt þinn yfir á hitt foreldrið?',
    description:
      'Do you allow the transfer of your personal discount to the other parent?',
  },
  requestBoth: {
    id: 'pl.application:otherParent.requestBoth',
    defaultMessage:
      'Leyfir þú þér að flytja 45 daga af foreldraorlofsréttindum þínum og persónulegum afslætti þínum til hins foreldrisins?',
    description:
      'Do you allow the transfer of 45 days of your parental leave rights and of your personal discount to the other parent?',
  },
  introDescriptionRights: {
    id: 'pl.application:otherParent.introDescriptionRights',
    defaultMessage:
      'Í umsókn um fæðingarorlof hefur hitt foreldrið óskað eftir yfirfærslu á 45 dagar af réttindum þínum til fæðingarorlofs. Réttindi þín verða þá í mesta lagi 4.5 mánuðir. Samþykkir þú beiðnina?',
    description:
      'When applying for the parental leave the other parent has requested a transfer of 45 days of your rights to parental leave. That means your rights will at most be 4.5 months. Do you approve the request?',
  },
  introDescriptionAllowance: {
    id: 'pl.application:otherParent.introDescriptionAllowance',
    defaultMessage:
      'Þegar þú sækir um foreldraorlof hefur hitt foreldrið óskað eftir flutningi persónuafsláttar þíns. Það þýðir að þú munt ekki geta notað persónulegan afslátt þinn. Samþykkir þú beiðnina?',
    description: `When applying for the parental leave the other parent has requested a transfer of your personal discount. That means you won't be able to use your personal discount. Do you approve the request?`,
  },
  introDescriptionBoth: {
    id: 'pl.application:otherParent.introDescriptionBoth',
    defaultMessage:
      'Þegar þú sækir um foreldraorlof hefur hitt foreldrið óskað eftir flutningi persónuafsláttar þíns og 45 daga af réttindum þínum til foreldraorlofs. Það þýðir að réttindi þín verða í mesta lagi 4,5 mánuðir og geta ekki notað persónulegan afslátt þinn. Samþykkir þú beiðnina?',
    description: `When applying for the parental leave the other parent has requested a transfer of your personal discount and of 45 days of your rights to parental leave. That means your rights will at most be 4.5 months and won't be able to use your personal discount. Do you approve the request?`,
  },
  labelDays: {
    id: 'pl.application:otherParent.label.days',
    defaultMessage: 'Fjöldi umbeðinna daga',
    description: 'Number of requested days',
  },
  labelPersonalDiscount: {
    id: 'pl.application:otherParent.label.personalDiscount',
    defaultMessage: 'Nýting á þínum persónuafslætti',
    description: 'Usage of your personald discount',
  },
  finalTitle: {
    id: 'pl.application:otherParent.final.title',
    defaultMessage: 'Takk fyrir',
    description: 'Thank you',
  },
})

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'pl.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  otherParentId: {
    id: 'pl.application:dataSchema.otherParent.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  email: {
    id: 'pl.application:answerValidators.email',
    defaultMessage: 'Þú þarft að skilgreina gilt netfang.',
    description: 'Invalid email copy',
  },
  bank: {
    id: 'pl.application:answerValidators.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  periodsPeriodRange: {
    id: 'pl.application:answerValidators.periodsPeriodRange',
    defaultMessage:
      'Þú getur ekki sótt um í meira en {usageMaxMonths} mánuði frá fæðingardegi.',
    description: 'Copy for invalid period',
  },
  employerEmail: {
    id: 'pl.application:answerValidators.employerEmail',
    defaultMessage: 'Þú þarft að skilgreina netfang vinnuveitanda.',
    description: 'Invalid employer copy',
  },
  employerNationalRegistryId: {
    id: 'pl.application:dataSchema.invalidEmployerNationalRegistryId',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  dateOfBirth: {
    id: 'pl.application:answerValidators.dateOfBirth',
    defaultMessage:
      'Við höfum ekki getað sótt sjálfkrafa fæðingardag barnsins þíns. Vinsamlegast reyndu aftur síðar.',
    description: `Can't retrieve the DOB copy`,
  },
  noChildData: {
    id: 'pl.application:answerValidators.noChildData',
    defaultMessage: 'Ekki tókst að sækja upplýsingar um börn',
    description: 'Could not fetch child data',
  },
  periodsFirstPeriodStartDateDefinitionMissing: {
    id:
      'pl.application:answerValidators.periodsFirstPeriodStartDateDefinitionMissing',
    defaultMessage:
      'Ekki er búið að skilgreina hvernig á að hefja fyrsta tímabil.',
    description:
      'Copy for when user has not chosen how to start the first period (expected dob, dob, specific date)',
  },
  periodsFirstPeriodStartDateDefinitionInvalid: {
    id:
      'pl.application:answerValidators.periodsFirstPeriodStartDateDefinitionInvalid',
    defaultMessage: 'Skilgreining á upphafi fyrsta tímabils ógild.',
    description:
      'Copy for when user has chosen how to start the period but it is invalid',
  },
  periodsStartDate: {
    id: 'pl.application:answerValidators.periodsStartDate',
    defaultMessage: 'Upphafsdagsetningin er ekki gild.',
    description: 'Copy for invalid start date of the period',
  },
  periodsStartMissing: {
    id: 'pl.application:answerValidators.periodsStartMissing',
    defaultMessage: 'Upphafsdagsetninginu vantar.',
    description: 'Copy for when start date is missing',
  },
  periodsStartDateBeforeDob: {
    id: 'pl.application:answerValidators.periodsStartDateBeforeDob',
    defaultMessage: 'Upphafsdagur getur ekki verið fyrir áætlaðan fæðingardag.',
    description: 'Copy for invalid start date before DOB',
  },
  periodsStartDateOverlaps: {
    id: 'pl.application:answerValidators.periodsStartDateOverlaps',
    defaultMessage:
      'Nýtt tímabil getur ekki byrjað innan annars tímabils sem þegar er vistað.',
    description: 'Copy when start date overlaps other periods',
  },
  periodsStartDateRequired: {
    id: 'pl.application:answerValidators.periodsStartDateRequired',
    defaultMessage: 'Vinsamlegast veldu upphafsdagsetningu',
    description: 'Start date can not be empty',
  },
  periodsStartDateTooLate: {
    id: 'pl.application:answerValidators.periodsStartDateTooLate',
    defaultMessage:
      'Upphafsdagsetning getur ekki verið meira en 23.5 mánuðum eftir áætlaðan fæðingardag',
    description:
      'Copy for when end date is more than 23.5 months away from expected date of birth',
  },
  periodsEndDateDefinitionMissing: {
    id: 'pl.application:answerValidators.periodsEndDateDefinitionMissing',
    defaultMessage: 'Ekki er búið að skilgreina hvernig á að enda tímabil.',
    description:
      'Copy for when user has not chosen how to end a period (length or specific date)',
  },
  periodsEndDateDefinitionInvalid: {
    id: 'pl.application:answerValidators.periodsEndDateDefinitionInvalid',
    defaultMessage: 'Ógild skilgreining á endalokum tímabils.',
    description:
      'Copy for when user has chosen how to end a period but it was an invalid choice',
  },
  periodsEndDate: {
    id: 'pl.application:answerValidators.periodsEndDate',
    defaultMessage:
      'Lokadagur má ekki vera minni en {minPeriodDays} dagar frá fæðingardegi.',
    description: 'Copy when end date is invalid',
  },
  periodsEndDateBeforeStartDate: {
    id: 'pl.application:answerValidators.periodsEndDateBeforeStartDate',
    defaultMessage: 'Lokadagur getur ekki verið fyrir upphafsdag.',
    description: 'Copy when end date is before start date',
  },
  periodsEndDateMinimumPeriod: {
    id: 'pl.application:answerValidators.periodsEndDateMinimumPeriod',
    defaultMessage: 'Þú getur ekki sótt um skemur en {minPeriodDays} daga.',
    description: 'Copy when period is less than minimum required',
  },
  periodsEndDateOverlapsPeriod: {
    id: 'pl.application:answerValidators.periodsEndDateOverlapsPeriod',
    defaultMessage:
      'Nýtt tímabil getur ekki endað innan annars tímabils sem þegar hefur verið vistað.',
    description: 'Copy when end date overlaps other period',
  },
  periodsEndDateRequired: {
    id: 'pl.application:answerValidators.periodsEndDateRequired',
    defaultMessage: 'Vinsamlegast veldu lokadagsetningu',
    description: 'End date can not be empty',
  },
  periodsEndDateTooLate: {
    id: 'pl.application:answerValidators.periodsEndDateTooLate',
    defaultMessage:
      'Endadagsetning getur ekki verið meira en 24 mánuðum eftir áætlaðan fæðingardag',
    description:
      'Copy for when end date is more than 24 months away from expected date of birth',
  },
  periodsRatio: {
    id: 'pl.application:answerValidators.periodsRatio',
    defaultMessage:
      'Lágmarkið er {minPeriodDays} dagar í orlofi, þú hefur valið {diff} daga á {ratio}% sem endar sem aðeins {diffWithRatio} daga leyfi.',
    description: 'Copy when ratio is invalid',
  },
  periodsRatioMissing: {
    id: 'pl.application:answerValidators.periodsRatioMissing',
    defaultMessage: 'Ekkert hlutfall hefur verið valið',
    description: 'Copy when days to be used by period is missing',
  },
  periodsRatioInvalid: {
    id: 'pl.application:answerValidators.periodsRatioInvalid',
    defaultMessage: 'Valið hlutfall er ekki gilt.',
    description: 'Copy when days to be used by period is missing',
  },
  periodsRatioImpossible: {
    id: 'pl.application:answerValidators.periodsRatioImpossible',
    defaultMessage:
      'Ekki næg réttindi til þess að reikna út nýtingu fyrir valið tímabil. Vinsamlegast veldu annað tímabil.',
    description:
      'Copy when remaining rights are insufficient to calculate min / max percentages for chosen period',
  },
  periodsRatioCalculationImpossible: {
    id: 'pl.application:answerValidators.periodsRatioCalculationImpossible',
    defaultMessage:
      'Ekki er hægt að reikna út hámarks- og lágmarksnýtingu fyrir valið tímabil. Vinsamlegast veldu annað tímabil.',
    description:
      'Copy when it is not possible to calculate maxi- and minimum percentage',
  },
  periodsRatioPercentageMissing: {
    id: 'pl.application:answerValidators.periodsRatioPercentageMissing',
    defaultMessage: 'Ekki tókst að reikna út hámarksnýtingu fyrir tímabil',
    description: 'Copy when maximum ratio for period is missing',
  },
  periodsRatioExceedsMaximum: {
    id: 'pl.application:answerValidators.periodsRatioExceedsMaximum',
    defaultMessage:
      'Nýtingarhlutfall hærra en möguleg hámarksnýting fyrir valið tímabil.',
    description:
      'Copy for when user is trying to use a ratio greater than maximum calculated ratio for period.',
  },
  periodsRatioBelowMinimum: {
    id: 'pl.application:answerValidators.periodsRatioBelowMinimum',
    defaultMessage: 'Minnsta mögulega nýting er 1%',
    description:
      'Copy for when user is attempting to choose a ratio below minimum ratio',
  },
  periodsRatioAboveMaximum: {
    id: 'pl.application:answerValidators.periodsRatioAboveMaximum',
    defaultMessage: 'Mesta mögulega nýting er 100%',
    description:
      'Copy for when user is attempting to choose a ratio above maximum ratio',
  },
  periodsNotAList: {
    id: 'pl.application:answerValidators.periodsNotAList',
    defaultMessage: 'Svar þarf að vera listi af tímabilum',
    description: 'Copy when periods is not a list',
  },
  periodsEmpty: {
    id: 'pl.application:answerValidators.periodsEmpty',
    defaultMessage: 'Þú þarft að velja tímabil',
    description:
      'Copy when periods list is empty and user is trying to continue',
  },
  periodsCouldNotContinue: {
    id: 'pl.application:answerValidators.periodsCouldNotContinue',
    defaultMessage: 'Þú þarft að velja tímabil',
    description:
      'Copy when periods list is empty and user is trying to continue',
  },
  periodsUnexpectedError: {
    id: 'pl.application:answerValidators.periodsUnexpectedError',
    defaultMessage: 'Óvænt villa kom upp',
    description: 'Copy when an unexpected error occurs',
  },
  periodsExceedRights: {
    id: 'pl.application:answerValidators.periodsExceedRights',
    defaultMessage:
      'Valin tímabil fara yfir réttindi ({daysUsedByPeriods} > {rights} dagar)',
    description: 'Copy when total number of days used by periods exceed rights',
  },
  requiredAttachment: {
    id: 'pl.application:errors.required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'Error message when the attachment file is not provided.',
  },
  exceedingLength: {
    id: 'pl.application:errors.exceeding.length',
    defaultMessage:
      'Farið yfir réttindi, vinsamlegast veldu fyrri lokadagsetningu.',
    description: 'Rights exceeded, please, select an earlier end date.',
  },
  durationPeriods: {
    id: 'pl.application:errors.duration.periods',
    defaultMessage:
      'Villa kom upp við útreikning á tímabilum, veldu annað tímabil eða hafðu samband við okkur til að fá stuðning.',
    description:
      'An error happened while calculating your periods, choose another period or contact us for support.',
  },
})

export const statesMessages = defineMessages({
  draftTitle: {
    id: 'pl.application:draft.title',
    defaultMessage: 'Drög',
    description: 'Title of the state - draft',
  },
  draftDescription: {
    id: 'pl.application:draft.description',
    defaultMessage: 'Þú hefur verið búa til drög fyrir umsóknarinnar.',
    description: 'Description of the state - draft',
  },

  otherParentApprovalTitle: {
    id: 'pl.application:otherParentApproval.title',
    defaultMessage: 'Annað foreldra samþykki',
    description: 'Title of the state - otherParentApproval',
  },
  otherParentApprovalDescription: {
    id: 'pl.application:otherParentApproval.description',
    defaultMessage: 'Umsókn þín þarf samþykki frá annað foreldra.',
    description: 'Description of the state - otherParentApproval',
  },

  otherParentActionTitle: {
    id: 'pl.application:otherParentAction.title',
    defaultMessage: 'Annað foreldra krefst aðgerða',
    description: 'Title of the state - otherParentAction',
  },
  otherParentActionDescription: {
    id: 'pl.application:otherParentAction.description',
    defaultMessage: 'Annað foreldra krefst aðgerðarinnar.',
    description: 'Description of the state - otherParentAction',
  },

  employerWaitingToAssignTitle: {
    id: 'pl.application:employerWaitingToAssign.Title',
    defaultMessage: 'Bið eftir vinnuveitandann',
    description: 'Title of the state - employerWaitingToAssign',
  },
  employerWaitingToAssignDescription: {
    id: 'pl.application:employerWaitingToAssign.description',
    defaultMessage: 'Umsóknarinnar er ætla til vinnuteitanda',
    description: 'Description of the state - employerWaitingToAssign',
  },

  employerApprovalTitle: {
    id: 'pl.application:employerApproval.title',
    defaultMessage: 'Samþykki vinnuveitanda',
    description: 'Title of the state - employerApproval',
  },
  employerApprovalDescription: {
    id: 'pl.application:employerApproval.description',
    defaultMessage: 'Vinnuveitandi samþykkti umsóknarinna.',
    description: 'Description of the state - employerApproval',
  },

  employerActionTitle: {
    id: 'pl.application:employerAction.title',
    defaultMessage: 'Vinnuveitandi krefst aðgerða.',
    description: 'Title of the state - employerAction',
  },
  employerActionDescription: {
    id: 'pl.application:employerAction.description',
    defaultMessage: 'Vinnuveitandi krefst aðgerða vegna umsóknar þinnar.',
    description: 'Description of the state - employerAction',
  },

  vinnumalastofnunApprovalTitle: {
    id: 'pl.application:vinnumalastofnunApproval.title',
    defaultMessage: 'Vinnumálastofnun samþykkti',
    description: 'Title of the state - vinnumalastofnunApproval',
  },
  vinnumalastofnunApprovalDescription: {
    id: 'pl.application:vinnumalastofnunApproval.description',
    defaultMessage: 'Vinnumálastofnun samþykkti umsóknarinnar.',
    description: 'Description of the state - vinnumalastofnunApproval',
  },

  vinnumalastofnunActionTitle: {
    id: 'pl.application:vinnumalastofnunAction.title',
    defaultMessage: 'Vinnumálastofnun krefst aðgerða',
    description: 'Title of the state - vinnumalastofnunAction',
  },
  vinnumalastofnunActionDescription: {
    id: 'pl.application:vinnumalastofnunAction.description',
    defaultMessage: 'Vinnumálastofnun krefst aðgerðar vegna umsóknarinnar.',
    description: 'Description of the state - vinnumalastofnunAction',
  },

  approvedTitle: {
    id: 'pl.application:approved.title',
    defaultMessage: 'Samþykkt',
    description: 'Title of the state - approved',
  },
  approvedDescription: {
    id: 'pl.application:approved.description',
    defaultMessage: 'Umsóknin hefur verið samþykkt',
    description: 'Description of the state - approved',
  },

  editOrAddPeriodsTitle: {
    id: 'pl.application:editOrAddPeriods.title',
    defaultMessage: 'Breyta eða bæta við tímabil',
    description: 'Title of the state - editOrAddPeriods',
  },
  editOrAddPeriodsDescription: {
    id: 'pl.application:editOrAddPeriods.description',
    defaultMessage: 'Þú ert að breyta eða bæta tímabil við umsókn.',
    description: 'Description of the state - editOrAddPeriods',
  },

  employerWaitingToAssignForEditsTitle: {
    id: 'pl.application:employerWaitingToAssignForEdits.title',
    defaultMessage:
      'Bíður eftir vinnuveitanda að fara yfir breytingar á tímabilinu',
    description: 'Title of the state - employerWaitingToAssignForEdits',
  },
  employerWaitingToAssignForEditsDescription: {
    id: 'pl.application:employerWaitingToAssignForEdits.description',
    defaultMessage:
      'Umsókn þinni er sent til vinnuveitanda til að fara yfir breytingar þínar á tímabilinu.',
    description: 'Description of the state - employerWaitingToAssignForEdits',
  },

  employerApproveEditsTitle: {
    id: 'pl.application:employerApproveEdits.title',
    defaultMessage: 'Vinnuveitandi er að fara yfir tímabilið',
    description: 'Title of the state - employerApproveEdits',
  },
  employerApproveEditsDescription: {
    id: 'pl.application:employerApproveEdits.description',
    defaultMessage: 'Vinnuveitandi er að fara yfir tímabilbreytingar þínar.',
    description: 'Description of the state - employerApproveEdits',
  },

  employerEditsActionTitle: {
    id: 'pl.application:employerEditsAction.title',
    defaultMessage: 'Vinnuveitandi hafnaði breytingum á tímabilinu',
    description: 'Title of the state - employerEditsAction',
  },
  employerEditsActionDescription: {
    id: 'pl.application:employerEditsAction.description',
    defaultMessage: 'Vinnuveitandi þinn hafnaði tímabreytingum þínum.',
    description: 'Description of the state - employerEditsAction',
  },

  vinnumalastofnunApproveEditsTitle: {
    id: 'pl.application:vinnumalastofnunApproveEdits.title',
    defaultMessage: 'Vinnumálastofnun er að fara yfir breytingar á tímabilinu',
    description: 'Title of the state - vinnumalastofnunApproveEdits',
  },
  vinnumalastofnunApproveEditsDescription: {
    id: 'pl.application:vinnumalastofnunApproveEdits.description',
    defaultMessage: 'Vinnumálastofnun er að fara yfir tímabilbreytingar þínar.',
    description: 'Description of the state - vinnumalastofnunApproveEdits',
  },

  vinnumalastofnunEditsActionTitle: {
    id: 'pl.application:vinnumalastofnunEditsAction.title',
    defaultMessage: 'Vinnumálastofnun hafnaði breytingum á tímabilinu',
    description: 'Title of the state - vinnumalastofnunEditsAction',
  },
  vinnumalastofnunEditsActionDescription: {
    id: 'pl.application:vinnumalastofnunEditsAction.description',
    defaultMessage: 'Vinnumálastofnun hafnaði tímabreytingum þínum.',
    description: 'Description of the state - vinnumalastofnunEditsAction',
  },
})
