import { defineMessages } from 'react-intl'

// Application rejected
export const rejected = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.rejected.sectionTitle',
      defaultMessage: 'Umsókn hafnað',
      description: 'Application rejected section title',
    },
    pageTitle: {
      id: 'crc.application:section.rejected.pageTitle',
      defaultMessage: 'Umsókn um breytt lögheimili og meðlag hafnað',
      description: 'Application rejected page title',
    },
    description: {
      id: 'crc.application:section.rejected.description#markdown',
      defaultMessage:
        'Umsókn ykkar um staðfestingu á samningi um breytt lögheimili og meðlag var hafnað af sýslumanni.\n\nÁstæður höfnunar koma fram í bréfi sem er að finna undir Rafræn skjöl á [Island.is](https://island.is/minarsidur).',
      description: 'Application rejected page description',
    },
  }),
}

// Application approved
export const approved = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.approved.sectionTitle',
      defaultMessage: 'Umsókn samþykkt',
      description: 'Application approved section title',
    },
    pageTitle: {
      id: 'crc.application:section.approved.pageTitle',
      defaultMessage: 'Umsókn um breytt lögheimili og meðlag samþykkt',
      description: 'Application approved page title',
    },
    description: {
      id: 'crc.application:section.approved.description#markdown',
      defaultMessage:
        'Samningur ykkar um breytt lögheimili og meðlag var staðfestur af sýslumanni.\n\nFormlega staðfestingu á samningnum sem þið gerðuð ykkar á milli er að finna undir Rafræn skjöl á [Island.is](https://island.is/minarsidur).\n\n',
      description: 'Application approved page description',
    },
  }),
  nextSteps: defineMessages({
    title: {
      id: 'crc.application:section.approved.nextSteps.title',
      defaultMessage: 'Næstu skref',
      description: 'Application approved next steps title',
    },
    text: {
      id: 'crc.application:section.approved.nextSteps.text#markdown',
      defaultMessage:
        '- Sýslumaður hefur nú þegar tilkynnt breytta lögheimilisskráningu til Þjóðskrár Íslands.\\n- Til að meðlag fari í innheimtu þarf nýtt lögheimilisforeldri að skila staðfestingunni rafrænt til Tryggingastofnunar',
      description: 'Application approved next steps text',
    },
  }),
}
