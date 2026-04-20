import { defineMessages } from 'react-intl'

export const regulation = {
  content: {
    general: defineMessages({
      section: {
        id: 'ojoi.application:regulation.content.general.section',
        defaultMessage: 'Grunnupplýsingar',
        description: 'Title of the regulation content section',
      },
      title: {
        id: 'ojoi.application:regulation.content.general.title',
        defaultMessage: 'Efni reglugerðar',
        description: 'Title of the regulation content screen',
      },
      intro: {
        id: 'ojoi.application:regulation.content.general.intro',
        defaultMessage:
          'Veldu deild og tegund birtingar, skráðu titil reglugerðar og settu efni hennar í ritilinn hér að neðan.',
        description: 'Intro of the regulation content screen',
      },
    }),
    inputs: {
      title: defineMessages({
        label: {
          id: 'ojoi.application:regulation.content.inputs.title.label',
          defaultMessage: 'Titill reglugerðar',
          description: 'Label for the regulation title input',
        },
        placeholder: {
          id: 'ojoi.application:regulation.content.inputs.title.placeholder',
          defaultMessage: 'Sláðu inn titil reglugerðar',
          description: 'Placeholder for the regulation title input',
        },
      }),
      text: defineMessages({
        label: {
          id: 'ojoi.application:regulation.content.inputs.text.label',
          defaultMessage: 'Texti reglugerðar',
          description: 'Label for the regulation text editor',
        },
      }),
      appendixes: defineMessages({
        label: {
          id: 'ojoi.application:regulation.content.inputs.appendixes.label',
          defaultMessage: 'Viðaukar',
          description: 'Label for the regulation appendixes section',
        },
        addButton: {
          id: 'ojoi.application:regulation.content.inputs.appendixes.addButton',
          defaultMessage: 'Bæta við viðauka',
          description: 'Button label for adding a new appendix',
        },
      }),
    },
    headings: defineMessages({
      department: {
        id: 'ojoi.application:regulation.content.headings.department',
        defaultMessage: 'Deild og tegund',
        description: 'Heading for department and type selection',
      },
      body: {
        id: 'ojoi.application:regulation.content.headings.body',
        defaultMessage: 'Efni til birtingar',
        description: 'Heading for the body content section',
      },
    }),
    warnings: defineMessages({
      diffPrecisionWarning: {
        id: 'ojoi.application:regulation.content.warnings.diffPrecisionWarning',
        defaultMessage:
          'Vakin er athygli á því að kerfið útbýr tillögu að breytingareglugerð sem starfsmaður þarf að rýna gaumgæfilega áður en haldið er áfram. Ekki er öruggt að inngangsliðir og efnisákvæði færist réttilega inn í breytingareglugerðina.',
        description:
          'Warning about diff precision when editing amending regulation content',
      },
    }),
  },
  meta: {
    general: defineMessages({
      section: {
        id: 'ojoi.application:regulation.meta.general.section',
        defaultMessage: 'Lýsigögn',
        description: 'Title of the regulation meta section',
      },
      title: {
        id: 'ojoi.application:regulation.meta.general.title',
        defaultMessage: 'Lýsigögn reglugerðar',
        description: 'Title of the regulation meta screen',
      },
      intro: {
        id: 'ojoi.application:regulation.meta.general.intro',
        defaultMessage:
          'Skráðu gildistökudag, lagakafla og aðrar upplýsingar um reglugerðina.',
        description: 'Intro of the regulation meta screen',
      },
    }),
    inputs: {
      effectiveDate: defineMessages({
        label: {
          id: 'ojoi.application:regulation.meta.inputs.effectiveDate.label',
          defaultMessage: 'Gildistökudagur',
          description: 'Label for the effective date input',
        },
        placeholder: {
          id: 'ojoi.application:regulation.meta.inputs.effectiveDate.placeholder',
          defaultMessage: 'Veldu gildistökudag',
          description: 'Placeholder for the effective date input',
        },
      }),
      lawChapters: defineMessages({
        label: {
          id: 'ojoi.application:regulation.meta.inputs.lawChapters.label',
          defaultMessage: 'Lagakaflar',
          description: 'Label for the law chapters input',
        },
        placeholder: {
          id: 'ojoi.application:regulation.meta.inputs.lawChapters.placeholder',
          defaultMessage: 'Veldu lagakafla',
          description: 'Placeholder for the law chapters input',
        },
      }),
      fastTrack: defineMessages({
        label: {
          id: 'ojoi.application:regulation.meta.inputs.fastTrack.label',
          defaultMessage: 'Hraðbirting',
          description: 'Label for the fast track checkbox',
        },
        description: {
          id: 'ojoi.application:regulation.meta.inputs.fastTrack.description',
          defaultMessage:
            'Reglugerðin verður birt innan 10 virkra daga frá innsendingu.',
          description: 'Description for the fast track checkbox',
        },
      }),
      draftingNotes: defineMessages({
        label: {
          id: 'ojoi.application:regulation.meta.inputs.draftingNotes.label',
          defaultMessage: 'Athugasemdir til ritstjóra',
          description: 'Label for the drafting notes input',
        },
        placeholder: {
          id: 'ojoi.application:regulation.meta.inputs.draftingNotes.placeholder',
          defaultMessage: 'Skráðu athugasemdir til ritstjóra ef einhverjar eru',
          description: 'Placeholder for the drafting notes input',
        },
      }),
    },
    headings: defineMessages({
      effectiveDate: {
        id: 'ojoi.application:regulation.meta.headings.effectiveDate',
        defaultMessage: 'Gildistaka',
        description: 'Heading for the effective date section',
      },
      lawChapters: {
        id: 'ojoi.application:regulation.meta.headings.lawChapters',
        defaultMessage: 'Flokkun',
        description: 'Heading for the law chapters section',
      },
      publishingOptions: {
        id: 'ojoi.application:regulation.meta.headings.publishingOptions',
        defaultMessage: 'Birtingarvalkostir',
        description: 'Heading for the publishing options section',
      },
    }),
  },
  impacts: {
    general: defineMessages({
      section: {
        id: 'ojoi.application:regulation.impacts.general.section',
        defaultMessage: 'Áhrif',
        description: 'Title of the regulation impacts section',
      },
      title: {
        id: 'ojoi.application:regulation.impacts.general.title',
        defaultMessage: 'Áhrif á aðrar reglugerðir',
        description: 'Title of the regulation impacts screen',
      },
      intro: {
        id: 'ojoi.application:regulation.impacts.general.intro',
        defaultMessage:
          'Skráðu hvaða reglugerðum þessi reglugerð breytir eða fellir úr gildi.',
        description: 'Intro of the regulation impacts screen',
      },
    }),
    buttons: defineMessages({
      addAmendment: {
        id: 'ojoi.application:regulation.impacts.buttons.addAmendment',
        defaultMessage: 'Bæta við breytingu',
        description: 'Button label for adding a new amendment impact',
      },
      addCancellation: {
        id: 'ojoi.application:regulation.impacts.buttons.addCancellation',
        defaultMessage: 'Bæta við brottfellingu',
        description: 'Button label for adding a new cancellation impact',
      },
    }),
    alerts: defineMessages({
      baseRegulationNote: {
        id: 'ojoi.application:regulation.impacts.alerts.baseRegulationNote',
        defaultMessage:
          'ATH: Sé ætlunin að breyta annarri reglugerð, þarf að minnast á þá reglugerð með skýrum hætti í þessari stofnreglugerð.',
        description: 'Alert message for base regulation impacts',
      },
      reviewText: {
        id: 'ojoi.application:regulation.impacts.alerts.reviewText',
        defaultMessage: 'Endurskoða textann',
        description: 'Link text to review regulation content',
      },
      whatToDo: {
        id: 'ojoi.application:regulation.impacts.alerts.whatToDo',
        defaultMessage: 'Hvað viltu gera við reglugerðina?',
        description: 'Heading for impact type selection',
      },
      makeTextChanges: {
        id: 'ojoi.application:regulation.impacts.alerts.makeTextChanges',
        defaultMessage: 'Gera textabreytingar',
        description: 'Button label for text amendment',
      },
      or: {
        id: 'ojoi.application:regulation.impacts.alerts.or',
        defaultMessage: 'eða',
        description: 'Conjunction between buttons',
      },
      revokeRegulation: {
        id: 'ojoi.application:regulation.impacts.alerts.revokeRegulation',
        defaultMessage: 'Fella hana brott',
        description: 'Button label for revoking a regulation',
      },
    }),
    labels: defineMessages({
      amendment: {
        id: 'ojoi.application:regulation.impacts.labels.amendment',
        defaultMessage: 'Breyting',
        description: 'Label for an amendment impact',
      },
      cancellation: {
        id: 'ojoi.application:regulation.impacts.labels.cancellation',
        defaultMessage: 'Brottfelling',
        description: 'Label for a cancellation impact',
      },
      noImpacts: {
        id: 'ojoi.application:regulation.impacts.labels.noImpacts',
        defaultMessage: 'Engin áhrif skráð',
        description: 'Label when no impacts have been added',
      },
      searchRegulation: {
        id: 'ojoi.application:regulation.impacts.labels.searchRegulation',
        defaultMessage: 'Leita að reglugerð',
        description: 'Label for the regulation search input',
      },
      mentionedNotFound: {
        id: 'ojoi.application:regulation.impacts.labels.mentionedNotFound',
        defaultMessage: 'er ekki reglugerð',
        description:
          'Shown when a mentioned regulation number does not exist in the system',
      },
      mentionedRepealed: {
        id: 'ojoi.application:regulation.impacts.labels.mentionedRepealed',
        defaultMessage: 'brottfallin',
        description: 'Shown when a mentioned regulation has been repealed',
      },
      baseNotFound: {
        id: 'ojoi.application:regulation.impacts.labels.baseNotFound',
        defaultMessage: 'Stofnreglugerð fannst ekki við leit að',
        description:
          'Shown in amending search when no regulation matches the query',
      },
    }),
  },
  preview: {
    general: defineMessages({
      section: {
        id: 'ojoi.application:regulation.preview.general.section',
        defaultMessage: 'Forskoðun',
        description: 'Title of the regulation preview section',
      },
      title: {
        id: 'ojoi.application:regulation.preview.general.title',
        defaultMessage: 'Forskoðun reglugerðar',
        description: 'Title of the regulation preview screen',
      },
      intro: {
        id: 'ojoi.application:regulation.preview.general.intro',
        defaultMessage:
          'Forskoðaðu reglugerðina og gangið úr skugga um að innihald og uppsetning séu rétt áður en haldið er áfram.',
        description: 'Intro of the regulation preview screen',
      },
    }),
    errors: defineMessages({
      noContent: {
        id: 'ojoi.application:regulation.preview.errors.noContent',
        defaultMessage: 'Upplýsingar vantar í skráningu reglugerðar',
        description:
          'Error message when regulation content is missing in preview',
      },
      noContentMessage: {
        id: 'ojoi.application:regulation.preview.errors.noContentMessage',
        defaultMessage: 'Að lágmarki þarf að fylla út',
        description: 'Error message detail when regulation content is missing',
      },
    }),
  },
  summary: {
    general: defineMessages({
      section: {
        id: 'ojoi.application:regulation.summary.general.section',
        defaultMessage: 'Samantekt',
        description: 'Title of the regulation summary section',
      },
      title: {
        id: 'ojoi.application:regulation.summary.general.title',
        defaultMessage: 'Samantekt og innsending',
        description: 'Title of the regulation summary screen',
      },
      intro: {
        id: 'ojoi.application:regulation.summary.general.intro',
        defaultMessage:
          'Farðu yfir reglugerðina og sendu inn til birtingar í Stjórnartíðindum.',
        description: 'Intro of the regulation summary screen',
      },
    }),
    headings: defineMessages({
      warnings: {
        id: 'ojoi.application:regulation.summary.headings.warnings',
        defaultMessage: 'Athugasemdir',
        description: 'Heading for the warnings section',
      },
      overview: {
        id: 'ojoi.application:regulation.summary.headings.overview',
        defaultMessage: 'Yfirlit',
        description: 'Heading for the overview section',
      },
    }),
    labels: defineMessages({
      noWarnings: {
        id: 'ojoi.application:regulation.summary.labels.noWarnings',
        defaultMessage: 'Engar athugasemdir fundust',
        description: 'Label when no warnings are present',
      },
      department: {
        id: 'ojoi.application:regulation.summary.labels.department',
        defaultMessage: 'Deild',
        description: 'Label for department in summary',
      },
      type: {
        id: 'ojoi.application:regulation.summary.labels.type',
        defaultMessage: 'Tegund',
        description: 'Label for type in summary',
      },
      title: {
        id: 'ojoi.application:regulation.summary.labels.title',
        defaultMessage: 'Titill',
        description: 'Label for title in summary',
      },
      effectiveDate: {
        id: 'ojoi.application:regulation.summary.labels.effectiveDate',
        defaultMessage: 'Gildistökudagur',
        description: 'Label for effective date in summary',
      },
      lawChapters: {
        id: 'ojoi.application:regulation.summary.labels.lawChapters',
        defaultMessage: 'Lagakaflar',
        description: 'Label for law chapters in summary',
      },
      impacts: {
        id: 'ojoi.application:regulation.summary.labels.impacts',
        defaultMessage: 'Áhrif',
        description: 'Label for impacts in summary',
      },
      fastTrack: {
        id: 'ojoi.application:regulation.summary.labels.fastTrack',
        defaultMessage: 'Hraðbirting',
        description: 'Label for fast track in summary',
      },
      yes: {
        id: 'ojoi.application:regulation.summary.labels.yes',
        defaultMessage: 'Já',
        description: 'Yes label',
      },
      no: {
        id: 'ojoi.application:regulation.summary.labels.no',
        defaultMessage: 'Nei',
        description: 'No label',
      },
    }),
  },
}
