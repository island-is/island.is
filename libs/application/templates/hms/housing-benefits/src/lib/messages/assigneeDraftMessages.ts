import { defineMessages } from 'react-intl'

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
