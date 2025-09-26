import { defineMessages } from 'react-intl'

export const notEligible = defineMessages({
  title: {
    id: 'dp.application:not.eligible.title',
    defaultMessage: 'Því miður átt þú ekki rétt á örorkulífeyri',
    description: 'Unfortunately, you are not eligible for disability pension.',
  },
  applicantAgeOutOfRangeDescription: {
    id: 'dp.application:not.eligible.applicant.age.out.of.range.description#markdown',
    defaultMessage:
      'Ástæðan fyrir því er eftirfarandi:\n* Þú ert ekki á aldrinum 18-67 ára.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
    description:
      'The reason for this is the following:\n* You are not aged 18-67.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  noLegalDomicileInIcelandDescription: {
    id: 'dp.application:not.eligible.no.legal.domicile.in.iceland.description#markdown',
    defaultMessage:
      'Ástæðan fyrir því er eftirfarandi:\n* Þú átt ekki lögheimili á Íslandi.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
    description:
      'The reason for this is the following:\n* You have no legal domicile in Iceland.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  latestDisabilityPensionDocumentNotFoundDescription: {
    id: 'dp.application:not.eligible.latest.disability.pension.document.not.found.description#markdown',
    defaultMessage:
      'Ástæðan fyrir því er eftirfarandi:\n* Örorkuvottorð fannst ekki.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
    description:
      'The reason for this is the following:\n* No disability certificate was found.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  applicantAlreadyHasPendingApplicationDescription: {
    id: 'dp.application:not.eligible.applicant.already.has.pending.application.description#markdown',
    defaultMessage:
      'Ástæðan fyrir því er eftirfarandi:\n* Þú ert þegar með virka umsókn í gangi.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
    description:
      'The reason for this is the following:\n* You already have a pending application.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  applicantAlreadyHasFullDisabilityPensionDescription: {
    id: 'dp.application:not.eligible.applicant.already.has.full.disability.pension.description#markdown',
    defaultMessage:
      'Ástæðan fyrir því er eftirfarandi:\n* Þú ert þegar með skráða fulla örorku.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
    description:
      'The reason for this is the following:\n* You already have a full disability pension.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
})
