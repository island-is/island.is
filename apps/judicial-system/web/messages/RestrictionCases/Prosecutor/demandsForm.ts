import { defineMessage, defineMessages } from 'react-intl'

export const rcDemands = {
  heading: defineMessage({
    id: 'judicial.system.restriction_cases:police_demands.heading',
    defaultMessage: 'Dómkröfur og lagagrundvöllur',
    description:
      'Notaður sem titill á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    demands: {
      heading: defineMessage({
        id: 'judicial.system.restriction_cases:police_demands.demands.heading',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill fyrir "dómkröfur" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
      label: defineMessage({
        id: 'judicial.system.restriction_cases:police_demands.demands.label',
        defaultMessage: 'Krafa lögreglu',
        description:
          'Notaður sem titill í "dómkröfur" textaboxi á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
      placeholder: defineMessage({
        id:
          'judicial.system.restriction_cases:police_demands.demands.placeholder',
        defaultMessage: 'Krafa ákæranda',
        description:
          'Notaður sem skýritexti í "dómkröfur" textaboxi á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
    },
    lawsBroken: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:police_demands.laws_broken.heading',
        defaultMessage: 'Lagaákvæði sem brot varða við',
        description:
          'Notaður sem titill fyrir "lagaákvæði sem brot varða við" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:police_demands.laws_broken.label',
        defaultMessage: 'Lagaákvæði sem ætluð brot {defendant} þykja varða við',
        description:
          'Notaður sem titill í "lagaákvæði sem brot varða við" textaboxi á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:police_demands.laws_broken.placeholder',
        defaultMessage:
          'Skrá inn þau lagaákvæði sem brotið varðar við, til dæmis 1. mgr. 244 gr. almennra hegningarlaga nr. 19/1940...',
        description:
          'Notaður sem skýritexti í "lagaákvæði sem krafan er byggð á" textaboxi á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    legalBasis: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:police_demands.legal_basis.heading',
        defaultMessage: 'Lagaákvæði sem krafan er byggð á',
        description:
          'Notaður sem titill fyrir "lagaákvæði sem krafan er byggð á" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    custodyRestrictions: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.heading',
        defaultMessage: 'Takmarkanir og tilhögun {caseType}',
        description:
          'Notaður sem titill fyrir "takmarkanir og tilhögun gæslu/farbanns" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      subHeading: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.sub_heading',
        defaultMessage: 'Ef ekkert er valið er {caseType} án takmarkana',
        description:
          'Notaður sem undirtitill fyrir "takmarkanir og tilhögun gæslu" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.label',
        defaultMessage: 'Nánari útlistun eða aðrar takmarkanir',
        description:
          'Notaður sem titill í "takmarkanir og tilhögun gæslu/farbann" textaboxi í farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.placeholder',
        defaultMessage: 'Til dæmis hvernig tilkynningarskyldu sé háttað...',
        description:
          'Notaður sem skýritexti í "takmarkanir og tilhögun gæslu/farbann" textaboxi í farbannsmálum.',
      },
    }),
  },
}
