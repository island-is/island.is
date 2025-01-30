import { defineMessage } from 'react-intl'

export const strings = {
  heading: defineMessage({
    id: 'judicial.system.indictments:processing.heading',
    defaultMessage: 'Málsmeðferð',
    description: 'Notaður sem titill á málsmeðferð skrefi í ákærum.',
  }),
  defendantPlea: defineMessage({
    id: 'judicial.system.indictments:processing.defendant_plea_v1',
    defaultMessage:
      'Afstaða {defendantCount, plural, one {sakbornings} other {sakborninga}} til sakarefnis',
    description:
      'Notaður sem titill á "Afstaða sakbornings til sakarefnis" hlutann á Málsmeðferðarskjánum.',
  }),
  defendantName: defineMessage({
    id: 'judicial.system.indictments:processing.defendant_name',
    defaultMessage: 'Ákærði {name}',
    description:
      'Notaður sem undirtitill á "Afstaða sakbornings til sakarefnis" hlutann á Málsmeðferðarskjánum.',
  }),
  pleaGuilty: defineMessage({
    id: 'judicial.system.indictments:processing.plea_guilty',
    defaultMessage: 'Játar sök',
    description:
      'Notaður sem texti í "Játar" valmöguleikanum á Málsmeðferðarskjánum.',
  }),
  pleaNotGuilty: defineMessage({
    id: 'judicial.system.indictments:processing.plea_not_guilty',
    defaultMessage: 'Neitar sök',
    description:
      'Notaður sem texti í "Neitar" valmöguleikanum á Málsmeðferðarskjánum.',
  }),
  pleaNoPlea: defineMessage({
    id: 'judicial.system.indictments:processing.plea_no_plea',
    defaultMessage: 'Tjáir sig ekki / óljóst',
    description:
      'Notaður sem texti í "Tekur ekki afstöðu" valmöguleikanum á Málsmeðferðarskjánum.',
  }),
  yes: defineMessage({
    id: 'judicial.system.indictments:processing.yes',
    defaultMessage: 'Já',
    description:
      'Notaður sem texti í "Já" valmöguleikanum við einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  no: defineMessage({
    id: 'judicial.system.indictments:processing.no',
    defaultMessage: 'Nei',
    description:
      'Notaður sem texti í "Nei" valmöguleikanum við einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  civilDemandsTitle: {
    id: 'judicial.system.indictments:processing.civil_demands_title',
    defaultMessage: 'Einkaréttarkrafa',
    description: 'Notaður sem titill á bótakröfusvæði á Málsmeðferðarskjánum.',
  },
  isCivilClaim: defineMessage({
    id: 'judicial.system.indictments:processing.is_civil_claim',
    defaultMessage: 'Er bótakrafa?',
    description:
      'Notaður sem titill fyrir "Er bótakrafa?" valmöguleikana við einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  civilClaimant: defineMessage({
    id: 'judicial.system.indictments:processing.civil_claimant',
    defaultMessage: 'Kröfuhafi',
    description:
      'Notaður sem titill fyrir kröfuhafi í einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  civilClaimantNoNationalId: defineMessage({
    id: 'judicial.system.indictments:processing.civil_claimant_no_national_id',
    defaultMessage: 'Kröfuhafi er ekki með íslenska kennitölu',
    description:
      'Notaður sem texti fyrir kröfuhafi í "Kröfuhafi er ekki með íslenska kennitölu" í einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  civilClaimantShareFilesWithDefender: defineMessage({
    id: 'judicial.system.indictments:processing.civil_claimant_share_files_with_defender',
    defaultMessage:
      'Deila gögnum með {defenderIsLawyer, select, true {lögmanni} other {réttargæslumanni}} kröfuhafa',
    description:
      'Notaður sem texti fyrir kröfuhafi í "Kröfuhafi er ekki með íslenska kennitölu" í einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  addDefender: defineMessage({
    id: 'judicial.system.indictments:processing.add_defender',
    defaultMessage: 'Bæta við lögmanni kröfuhafa',
    description:
      'Notaður sem texti í takka til að bæta við lögmanni kröfuhafa í einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  removeDefender: defineMessage({
    id: 'judicial.system.indictments:processing.remove_defender',
    defaultMessage: 'Eyða',
    description:
      'Notaður sem texti í takka til að eyða lögmanni kröfuhafa í einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  remove: defineMessage({
    id: 'judicial.system.indictments:processing.remove',
    defaultMessage: 'Eyða',
    description:
      'Notaður sem texti í takka til að eyða kröfuhafa í einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  addCivilClaimant: defineMessage({
    id: 'judicial.system.indictments:processing.add_civil_claimant',
    defaultMessage: 'Bæta við kröfuhafa',
    description:
      'Notaður sem texti í "Bæta við kröfuhafa" takka við einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  lawyer: defineMessage({
    id: 'judicial.system.indictments:processing.lawyer',
    defaultMessage: 'Lögmaður',
    description:
      'Notaður sem texti í "Lögmaður" valmöguleikanum við einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  legalRightsProtector: defineMessage({
    id: 'judicial.system.indictments:processing.legal_rights_protector',
    defaultMessage: 'Réttargæslumaður',
    description:
      'Notaður sem texti í "Réttargæslumaður" valmöguleikanum við einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
  civilClaimantShareFilesWithDefenderTooltip: defineMessage({
    id: 'judicial.system.indictments:processing.civil_claimant_share_files_with_defender_tooltip_v2',
    defaultMessage:
      'Ef hakað er í þennan reit fær {defenderIsLawyer, select, true {lögmaður} other {réttargæslumaður}} kröfuhafa aðgang að gögnum málsins',
    description:
      'Notaður sem upplýsingartexti við "Deila gögnum" valmöguleikanum við einkaréttarkröfu á Málsmeðferðarskjánum.',
  }),
}
