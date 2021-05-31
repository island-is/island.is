import { defineMessages } from 'react-intl'

// Transfer duration
export const duration = {
  general: defineMessages({
    sectionTitle: {
      id: 'jca.application:section.arrangement.duration.sectionTitle',
      defaultMessage: 'Gildistími samnings',
      description: 'Duration section title',
    },
    pageTitle: {
      id: 'jca.application:section.arrangement.duration.pageTitle',
      defaultMessage: 'Í hve langan tíma á samningurinn að gilda?',
      description: 'Duration page title',
    },
    description: {
      id: 'jca.application:section.arrangement.duration.description#markdown',
      defaultMessage:
        'Hægt er að gera tímabundna breytingu á forsjá til a.m.k. 6 mánaða eða lengur eða velja að samningur gildi til 18 ára aldurs barnsins/barnanna.\\n\\nEkki er hægt að gera nýjan samning innan 6 mánaða frá gildistöku breytingar.\\n\\nAthugið að samningurinn tekur gildi þann dag sem sýslumaður staðfestir samninginn og getur þar af leiðandi ekki verið afturvirkur. Staðfestingarferli getur tekið allt að 14 daga eftir að samningur hefur verið undirritaður af báðum foreldrum.',
      description: 'Duration page description',
    },
  }),
  permanentInput: defineMessages({
    label: {
      id: 'jca.application:section.arrangement.duration.permanent.label',
      defaultMessage: 'Varanlegur samningur',
      description: 'Label for permanent change',
    },
    subLabel: {
      id: 'jca.application:section.arrangement.duration.permanent.subLabel',
      defaultMessage: 'Samningurinn gildir til 18 ára aldurs barns',
      description: 'Sub label for permanent change',
    },
    tooltip: {
      id: 'jca.application:section.arrangement.duration.permanent.tooltip',
      defaultMessage:
        'Varanlegur samningur gildir þar til barnið hefur náð 18 ára aldri. Til að breyta fyrirkomulaginu til baka þarf að útbúa og undirrita nýjan samning.',
      description: 'Tooltip for permanent change',
    },
  }),
  temporaryInput: defineMessages({
    label: {
      id: 'jca.application:section.arrangement.duration.temporary.label',
      defaultMessage: 'Tímabundið',
      description: 'Label for temporary change',
    },
    subLabel: {
      id: 'jca.application:section.arrangement.duration.temporary.subLabel',
      defaultMessage: '6 mánuðir eða lengur',
      description: 'Sub label for temporary change',
    },
    tooltip: {
      id: 'jca.application:section.arrangement.duration.temporary.tooltip',
      defaultMessage:
        'Tímabundinn samningur getur minnst verið til 6 mánaða. Að tímabili loknu þurfa foreldrar að óska eftir því við Þjóðskrá að skráning forsjár fari til fyrra horfs.',
      description: 'Tooltip for temporary change',
    },
  }),
  dateInput: defineMessages({
    label: {
      id: 'jca.application:section.arrangement.duration.dateInput.label',
      defaultMessage: 'Gildir til',
      description: 'Label for date input',
    },
    placeholder: {
      id: 'jca.application:section.arrangement.duration.dateInput.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Sub label for date input',
    },
  }),
}
