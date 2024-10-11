import { defineMessages } from 'react-intl'

export const translations = {
  status: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:status.heading',
      defaultMessage: 'Veldu það sem á við þig',
      description: 'Heading fyrir ofan "Val um stöðu" dropdown',
    },
    label: {
      id: 'web.parentalLeaveCalculator:status.label',
      defaultMessage: 'Val um stöðu',
      description: 'Label fyrir "Val um stöðu" dropdown',
    },
    parentalLeaveOption: {
      id: 'web.parentalLeaveCalculator:status.parentalLeaveOption',
      defaultMessage: 'Fæðingarorlof',
      description: 'Fæðingarorlofs - valmöguleiki í "Val um stöðu" dropdown',
    },
    studentOption: {
      id: 'web.parentalLeaveCalculator:status.studentOption',
      defaultMessage: 'Fæðingarstyrkur námsmanna',
      description:
        'Fæðingarstyrkur námsmanna -  valmöguleiki í "Val um stöðu" dropdown',
    },
    outsideWorkforceOption: {
      id: 'web.parentalLeaveCalculator:status.outsideWorkforceOption',
      defaultMessage: 'Fæðingarstyrkur utan vinnumarkaðs',
      description:
        'Fæðingarstyrkur utan vinnumarkaða -  valmöguleiki í "Val um stöðu" dropdown',
    },
  }),
  legalDomicile: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:legalDomicile.heading',
      defaultMessage: 'Átt þú lögheimili á Íslandi',
      description:
        'Heading fyrir ofan "Átt þú lögheimili á Íslandi" radio takka',
    },
    tooltip: {
      id: 'web.parentalLeaveCalculator:legalDomicile.tooltip',
      defaultMessage:
        'Nánari upplýsingar um það hvað telst vera samfellt starf hjá starfsmönnum eða sjálfstætt starfandi einstaklingum og upplýsingar um önnur tilvik sem teljast jafnframt til þátttöku á innlendum vinnumarkaði má finna undir flipanum réttindi foreldra á innlendum vinnumarkaði á heimasíðu Fæðingarorlofssjóðs.',
      description: 'Tooltip fyrir ofan "Lögheimli á íslandi" dropdown',
    },
    yes: {
      id: 'web.parentalLeaveCalculator:legalDomicile.yes',
      defaultMessage: 'Já',
      description: 'Já',
    },
    no: {
      id: 'web.parentalLeaveCalculator:legalDomicile.no',
      defaultMessage: 'Nei',
      description: 'Nei',
    },
    dontHaveRight: {
      id: 'web.parentalLeaveCalculator:legalDomicile.dontHaveRight',
      defaultMessage: 'Réttur ekki til staðar miðað við uppgefnar forsendur.',
      description: 'Réttur ekki til staðar miðað við uppgefnar forsendur.',
    },
  }),
  childBirthYear: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:childBirthYear.heading',
      defaultMessage: 'Fæðingarár barns',
      description: 'Heading fyrir ofan "Fæðingarár barns" dropdown',
    },
    description: {
      id: 'web.parentalLeaveCalculator:childBirthYear.description',
      defaultMessage:
        'Miðað er við ár sem barn fæðist, kemur inn á heimili ef það er frumætleitt eða tekið í varanlegt fóstur.',
      description: 'Lýsing fyrir ofan "Fæðingarár barns" dropdown',
    },
    label: {
      id: 'web.parentalLeaveCalculator:childBirthYear.label',
      defaultMessage: 'Veldu ár',
      description: 'Label fyrir "Fæðingarár barns" dropdown',
    },
  }),
  workPercentage: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:workPercentage.heading',
      defaultMessage: 'Starfshlutfall',
      description: 'Heading fyrir ofan "Starfshlutfall" reit',
    },
    description: {
      id: 'web.parentalLeaveCalculator:workPercentage.description',
      defaultMessage:
        'Hlutfall vinnu á íslenskum vinnumarkaði síðustu 6 mánuði fyrir áætlaðan fæðingardag. Ef barn er frumættleitt eða tekið í varanlegt fóstur er miðað við daginn sem barnið kemur inn á heimilið.',
      description: 'Lýsing fyrir ofan "Fæðingarár barns" dropdown',
    },
    tooltip: {
      id: 'web.parentalLeaveCalculator:workPercentage.tooltip',
      defaultMessage:
        'Nánari upplýsingar um það hvernig starfshlutfall er fundið út má finna undir flipanum réttindi foreldra á innlendum vinnumarkaði á heimasíðu Fæðingarorlofssjóðs.',
      description: 'Texti fyrir tooltip við "Starfshlutfall" reit',
    },
    option1: {
      id: 'web.parentalLeaveCalculator:workPercentage.option1',
      defaultMessage: '25% til 49%',
      description: 'Valmöguleiki 1 fyrir starfshlutfall',
    },
    option2: {
      id: 'web.parentalLeaveCalculator:workPercentage.option2',
      defaultMessage: '50% til 100%',
      description: 'Valmöguleiki 2 fyrir starfshlutfall',
    },
  }),
  income: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:income.heading',
      defaultMessage: 'Meðaltekjur á mánuði fyrir skatt',
      description: 'Heading fyrir ofan "Meðaltekjur" reit',
    },
    description: {
      id: 'web.parentalLeaveCalculator:income.description',
      defaultMessage:
        'Fyrir launafólk er miðað við 12 mánaða tímabil sem lýkur 6 mánuðum fyrir fæðingardag barns. Fyrir sjálfstætt starfandi er miðað við tekjuárið á undan fæðingarári barnsins.',
      description: 'Lýsing fyrir ofan "Meðaltekjur" reit',
    },
    inputSuffix: {
      id: 'web.parentalLeaveCalculator:income.inputSuffix',
      defaultMessage: ' krónur',
      description: 'Viðskeyti eftir tekjutöluna sem notandi hefur slegið inn',
    },
    inputPlaceholder: {
      id: 'web.parentalLeaveCalculator:income.inputPlaceholder',
      defaultMessage: 'krónur',
      description: 'Placeholder texti fyrir meðaltekju innsláttarreit',
    },
    label: {
      id: 'web.parentalLeaveCalculator:income.label',
      defaultMessage: 'Meðaltekjur',
      description: 'Label á meðaltekju innsláttarreit',
    },
    tooltip: {
      id: 'web.parentalLeaveCalculator:income.tooltip',
      defaultMessage:
        'Miðað er við allar þær tekjur sem greitt er tryggingagjald af og greiðslur úr Fæðingarorlofssjóði, Atvinnuleysistryggingasjóði, Ábyrgðasjóði launa, sjúkra- og slysadagpeninga, greiðslur úr sjúkrasjóðum stéttarfélaga, bætur frá tryggingafélagi vegna tímabundins atvinnutjóns og tekjutengdar greiðslur samkvæmt III. kafla laga um greiðslur til foreldra langveikra eða alvarlegra fatlaðra barna.',
      description: 'Tooltip á meðaltekju innsláttarreit',
    },
  }),
  additionalPensionFunding: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:additionalPensionFunding.heading',
      defaultMessage: 'Viðbótalífeyrissparnaður',
      description: 'Heading fyrir ofan "Viðbótalífeyrissparnaður" dropdown',
    },
    label: {
      id: 'web.parentalLeaveCalculator:additionalPensionFunding.label',
      defaultMessage: 'Viðbótalífeyrissparnaður',
      description: 'Label fyrir "Viðbótalífeyrissparnaður" dropdown',
    },
    description: {
      id: 'web.parentalLeaveCalculator:additionalPensionFunding.description',
      defaultMessage:
        'Það er valkvætt að greiða viðbótarlífeyrissparnað. Fæðingarorlofssjóður greiðir ekki mótframlag.',
      description: 'Lýsing fyrir ofan "Viðbótalífeyrissparnaður" dropdown',
    },
    optionSuffix: {
      id: 'web.parentalLeaveCalculator:additionalPensionFunding.optionSuffix',
      defaultMessage: ' prósent',
      description:
        'Viðskeyti eftir valmöguleika í Viðbótalífeyrissparnaðs dropdown, dæmi "1< prósent>"',
    },
    none: {
      id: 'web.parentalLeaveCalculator:additionalPensionFunding.none',
      defaultMessage: 'Enginn',
      description:
        'Valmöguleiki ef það er enginn viðbótalífeyrissparnaður til staðar hjá viðkomandi',
    },
  }),
  union: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:union.heading',
      defaultMessage: 'Stéttarfélagsgjöld',
      description: 'Heading fyrir ofan "Stéttarfélagsgjöld" dropdown',
    },
    description: {
      id: 'web.parentalLeaveCalculator:union.description',
      defaultMessage:
        'Það er valkvætt að greiða í stéttarfélag. Athugið að réttindi geta tapast hjá stéttarfélagi ef greiðslum þar er ekki viðhaldið meðan á fæðingarorlofi stendur.',
      description: 'Lýsing fyrir ofan "Stéttarfélagsgjöld" dropdown',
    },
    label: {
      id: 'web.parentalLeaveCalculator:union.label',
      defaultMessage: 'Stéttarfélagsgjöld',
      description: 'Label á "Stéttarfélagsgjöld" dropdown',
    },
    none: {
      id: 'web.parentalLeaveCalculator:union.none',
      defaultMessage: 'Engin',
      description:
        'Valmöguleiki ef það er engin stéttarfélagsgjöld til staðar hjá viðkomandi',
    },
  }),
  error: defineMessages({
    title: {
      id: 'web.parentalLeaveCalculator:error.title',
      defaultMessage: 'Villa',
      description: 'Titill á villuskilaboðum ef ekki tekst að reikna',
    },
    message: {
      id: 'web.parentalLeaveCalculator:error.message',
      defaultMessage: 'Ekki tókst að reikna',
      description:
        'Villutexti ef ekki tekst að reikna (ef það t.d. vantar fasta í vefumsjónarkerfi)',
    },
  }),
  personalDiscount: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:personalDiscount.heading',
      defaultMessage: 'Hlutfall persónuafsláttar',
      description: 'Heading fyrir ofan "Hlutfall persónuafsláttar" reit',
    },
    description: {
      id: 'web.parentalLeaveCalculator:personalDiscount.description',
      defaultMessage:
        'Hægt er að velja hversu hátt hlutfall persónuafsláttar á að nýta hjá Fæðingarorlofssjóði.',
      description: 'Lýsing fyrir ofan "Hlutfall persónuafsláttar" reit',
    },
    label: {
      id: 'web.parentalLeaveCalculator:personalDiscount.label',
      defaultMessage: 'Hlutfall persónuafsláttar',
      description: 'Label á "Hlutfall persónuafsláttar" reit',
    },
    placeholder: {
      id: 'web.parentalLeaveCalculator:personalDiscount.placeholder',
      defaultMessage: '%',
      description: 'Placeholder á "Hlutfall persónuafsláttar" reit',
    },
    suffix: {
      id: 'web.parentalLeaveCalculator:personalDiscount.suffix',
      defaultMessage: '%',
      description:
        'Viðskeyti á eftir því sem notandi slær inn í "Hlutfall persónuafsláttar" reit',
    },
  }),
  parentalLeavePeriod: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:parentalLeavePeriod.heading',
      defaultMessage: 'Tímabil fæðingarorlofs (Lágmark 2 vikur)',
      description: 'Heading fyrir ofan "Tímabil fæðingarorlofs" dropdown',
    },
    description: {
      id: 'web.parentalLeaveCalculator:parentalLeavePeriod.description',
      defaultMessage:
        'Útreikningar miðast við mánuð í fæðingarorlofi eða hluta úr mánuði.',
      description: 'Lýsing fyrir ofan "Hlutfall persónuafsláttar" dropdown',
    },
    label: {
      id: 'web.parentalLeaveCalculator:parentalLeavePeriod.label',
      defaultMessage: 'Tímabil fæðingarorlofs',
      description: 'Label á "Tímabil fæðingarorlofs" dropdown',
    },
    placeholder: {
      id: 'web.parentalLeaveCalculator:parentalLeavePeriod.placeholder',
      defaultMessage: 'Veldu',
      description: 'Placeholder á "Hlutfall persónuafsláttar" dropdown',
    },
    twoWeeksOption: {
      id: 'web.parentalLeaveCalculator:parentalLeavePeriod.twoWeeksOption',
      defaultMessage: '2 vikur',
      description: 'Valmöguleiki um 2 vikur í fæðingarorlofstímabili',
    },
    threeWeeksOption: {
      id: 'web.parentalLeaveCalculator:parentalLeavePeriod.threeWeeksOption',
      defaultMessage: '3 vikur',
      description: 'Valmöguleiki um 3 vikur í fæðingarorlofstímabili',
    },
    monthOption: {
      id: 'web.parentalLeaveCalculator:parentalLeavePeriod.monthOption',
      defaultMessage: '1 mánuður',
      description: 'Valmöguleiki um 1 mánuð í fæðingarorlofstímabili',
    },
  }),
  parentalLeaveRatio: defineMessages({
    heading: {
      id: 'web.parentalLeaveCalculator:parentalLeaveRatio.heading',
      defaultMessage: 'Hlutfall fæðingarorlofs',
      description: 'Heading fyrir ofan "Hlutfall fæðingarorlofs" reit',
    },
    description: {
      id: 'web.parentalLeaveCalculator:parentalLeaveRatio.description',
      defaultMessage:
        'Hægt er að velja lægra hlutfall fæðingarorlofs ef foreldri vill t.d. dreifa greiðslum yfir lengra tímabil eða vinna samhliða fæðingarorlofi.',
      description: 'Lýsing fyrir ofan "Hlutfall fæðingarorlofs" reit',
    },
    tooltip: {
      id: 'web.parentalLeaveCalculator:parentalLeaveRatio.tooltip',
      defaultMessage:
        'Dæmi um lægra hlutfall fæðingarorlofs: 3 mánuðir dreift á 4,5 mánuði = 66% hlutfall eða 6 mánuðir dreift á 9 mánuði = 66% hlutfall. 3 mánuðir dreift á 6 mánuði = 50% hlutfall eða 6 mánuðir dreift á 12 mánuði = 50% hlutfall. 3 mánuðir dreift á 9 mánuði = 33% hlutfall eða 6 mánuðir dreift á 18 mánuði = 33% hlutfall. 3 mánuðir dreift á 12 mánuði = 25% hlutfall eða 6 mánuðir dreift á 24 mánuði = 25% hlutfall.',
      description: 'Tooltip fyrir ofan "Hlutfall fæðingarorlofs" reit',
    },
    label: {
      id: 'web.parentalLeaveCalculator:parentalLeaveRatio.label',
      defaultMessage: 'Hlutfall fæðingarorlofs',
      description: 'Label á "Hlutfall fæðingarorlofs" reit',
    },
    placeholder: {
      id: 'web.parentalLeaveCalculator:parentalLeaveRatio.placeholder',
      defaultMessage: '%',
      description: 'Placeholder á "Hlutfall fæðingarorlofs" reit',
    },
    suffix: {
      id: 'web.parentalLeaveCalculator:parentalLeaveRatio.suffix',
      defaultMessage: '%',
      description:
        'Viðskeyti á eftir því sem notandi slær inn í "Hlutfall fæðingarorlofs" reit',
    },
  }),
  calculate: defineMessages({
    buttonText: {
      id: 'web.parentalLeaveCalculator:calculate',
      defaultMessage: 'Reikna',
      description: 'Texti á "Reikna" hnapp',
    },
  }),
  results: defineMessages({
    mainParentalLeaveHeadingMonth: {
      id: 'web.parentalLeaveCalculator:results.mainParentalLeaveHeadingMonth',
      defaultMessage: 'Fæðingarorlof á mánuði',
      description:
        'Niðurstöðuskjár - Aðal heading fyrir fæðingarorlof á mánuði',
    },
    mainParentalLeaveDescriptionMonth: {
      id: 'web.parentalLeaveCalculator:results.mainParentalLeaveDescriptionMonth',
      defaultMessage: '{ratio}% fæðingarorlof á mánuði (eftir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á prósentutölu fæðingarorlofs á mánuði sem notandi valdi',
    },
    mainParentalLeaveHeadingThreeWeeks: {
      id: 'web.parentalLeaveCalculator:results.mainParentalLeaveHeadingThreeWeeks',
      defaultMessage: 'Fæðingarorlof á 3 vikum',
      description:
        'Niðurstöðuskjár - Aðal heading fyrir fæðingarorlof á 3 vikum',
    },
    mainParentalLeaveDescriptionThreeWeeks: {
      id: 'web.parentalLeaveCalculator:results.mainParentalLeaveDescriptionThreeWeeks',
      defaultMessage: '{ratio}% fæðingarorlof á 3 vikum (eftir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á prósentutölu fæðingarorlofs á 3 vikum sem notandi valdi',
    },
    mainParentalLeaveHeadingTwoWeeks: {
      id: 'web.parentalLeaveCalculator:results.mainParentalLeaveHeadingTwoWeeks',
      defaultMessage: 'Fæðingarorlof á 2 vikum',
      description:
        'Niðurstöðuskjár - Aðal heading fyrir fæðingarorlof á 2 vikum',
    },
    mainParentalLeaveDescriptionTwoWeeks: {
      id: 'web.parentalLeaveCalculator:results.mainParentalLeaveDescriptionTwoWeeks',
      defaultMessage: '{ratio}% fæðingarorlof á 2 vikum (eftir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á prósentutölu fæðingarorlofs á 2 vikum sem notandi valdi',
    },
    mainStudentHeading: {
      id: 'web.parentalLeaveCalculator:results.mainStudentHeading',
      defaultMessage: 'Fæðingarstyrkur námsmanna á mánuði',
      description:
        'Niðurstöðuskjár - Aðal heading fyrir fæðingarstyrk námsmanna',
    },
    mainStudentDescription: {
      id: 'web.parentalLeaveCalculator:results.mainStudentDescription',
      defaultMessage:
        '{ratio}% fæðingarstyrkur námsmanna á mánuði (eftir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á prósentutölu fæðingarstyrks á mánuði sem notandi valdi',
    },
    mainOutsideWorkforceHeading: {
      id: 'web.parentalLeaveCalculator:results.mainOutsideWorkforceHeading',
      defaultMessage: 'Fæðingarstyrkur á mánuði',
      description:
        'Niðurstöðuskjár - Aðal heading fyrir fæðingarstyrk utan vinnumarkaðs',
    },
    mainOutsideWorkforceDescription: {
      id: 'web.parentalLeaveCalculator:results.mainOutsideWorkforceDescription',
      defaultMessage: '{ratio}% fæðingarstyrkur á mánuði (eftir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á prósentutölu fæðingarstyrks á mánuði sem notandi valdi',
    },
    currencySuffix: {
      id: 'web.parentalLeaveCalculator:results.currencySuffix',
      defaultMessage: ' krónur',
      description: 'Niðurstöðuskjár - Viðskeyti eftir krónutölu',
    },
    mainDisclaimer: {
      id: 'web.parentalLeaveCalculator:results.mainDisclaimer',
      defaultMessage:
        'Vinsamlega hafðu í huga að reiknivélin reiknar greiðslur miðað við þær forsendur sem þú gefur upp. Líkanið er einungis til leiðbeiningar en veitir ekki bindandi upplýsingar um endanlega afgreiðslu máls eða greiðslufjárhæðir.',
      description: 'Niðurstöðuskjár - Texti fyrir neðan aðalkrónutölu',
    },
    incomePrerequisitesHeading: {
      id: 'web.parentalLeaveCalculator:results.incomePrerequisitesHeading',
      defaultMessage: 'Launaforsendur',
      description: 'Niðurstöðuskjár - Heading fyrir "Launaforsendur" lið',
    },
    incomePrerequisitesSubHeading: {
      id: 'web.parentalLeaveCalculator:results.incomePrerequisitesSubHeading',
      defaultMessage:
        'Uppgefnar meðaltekjur innanlands á mánuði miðað við árið 2024',
      description: 'Niðurstöðuskjár - Subheading fyrir "Launaforsendur" lið',
    },
    incomePrerequisitesDescription: {
      id: 'web.parentalLeaveCalculator:results.incomePrerequisitesDescription#markdown',
      defaultMessage: `Fæðingarorlof nemur aldrei meira en {parentalLeaveRatio}% af uppgefnum launum\nFæðingarorlof er aldrei hærra en {maxIncome} krónur á mánuði\nFæðingarorlof er aldrei lægra en {parentalLeaveLow} krónur fyrir 25-49% starfshlutfall og {parentalLeaveHigh} krónur fyrir 50-100% starfshlutfall`,
      description: 'Niðurstöðuskjár - Lýsing fyrir "Launaforsendur" lið',
    },
    mainResultBeforeDeductionHeading: {
      id: 'web.parentalLeaveCalculator:results.mainResultBeforeDeductionHeading',
      defaultMessage: 'Niðurstaða',
      description:
        'Niðurstöðuskjár - Heading fyrir niðurstöðulið (fyrir frádrátt)',
    },
    mainResultBeforeDeductionDescriptionMonth: {
      id: 'web.parentalLeaveCalculator:results.mainResultBeforeDeductionDescriptionMonth',
      defaultMessage: '{ratio}% fæðingarorlof á mánuði (fyrir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á hve mikið fæðingarorlof á mánuði notandi fær (fyrir frádrátt)',
    },
    mainResultBeforeDeductionDescriptionThreeWeeks: {
      id: 'web.parentalLeaveCalculator:results.mainResultBeforeDeductionDescriptionThreeWeeks',
      defaultMessage: '{ratio}% fæðingarorlof á 3 vikum (fyrir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á hve mikið fæðingarorlof notandi fær á 3 vikum (fyrir frádrátt)',
    },
    mainResultBeforeDeductionDescriptionTwoWeeks: {
      id: 'web.parentalLeaveCalculator:results.mainResultBeforeDeductionDescriptionTwoWeeks',
      defaultMessage: '{ratio}% fæðingarorlof á 2 vikum (fyrir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á hve mikið fæðingarorlof á 2 vikum notandi fær (fyrir frádrátt)',
    },
    mainResultBeforeDeductionDescriptionStudent: {
      id: 'web.parentalLeaveCalculator:results.mainResultBeforeDeductionDescriptionStudent',
      defaultMessage:
        '{ratio}% fæðingarstyrkur námsmanna á mánuði (fyrir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á hve mikið fæðingarstyrkur námsmanna er (fyrir frádrátt)',
    },
    mainResultBeforeDeductionDescriptionOutsideWorkforce: {
      id: 'web.parentalLeaveCalculator:results.mainResultBeforeDeductionDescriptionOutsideWorkforce',
      defaultMessage: '{ratio}% fæðingarstyrkur á mánuði (fyrir frádrátt)',
      description:
        'Niðurstöðuskjár - Lýsing á hve mikið fæðingarstyrkur utan vinnumarkaðar er (fyrir frádrátt)',
    },
    deductionHeading: {
      id: 'web.parentalLeaveCalculator:results.deductionHeading',
      defaultMessage: 'Frádreginn kostnaður',
      description: 'Niðurstöðuskjár - Heading fyrir "Frádreginn kostnaður" lið',
    },
    amount: {
      id: 'web.parentalLeaveCalculator:results.amount',
      defaultMessage: 'Upphæð',
      description: 'Niðurstöðuskjár - Upphæð',
    },
    perMonth: {
      id: 'web.parentalLeaveCalculator:results.perMonth',
      defaultMessage: 'Á mánuði',
      description: 'Niðurstöðuskjár - Á mánuði',
    },
    pensionFunding: {
      id: 'web.parentalLeaveCalculator:results.pensionFunding',
      defaultMessage: 'Lífeyrissjóðir',
      description: 'Niðurstöðuskjár - Lífeyrissjóðir',
    },
    additionalPensionFunding: {
      id: 'web.parentalLeaveCalculator:results.additionalPensionFunding',
      defaultMessage: 'Viðbótalífeyrissparnaður',
      description: 'Niðurstöðuskjár - Viðbótalífeyrissparnaður',
    },
    tax: {
      id: 'web.parentalLeaveCalculator:results.tax',
      defaultMessage: 'Frádreginn skattur',
      description: 'Niðurstöðuskjár - Frádreginn skattur',
    },
    totalTax: {
      id: 'web.parentalLeaveCalculator:results.totalTax',
      defaultMessage: 'Heildarskattur',
      description: 'Niðurstöðuskjár - Heildarskattur',
    },
    usedPersonalDiscount: {
      id: 'web.parentalLeaveCalculator:results.usedPersonalDiscount',
      defaultMessage: 'Nýttur persónuafsláttur',
      description: 'Niðurstöðuskjár - Nýttur persónuafsláttur',
    },
    unionFee: {
      id: 'web.parentalLeaveCalculator:results.unionFee',
      defaultMessage: 'Stéttarfélagsgjöld',
      description: 'Niðurstöðuskjár - Stéttarfélagsgjöld',
    },
    changeAssumptions: {
      id: 'web.parentalLeaveCalculator:results.changeAssumptions',
      defaultMessage: 'Breyta forsendum',
      description: 'Niðurstöðuskjár - Breyta forsendum',
    },
  }),
}
