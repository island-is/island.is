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
    placeholder: {
      id: 'web.parentalLeaveCalculator:additionalPensionFunding.placeholder',
      defaultMessage: 'Enginn',
      description: 'Placeholder texti fyrir Viðbótalífeyrissparnaðs dropdown',
    },
    none: {
      id: 'web.parentalLeaveCalculator:additionalPensionFunding.none',
      defaultMessage: 'Enginn',
      description:
        'Valmöguleiki ef það er enginn viðbótalífeyrissparnaður til staðar hjá viðkomandi',
    },
  }),
}
