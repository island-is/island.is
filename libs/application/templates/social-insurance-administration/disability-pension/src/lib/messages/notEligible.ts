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
      'Þú ert ekki á aldri sem heimilar umsókn um örorkulífeyri. Til þess að sækja um örorkulífeyri þarft þú að vera á aldrinum 18 til 67 ára. Ef þú ert yngri en 18 ára, þá þarftu að bíða þar til þú nærð þeim aldri til að geta sótt um. Ef þú hefur náð 67 ára aldri, þá áttu ekki rétt á örorkulífeyri en getur sótt um ellilífeyri inni á heimsíðu tr.is',
    description:
      'The reason for this is the following:\n* You are not aged 18-67.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  noLegalDomicileInIcelandDescription: {
    id: 'dp.application:not.eligible.no.legal.domicile.in.iceland.description#markdown',
    defaultMessage:
      'Þú ert ekki með lögheimili á Íslandi. Þú getur sótt um örorkulífeyri í gegnum viðeigandi stofnun í búsetulandi þínu. Ef ekki getur þú haft samband við Tryggingastofnun. Nánar má lesa um skilyrði fyrir umsókn um örorkulífeyri á heimasíðu TR. [https://island.is/nyr-ororkulifeyrir](https://island.is/nyr-ororkulifeyrir)',
    description:
      'The reason for this is the following:\n* You have no legal domicile in Iceland.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  latestDisabilityPensionDocumentNotFoundDescription: {
    id: 'dp.application:not.eligible.latest.disability.pension.document.not.found.description#markdown',
    defaultMessage:
      'Ekki liggur fyrir læknisvottorð vegna umsóknar um örorkulífeyri.\n\nLæknisvottorð er skilyrði þess að þú getir sótt um örorkulífeyri.\n\nÞegar viðeigandi læknisvottorð hefur borist getur þú skráð þig inn aftur og lokið umsókn þinni. Viljir þú sækja um á grundvelli eldra læknisvottorðs getur þú fylgt út umsókn í gegnum eftirfarandi tengil: [https://minarsidur.tr.is/umsoknir/umsokn-um-ororkulifeyri#skref1](https://minarsidur.tr.is/umsoknir/umsokn-um-ororkulifeyri#skref1)',
    description:
      'The reason for this is the following:\n* No disability certificate was found.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  applicantAlreadyHasPendingApplicationDescription: {
    id: 'dp.application:not.eligible.applicant.already.has.pending.application.description#markdown',
    defaultMessage: 'Þú ert nú þegar með umsókn um örorkulífeyri í ferli.',
    description:
      'The reason for this is the following:\n* You already have a pending application.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  applicantAlreadyHasFullDisabilityPensionDescription: {
    id: 'dp.application:not.eligible.applicant.already.has.full.disability.pension.description#markdown',
    defaultMessage: 'Þú ert örorkulífeyrisþegi.',
    description:
      'The reason for this is the following:\n* You already have a full disability pension.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
  errorProcessingClientDescription: {
    id: 'dp.application:not.eligible.error.processing.client.description#markdown',
    defaultMessage:
      'Óskilgreind villa kom upp við að sækja gögn eða staðfesta að þú uppfyllir skilyrði til þess að fá að sækja um örorkulífeyri.\n\nVinsamlegast reyndu aftur síðar þar sem tenging við ytri aðila getur legið niðri.\n\nEf þessi villa kemur aftur, vinsamlegast afritaðu textann, skráðu þig inn á [minarsidur.tr.is](https://minarsidur.tr.is) og smelltu á "Hafa samband", smelltu svo á "Örorkumat" kassann og límdu svo textann af villunni inn í erindið og sendu þau.',
    description:
      'The reason for this is the following:\n* You already have a full disability pension.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
  },
})
