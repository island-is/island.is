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
})
