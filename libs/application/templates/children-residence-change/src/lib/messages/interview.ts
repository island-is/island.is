import { defineMessages } from 'react-intl'

// Transfer interview
export const interview = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.interview.sectionTitle',
      defaultMessage: 'Viðtal',
      description: 'Interview section title',
    },
    pageTitle: {
      id: 'crc.application:section.interview.pageTitle',
      defaultMessage: 'Má bjóða þér viðtal?',
      description: 'Interview page title',
    },
    description: {
      id: 'crc.application:section.interview.description',
      defaultMessage:
        'Sýslumaður býður foreldrum að koma í viðtal þar sem er farið yfir málið og hægt að leita ráða og leiðbeininga eftir þörfum. Athugið að sýslumaður getur ákveðið að boða ykkur í viðtal þó að þú óskir ekki eftir því.',
      description: 'Interview page description',
    },
  }),
  yes: defineMessages({
    label: {
      id: 'crc.application:section.interview.yes.label',
      defaultMessage: 'Já takk, ég vil fá viðtal',
      description: 'Label for interview: yes',
    },
    information: {
      id: 'crc.application:section.interview.yes.information',
      defaultMessage:
        'Sýslumaður mun hafa samband. Þú þarft að klára umsóknina en hún verður ekki afgreidd fyrr en að loknu viðtali.',
      description: 'Info for interview: yes',
    },
    overviewText: {
      id: 'crc.application:section.interview.yes.overviewText',
      defaultMessage: 'Umsækjandi óskar eftir viðtali hjá sýslumanni',
      description:
        'Text displayed on the overview page if user has selected "yes" to getting an interview',
    },
  }),
  no: defineMessages({
    label: {
      id: 'crc.application:section.interview.no.label',
      defaultMessage: 'Nei takk',
      description: 'Label for interview: no',
    },
    information: {
      id: 'crc.application:section.interview.no.information',
      defaultMessage:
        'Athugaðu að sýslumaður gæti engu að síður boðað til viðtals ef þurfa þykir.',
      description: 'Info for interview: no',
    },
    overviewText: {
      id: 'crc.application:section.interview.no.overviewText',
      defaultMessage: 'Umsækjandi óskar ekki eftir viðtali hjá sýslumanni',
      description:
        'Text displayed on the overview page if user has selected "no" to getting an interview',
    },
  }),
}
