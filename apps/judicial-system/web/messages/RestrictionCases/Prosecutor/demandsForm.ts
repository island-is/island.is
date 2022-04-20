import { CaseType } from '@island.is/judicial-system/types'
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
      isolation: defineMessage({
        id:
          'judicial.system.restriction_cases:police_demands.demands.isolation',
        defaultMessage: 'Krafa um einangrun',
        description:
          'Notaður sem titill fyrir kröfu um einangrun fyrir "dómkröfur" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
      tooltip: defineMessage({
        id: 'judicial.system.restriction_cases:police_demands.demands.tooltip',
        defaultMessage:
          'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
        description:
          'Notaður sem skýritexti í "krafa um einangrun" valmöguleika í "dómkröfu" textaboxi á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      }),
      pastRestriction: defineMessage({
        id:
          'judicial.system.restriction_cases:police_demands.demands.past_restriction',
        defaultMessage: `{caseType, select,
          ${CaseType.ADMISSION_TO_FACILITY} {Fyrri vistun}
          ${CaseType.TRAVEL_BAN} {Fyrra farbann}
          other {Fyrri gæsla}} var/er til `,
        description:
          'Notaður sem texti yfir fyrri gæslu/vistun/farbann ef um framlengt mál er að ræða í skrefi lagagrundvöllur og dómkörfur.',
      }),
      restrictionValidDateLabel: defineMessage({
        id:
          'judicial.system.restriction_cases:police_demands.demands.restriction_label',
        defaultMessage: `{caseType, select,
          ${CaseType.ADMISSION_TO_FACILITY} {Vistun á viðeignandi stofnun}
          ${CaseType.TRAVEL_BAN} {Farbann}
          other {Gæsluvarðhald}} til`,
        description:
          'Notaður sem texti þegar valið er lengd á gæslu/vistun/farbanni í "dómkröfu" á lagagrundvöllur og dómkröfur skrefi.',
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
      legalBasisLabel: {
        id:
          'judicial.system.restriction_cases:police_demands.legal_basis.legal_basis_label',
        defaultMessage: 'Önnur lagaákvæði sem krafan er byggð á',
        description:
          'Notaður sem titill í "önnur lagaákvæði..." textaboxi á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhaldsmálum.',
      },
      legalBasisPlaceholder: {
        id:
          'judicial.system.restriction_cases:police_demands.legal_basis.legal_basis_placeholder',
        defaultMessage:
          'Ef krafan byggir á öðrum lagaákvæðum er hægt að skrá þau hér.',
        description:
          'Notaður sem skýritexti í "önnur lagaákvæði..." textaboxi á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhaldsmálum.',
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
      headingV2: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.heading_v2',
        defaultMessage: `Takmarkanir og tilhögun {caseType, select,
        ${CaseType.ADMISSION_TO_FACILITY} {vistunar}
        ${CaseType.TRAVEL_BAN} {farbanns}
        other {gæslu}}`,
        description:
          'Notaður sem titill fyrir "takmarkanir og tilhögun gæslu/farbanns/vistunar" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds-, vistunar- og farbannsmálum.',
      },
      subHeading: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.sub_heading',
        defaultMessage: 'Ef ekkert er valið er {caseType} án takmarkana',
        description:
          'Notaður sem undirtitill fyrir "takmarkanir og tilhögun gæslu" hlutann á lagagrundvöllur og dómkröfur skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      subHeadingV2: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.sub_heading_v2',
        defaultMessage: `Ef ekkert er valið er {caseType, select,
        ${CaseType.ADMISSION_TO_FACILITY} {vistun}
        ${CaseType.TRAVEL_BAN} {farbann}
        other {gæsla}} án takmarkana`,
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
      requestedOtherRestrictionsAutofill: {
        id:
          'judicial.system.restriction_cases:police_demands.custody_restrictions.requested_other_restrictions_autofill',
        defaultMessage:
          'Sækjandi tekur fram að farbannið verði með takmörkunum, að {gender, select, MALE {kærða} OTHER {kærðu}} verði gert að tilkynna sig.',
        description:
          'Notaður sem sjálfgefið gildi þegar valið er Tilkynningarskylda.',
      },
    }),
  },
}
