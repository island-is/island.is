import { defineMessages } from 'react-intl'

export const assigneeDraftOverview = defineMessages({
  title: {
    id: 'hb.application:assigneeDraft.overview.title',
    defaultMessage: 'Yfirlit',
    description: 'Assignee overview section title',
  },
  description: {
    id: 'hb.application:assigneeDraft.overview.description',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og staðfestu að þær séu réttar.',
    description: 'Assignee overview section description',
  },
  personalInfoTitle: {
    id: 'hb.application:assigneeDraft.overview.personalInfoTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Assignee overview personal info title',
  },
  assetDeclarationTitle: {
    id: 'hb.application:assigneeDraft.overview.assetDeclarationTitle',
    defaultMessage: 'Eignayfirlýsing',
    description: 'Assignee overview asset declaration title',
  },
  ownsAssets: {
    id: 'hb.application:assigneeDraft.overview.ownsAssets',
    defaultMessage: 'Á eignir',
    description: 'Owns assets label',
  },
  yes: {
    id: 'hb.application:assigneeDraft.overview.yes',
    defaultMessage: 'Já',
    description: 'Yes',
  },
  no: {
    id: 'hb.application:assigneeDraft.overview.no',
    defaultMessage: 'Nei',
    description: 'No',
  },
  assetDescription: {
    id: 'hb.application:assigneeDraft.overview.assetDescription',
    defaultMessage: 'Lýsing eigna',
    description: 'Asset description label',
  },
  addressMatchTitle: {
    id: 'hb.application:assigneeDraft.overview.addressMatchTitle',
    defaultMessage: 'Lögheimili',
    description: 'Assignee overview address match title',
  },
  addressMatchStatus: {
    id: 'hb.application:assigneeDraft.overview.addressMatchStatus',
    defaultMessage: 'Lögheimili passar við leigusamning',
    description: 'Address match status label',
  },
  addressMatchConfirmed: {
    id: 'hb.application:assigneeDraft.overview.addressMatchConfirmed',
    defaultMessage: 'Lögheimili passar við heimilisfang á leigusamningi',
    description: 'Address matches rental agreement',
  },
  accessAgreementTitle: {
    id: 'hb.application:assigneeDraft.overview.accessAgreementTitle',
    defaultMessage: 'Umgengnissamningur',
    description: 'Assignee overview access agreement title',
  },
  accessAgreementForChild: {
    id: 'hb.application:assigneeDraft.overview.accessAgreementForChild',
    defaultMessage: 'Tengist barni',
    description:
      'Overview label: which child the custody agreement file applies to',
  },
  accessAgreementRowKey: {
    id: 'hb.application:assigneeDraft.overview.accessAgreementRowKey',
    defaultMessage: 'Umgengnissamningur – {childName}',
    description:
      'Overview row title when each repeater row maps one child to uploaded files',
  },
  submitButton: {
    id: 'hb.application:assigneeDraft.overview.submitButton',
    defaultMessage: 'Staðfesta',
    description: 'Assignee overview submit button',
  },
})

export const assigneeDraft = defineMessages({
  title: {
    id: 'hb.application:assigneeDraft.title',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Assignee draft title',
  },
  wrongHomeTitle: {
    id: 'hb.application:assigneeDraft.wrongHomeTitle',
    defaultMessage: 'Lögheimili',
    description: 'Assignee draft wrong home title',
  },
  wrongHomeMultiFieldTitle: {
    id: 'hb.application:assigneeDraft.wrongHomeMultiFieldTitle',
    defaultMessage: 'Misræmi í lögheimilisskráningu',
    description: 'Assignee draft wrong home multi field title',
  },
  wrongHomeDescription: {
    id: 'hb.application:assigneeDraft.wrongHomeDescription',
    defaultMessage:
      'Lögheimili þitt er ekki það sama og heimilisfangið á leigusamningnum sem verið er að sækja um bætur fyrir.',
    description: 'Assignee draft wrong home description',
  },
  wrongHomeDescription2: {
    id: 'hb.application:assigneeDraft.wrongHomeDescription2',
    defaultMessage:
      'Vinsamlegast breyttu lögheimilisskráningunni þinni til að hún passi við heimilisfangið á leigusamningnum.',
    description: 'Assignee draft wrong home description 2',
  },
  wrongHomeDescription3: {
    id: 'hb.application:assigneeDraft.wrongHomeDescription3#markdown',
    defaultMessage:
      'Lögheimilisskráningu má breyta á heimasíðu Þjóðskrár, nánari upplýsingar má nálgast [hér](https://island.is/flytja-logheimili).',
    description: 'Assignee draft wrong home description 3',
  },
  wrongHomeDescription4: {
    id: 'hb.application:assigneeDraft.wrongHomeDescription4',
    defaultMessage:
      'Þegar lögheimilsskráning hefur verið uppfærð má halda áfram með umsóknina og sækja uppfærð gögn.',
    description: 'Assignee draft wrong home description 4',
  },
  wrongHomeCheckboxLabel: {
    id: 'hb.application:assigneeDraft.wrongHomeCheckboxLabel',
    defaultMessage:
      'Ég hef uppfært lögheimilisskráningu hjá Þjóðskrá og vil sækja ný gögn.',
    description: 'Checkbox label confirming user has updated their address',
  },
  refetchTitle: {
    id: 'hb.application:assigneeDraft.refetchTitle',
    defaultMessage: 'Sækja uppfærðar upplýsingar',
    description: 'Title for refetch external data screen',
  },
  refetchSubTitle: {
    id: 'hb.application:assigneeDraft.refetchSubTitle',
    defaultMessage:
      'Eftirfarandi upplýsingar verða sóttar til að uppfæra lögheimiliskráningu þína.',
    description: 'Subtitle for refetch external data screen',
  },
  umgengnissamningurTitle: {
    id: 'hb.application:assigneeDraft.umgengnissamningurTitle',
    defaultMessage: 'Umgengnissamningur',
    description: 'Assignee draft umgengnissamningur screen title',
  },
  umgengnissamningurDescription: {
    id: 'hb.application:assigneeDraft.umgengnissamningurDescription#markdown',
    defaultMessage:
      'Undir 18 ára heimilismenn sem ekki koma undir forsjá umsækjanda né þína forsjá skv. gögnum hér, og þar sem enginn annar heimilismaður er með forsjá eftir gögnum, kunna að krefjast umgengnissamnings. Bættu við línu fyrir hvert barn sem þú vilt senda inn umgengnissamning um, veldu barnið og hladdu upp skjali ef þú ert með það.',
    description: 'Description for assignee umgengnissamningur upload screen',
  },
  umgengnissamningurDescriptionWithChildren: {
    id: 'hb.application:assigneeDraft.umgengnissamningurDescriptionWithChildren#markdown',
    defaultMessage:
      'Undir 18 ára heimilismenn sem ekki koma undir forsjá umsækjanda né þína forsjá skv. gögnum hér, og þar sem enginn annar heimilismaður er með forsjá eftir gögnum, kunna að krefjast umgengnissamnings.\n\n**Heimilismenn undir 18 sem um getur:** {names}\n\nBættu við línu fyrir hvert barn sem þú vilt senda inn umgengnissamning um, veldu viðeigandi barn og hladdu upp skjali ef þú ert með það.',
    description:
      'Assignee umgengnissamningur screen description including names of relevant minors',
  },
  umgengnissamningurRepeaterFormTitle: {
    id: 'hb.application:assigneeDraft.umgengnissamningurRepeaterFormTitle',
    defaultMessage: 'Skjal {index}',
    description:
      'Title for each row in assignee umgengnissamningur fields repeater',
  },
  umgengnissamningurRepeaterAddItem: {
    id: 'hb.application:assigneeDraft.umgengnissamningurRepeaterAddItem',
    defaultMessage: 'Bæta við skjali',
    description: 'Add row button for umgengnissamningur fields repeater',
  },
  umgengnissamningurSelectChildTitle: {
    id: 'hb.application:assigneeDraft.umgengnissamningurSelectChildTitle',
    defaultMessage: 'Hvaða barn tengist umgengnissamningnum sem þú hleður upp?',
    description:
      'Title for radio when multiple minors need an umgengnissamningur from this assignee',
  },
  umgengnissamningurSelectChildDescription: {
    id: 'hb.application:assigneeDraft.umgengnissamningurSelectChildDescription#markdown',
    defaultMessage:
      'Ef einungis einn umgengnissamningur er til staðar skaltu velja barnið sem hann á við. Ef þú hleður ekki upp skjali þarftu ekki að velja.',
    description:
      'Help text for child selection when several minors need an agreement',
  },
  umgengnissamningurFileTitle: {
    id: 'hb.application:assigneeDraft.umgengnissamningurFileTitle',
    defaultMessage: 'Umgengnissamningur',
    description: 'File upload title for umgengnissamningur (optional)',
  },
  assetDeclerationTitle: {
    id: 'hb.application:assigneeDraft.assetDeclerationTitle',
    defaultMessage: 'Eignayfirlýsing',
    description: 'Assignee draft asset declaration section title',
  },
  assetDeclerationMultiFieldTitle: {
    id: 'hb.application:assigneeDraft.assetDeclerationMultiFieldTitle',
    defaultMessage: 'Eignayfirlýsing',
    description: 'Assignee draft asset declaration multi field title',
  },
  assetDeclerationDescription: {
    id: 'hb.application:assigneeDraft.assetDeclerationDescription',
    defaultMessage:
      'Skattframtali fyrir síðasta ár hefur ekki verið skilað. Til að halda áfram þarf að fylla út eignayfirlýsingu.',
    description: 'Assignee draft asset declaration description',
  },
  assetDeclerationDescription2: {
    id: 'hb.application:assigneeDraft.assetDeclerationDescription2',
    defaultMessage:
      'Eignayfirlýsing er einfaldlega upplistun á öllum þínum eignum. Ef þú átt engar eignir, þá þarft þú að lýsa því yfir að þú átt engar eignir.',
    description: 'Assignee draft asset declaration description 2',
  },
  assetDeclerationRadioTitle: {
    id: 'hb.application:assigneeDraft.assetDeclerationRadioTitle',
    defaultMessage: 'Átt þú einhverskonar eignir?',
    description: 'Assignee draft asset declaration radio title',
  },
  assetDeclerationRadioDescription: {
    id: 'hb.application:assigneeDraft.assetDeclerationRadioDescription',
    defaultMessage:
      'Eignir geta til dæmis verið: Fasteignir, ökutæki, hlutabréf eða fjármagn',
    description: 'Assignee draft asset declaration radio description',
  },
  assetDeclerationTextFieldDescription: {
    id: 'hb.application:assigneeDraft.assetDeclerationTextFieldDescription',
    defaultMessage: 'Vinsamlegast listaðu upp allar þínar eignir.',
    description: 'Assignee draft asset declaration text field description',
  },
  validationAssetDeclerationTextFieldRequired: {
    id: 'hb.application:assigneeDraft.validationAssetDeclerationTextFieldRequired',
    defaultMessage: 'Vinsamlegast fylltu út eignayfirlýsingu',
    description: 'Assignee draft asset declaration text field required',
  },
})
