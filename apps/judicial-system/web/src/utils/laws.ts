import type { IntlShape } from 'react-intl'

import { laws as lawTitles } from '@island.is/judicial-system/formatters'
import { laws } from '@island.is/judicial-system-web/messages'
import type { CheckboxInfo } from '@island.is/judicial-system-web/src/components'
import { CaseLegalProvisions } from '@island.is/judicial-system-web/src/graphql/schema'

// New user-facing text is hardcoded rather than added to the Contentful-backed
// messages (see apps/judicial-system/AGENTS.md).
const legalProvisionTooltips: Partial<Record<CaseLegalProvisions, string>> = {
  [CaseLegalProvisions._115_1]:
    'Heimilt er að handtaka erlendan ríkisborgara á Íslandi og færa í gæsluvarðhald skv. lið a-h í 1. mgr. 115. gr. útlendingalaga.',
  [CaseLegalProvisions._115_1_A]:
    'Ekki liggur fyrir hver útlendingurinn er, útlendingurinn neitar að gefa upp hver hann er eða ef rökstuddur grunur er um að hann gefi rangar upplýsingar um hver hann er.',
  [CaseLegalProvisions._115_1_B]:
    'Útlendingur sýnir af sér hegðun sem gefur til kynna að hann ógni allsherjarreglu, öryggi ríkisins eða almannahagsmunum.',
  [CaseLegalProvisions._115_1_C]:
    'Útlendingurinn hefur ekki sinnt kröfu um tilkynningarskyldu eða skyldu til dvalar á ákveðnum stað skv. 114. gr. og mál hans er enn til meðferðar hjá stjórnvöldum.',
  [CaseLegalProvisions._115_1_D]:
    'Endanleg ákvörðun hefur verið tekin um brottvísun, réttaráhrifum hefur ekki verið frestað og tilgangur handtöku er að flytja útlendinginn úr landi; skilyrði er að brottvísunin sé vegna brots og út frá aðstæðum útlendingsins megi telja líkur til að hann fremji frekari brot.',
  [CaseLegalProvisions._115_1_E]:
    'Útlendingurinn er á íslenskum flugvelli og ætlunin er að senda hann úr landi.',
  [CaseLegalProvisions._115_1_F]:
    'Útlendingurinn telst ógn við þjóðaröryggi að mati lögreglu, sbr. 2. mgr. 26. gr., og ætlunin er að senda hann úr landi.',
  [CaseLegalProvisions._115_1_G]:
    'Nauðsynlegt þykir til að tryggja framkvæmd ákvörðunar um að útlendingur skuli yfirgefa landið og þegar mál sem getur leitt til slíkrar ákvörðunar er til meðferðar.',
  [CaseLegalProvisions._115_1_H]:
    'Útlendingur gerir ekki það sem nauðsynlegt er til að afla sér ferðaskilríkja, sbr. 5. mgr. 104. gr., og tilgangurinn er að færa útlendinginn fyrir fulltrúa þess lands sem við á í því skyni að fá útgefin ferðaskilríki.',
}

export const getLegalProvisionTitle = (
  formatMessage: IntlShape['formatMessage'],
  legalProvision: CaseLegalProvisions,
): string =>
  legalProvision in laws
    ? formatMessage(laws[legalProvision as keyof typeof laws].title)
    : lawTitles[legalProvision]

const makeCheckboxInfo = (legalProvision: CaseLegalProvisions): CheckboxInfo =>
  legalProvision in laws
    ? {
        title: laws[legalProvision as keyof typeof laws].title,
        id: legalProvision,
        info: laws[legalProvision as keyof typeof laws].info,
      }
    : {
        title: lawTitles[legalProvision],
        id: legalProvision,
        info: legalProvisionTooltips[legalProvision],
      }

export const legalProvisions: CheckboxInfo[] = [
  makeCheckboxInfo(CaseLegalProvisions._95_1_A),
  makeCheckboxInfo(CaseLegalProvisions._95_1_B),
  makeCheckboxInfo(CaseLegalProvisions._95_1_C),
  makeCheckboxInfo(CaseLegalProvisions._95_1_D),
  makeCheckboxInfo(CaseLegalProvisions._95_2),
  makeCheckboxInfo(CaseLegalProvisions._97_1),
  makeCheckboxInfo(CaseLegalProvisions._99_1_B),
  makeCheckboxInfo(CaseLegalProvisions._100_1),
  makeCheckboxInfo(CaseLegalProvisions._115_1),
]

export const legalProvisions115SubIds: CaseLegalProvisions[] = [
  CaseLegalProvisions._115_1_A,
  CaseLegalProvisions._115_1_B,
  CaseLegalProvisions._115_1_C,
  CaseLegalProvisions._115_1_D,
  CaseLegalProvisions._115_1_E,
  CaseLegalProvisions._115_1_F,
  CaseLegalProvisions._115_1_G,
  CaseLegalProvisions._115_1_H,
]

export const legalProvisions115Sub: CheckboxInfo[] =
  legalProvisions115SubIds.map(makeCheckboxInfo)

export const travelBanProvisions = legalProvisions.filter(
  (provision) =>
    provision.id === CaseLegalProvisions._95_1_A ||
    provision.id === CaseLegalProvisions._95_1_B ||
    provision.id === CaseLegalProvisions._100_1,
)
