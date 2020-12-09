import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationName: {
    id: 'pl.application:application.name',
    defaultMessage: 'Umsókn um fæðingarorlof',
    description: 'Some description',
  },
  applicantSection: {
    id: 'pl.application:applicant.section',
    defaultMessage: 'Almennar upplýsingar',
    description: 'Applicant information',
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
  paymentInformationPersonalAllowance: {
    id: 'pl.application:payment.information.personal.allowance',
    defaultMessage: 'Hlutfall nýtingar á persónuafslætti',
    description: 'Personal discount',
  },
  pensionFund: {
    id: 'pl.application:payment.information.pensionfund',
    defaultMessage: 'Lífeyrissjóður',
    description: 'Pension fund (optional)',
  },
  usePersonalAllowance: {
    id: 'pl.application:use.personal.allowance',
    defaultMessage: 'Viltu nýta persónuafsláttinn þinn?',
    description: 'Do you wish to use your personal allowance',
  },
  usePersonalAllowanceFromSpouse: {
    id: 'pl.application:use.personal.allowance.spouse',
    defaultMessage: 'Viltu nýta persónuafsláttinn maka þíns?',
    description: 'Do you wish to use the personal allowance from your spouse?',
  },
  personalAllowanceName: {
    id: 'pl.application:personal.allowance.name',
    defaultMessage: 'Persónuafsláttur',
    description: 'Personal Discount',
  },
  personalAllowanceFromSpouseName: {
    id: 'pl.application:personal.allowance.from.spouse.name',
    defaultMessage: 'Beiðni um persónuafslátt frá maka',
    description: 'Personal Discount from spouse',
  },
  personalAllowancePeriodFrom: {
    id: 'pl.application:personal.allowance.period.from',
    defaultMessage: 'Upphaf tímabils',
    description: 'Start of period',
  },
  personalAllowancePeriodTo: {
    id: 'pl.application:personal.allowance.period.to',
    defaultMessage: 'Lok tímabils',
    description: 'End of period',
  },
  personalAllowanceUsedAmount: {
    id: 'pl.application.personal.allowance.used.amount',
    defaultMessage: 'Nýttur persónuafsláttur á árinu',
    description: 'Personal allowance already used this year',
  },
  personalAllowanceDescription: {
    id: 'pl.application:personal.allowance.description',
    defaultMessage:
      'Mikilvægt er að foreldri sendi sem nýjastar upplýsingar um stöðu persónuafsláttar svo forðast megi að til ofnýtingar á persónuafslætti komi. Eru foreldrar því hvattir til að senda eyðublaðið eftir síðustu launakeyrslu hjá vinnuveitanda fyrir fæðingarorlof og að þær upplýsingar hafi komið fram á *[þjónustusíðu RSK](www.skattur.is)*. ',
    description: 'Translation needed',
  },
  personalAllowanceFromSpouseDescription: {
    id: 'pl.application:personal.allowance.from.spouse.description',
    defaultMessage:
      'Mikilvægt er að foreldri sendi sem nýjastar upplýsingar um stöðu persónuafsláttar maka\n' +
      'svo forðast megi að til ofnýtingar komi. Eru foreldrar því hvattir til að senda eyðublaðið\n' +
      'eftir síðustu launakeyrslu hjá vinnuveitanda fyrir fæðingarorlof og að þær upplýsingar hafi\n' +
      'komið fram á *[þjónustusíðu RSK](www.skattur.is)*.',
    description: 'Translation needed',
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
  employerSubSection: {
    id: 'pl.application:employer.subsection',
    defaultMessage: 'Vinnuveitandi',
    description: 'Employer',
  },
  employerTitle: {
    id: 'pl.application:employerTitle',
    defaultMessage: 'Hver er vinnuveitandi þinn?',
    description: 'Who is your employer?',
  },
  employerName: {
    id: 'pl.application:employerName',
    defaultMessage: 'Nafn vinnuveitanda',
    description: 'Employer name',
  },
  employerId: {
    id: 'pl.application:employerId',
    defaultMessage: 'Kennitala vinnuveitanda',
    description: 'Employer national registry id',
  },
  rightsSection: {
    id: 'pl.application:rights.section',
    defaultMessage: 'Réttindi til fæðingarorlofs',
    description: 'Parental leave rights',
  },
  yourRights: {
    id: 'pl.application:rights.section',
    defaultMessage: 'Réttindin þín',
    description: 'Your rights',
  },
  yourRightsInMonths: {
    id: 'pl.application:rights.months',
    defaultMessage: '{months} mánuðir sjálfstæður réttur',
    description: '{months} months individual rights',
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
    description:
      'Both parents have 6 months, but can transfer to 1 month to the other parent.',
  },
  requestRightsName: {
    id: 'pl.application:request.rights.name',
    defaultMessage:
      'Óskarðu eftir að fá allt að einn mánuð af réttindum hins foreldrisins yfirfært yfir á þig?',
    description: 'Do you want to request extra time from the other parent?',
  },
  requestRightsMonths: {
    id: 'pl.application:request.rights.months',
    defaultMessage: '1 mánuður óskað eftir af rétti hins foreldrisins',
    description: "1 month requested from the other parent's rights",
  },
  monthsTotal: {
    id: 'pl.application:months.total',
    defaultMessage: 'Samtals: {months} mánuðir *',
    description: 'Total: {months} months *',
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
    defaultMessage:
      'Hitt foreldrið má yfirfæra allt að einn mánuð af réttindum þess yfir á þig. Kjósir þú að óska eftir þessu, þá þarf hitt foreldrið að samþykkja beiðni þína.',
    description: 'The other parent can transfer to 1 month of their rights',
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
  giveRightsDescription: {
    id: 'pl.application:give.rights.description',
    defaultMessage:
      'Þú getur yfirfært allt að einn mánuð af þínum réttindum yfir á hitt foreldrið',
    description: 'You can give the other parent one month of your rights',
  },
  giveRightsMonths: {
    id: 'pl.application:give.rights.months',
    defaultMessage: '1 mánuður yfirfærður til hins foreldrisins',
    description: '1 month given to the other parent',
  },
  giveRightsYes: {
    id: 'pl.application:give.rights.yes',
    defaultMessage:
      'Já, ég vil yfirfæra allt að einn mánuð af mínum réttindum til hins foreldrisins',
    description: 'Yes, I wish to give one of my months to the other parent',
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
    description: 'Some description',
  },
  expectedDateOfBirthTitle: {
    id: 'pl.application:expectedDateOfBirth.title',
    defaultMessage: 'Áætlaður fæðingardagur',
    description: 'Some description',
  },
  expectedDateOfBirthSubtitle: {
    id: 'pl.application:expectedDateOfBirth.subtitle',
    defaultMessage: 'Staðfesting á að það sé yfir höfuð barn á leiðinni',
    description: 'Some description',
  },
  salaryTitle: {
    id: 'pl.application:salary.title',
    defaultMessage: 'Laungreiðendaskrá',
    description: 'Some description',
  },
  salarySubtitle: {
    id: 'pl.application:salary.subtitle',
    defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'Some description',
  },
  salaryLabelYear: {
    id: 'pl.application:salary.label.year',
    defaultMessage: 'Year',
    description: '',
  },
  salaryLabelMonth: {
    id: 'pl.application:salary.label.month',
    defaultMessage: 'Month',
    description: '',
  },
  salaryLabelPensionFund: {
    id: 'pl.application:salary.label.pensionfund',
    defaultMessage: 'Pension fund',
    description: '',
  },
  salaryLabelTax: {
    id: 'pl.application:salary.label.tax',
    defaultMessage: 'Tax',
    description: '',
  },
  salaryLabelPaidAmount: {
    id: 'pl.application:salary.label.paidamount',
    defaultMessage: 'Paid amount',
    description: '',
  },
  salaryLabelShowMore: {
    id: 'pl.application:salary.label.paidamount',
    defaultMessage: 'See all months',
    description: '',
  },
  salaryLabelShowLess: {
    id: 'pl.application:salary.label.paidamount',
    defaultMessage: 'See less',
    description: '',
  },
  sharedTimeSection: {
    id: 'pl.application:sharedTime.section',
    defaultMessage: 'Shared time',
    description: 'Some description',
  },
  usageSubsection: {
    id: 'pl.application:usage.subsection',
    defaultMessage: 'Ráðstöfun',
    description: 'Some description',
  },
  usage: {
    id: 'pl.application:usage',
    defaultMessage: 'Hvað ætlar þú að nýta þér marga mánuði í fæðingarorlof?',
    description: 'Some description',
  },
  durationSubsection: {
    id: 'pl.application:duration.subsection',
    defaultMessage: 'Duration',
    description: 'Some description',
  },
  duration: {
    id: 'pl.application:duration',
    defaultMessage: 'Please confirm your leave duration',
    description: 'Some description',
  },
  durationDescription: {
    id: 'pl.application:duration.description',
    defaultMessage:
      'Some people choose to take the full leave all at once, but also extend it by months or to a certain date by adjsting their income percentage.',
    description: 'Some description',
  },
  calculationsSubsection: {
    id: 'pl.application:calculations.subsection',
    defaultMessage: 'Útreikningur',
    description: 'Some description',
  },
  spread: {
    id: 'pl.application:spread',
    defaultMessage: ' ',
    description: 'Some description',
  },
  periods: {
    id: 'pl.application:periods',
    defaultMessage: 'Viltu breyta eða skipta upp tímabilinu?',
    description: 'Some description',
  },
  startDateTitle: {
    id: 'pl.application:periods.startdate',
    defaultMessage: 'When do you want to start?',
    description: 'Some description',
  },
  startDateDescription: {
    id: 'pl.application:periods.startdate.description',
    defaultMessage:
      'You can choose to start from one month before the date of birth, on the date of birth, or on a specific date. Please note, that your rights end 18 months after the date of birth.',
    description: 'Some description',
  },
  startDateOption1: {
    id: 'pl.application:periods.startdate.description',
    defaultMessage: 'On the date of birth',
    description: 'Some description',
  },
  startDateOption2: {
    id: 'pl.application:periods.startdate.description',
    defaultMessage: 'On a specific date',
    description: 'Some description',
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
  summaryName: {
    id: 'pl.application:summary.name',
    defaultMessage: 'Here we need a summary screen',
    description: 'Some description',
  },
  summaryIntro: {
    id: 'pl.application:summary.intro',
    defaultMessage: 'very nice',
    description: 'Some description',
  },
  loadingError: {
    id: 'pl.application:loading.error',
    defaultMessage: 'Oops! Something went wrong',
    description: 'Some description',
  },
  requiredAnswerError: {
    id: 'pl.application:required.answer.error',
    defaultMessage: 'Þú verður að svara þessari spurningu til að halda áfram.',
    description: 'You need to answer this question to continue.',
  },
})
