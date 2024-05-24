import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const incomePlanFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'ip.application:applicationTitle',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
    },
  }),

  pre: defineMessages({
    registryIcelandDescription: {
      id: 'ip.application:registry.iceland.description',
      defaultMessage: 'Upplýsingar um þig.',
      description: 'Information about you.',
    },
    formTitle: {
      id: 'ip.application:form.title',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
    },
  }),

  info: defineMessages({
    section: {
      id: 'ip.application:section',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
    },
    instructionsTitle: {
      id: 'ip.application:instructions.title',
      defaultMessage: 'Leiðbeiningar um skráningu tekjuáætlunar',
      description: 'Instructions on filling out your income plan',
    },
    instructionsShortTitle: {
      id: 'ip.application:instructions.short.title',
      defaultMessage: 'Leiðbeiningar',
      description: 'Instructions',
    },
    instructionsDescription: {
      id: 'ip.application:instructions.description#markdown',
      defaultMessage:
        '\n* Á næstu síðu er að finna tillögu að tekjuáætlun. Þar getur þú breytt upphæðum og bætt við tekjum.\n* Skrá skal heildartekjur fyrir skatt í tekjuáætlun.\n* Fjármagnstekjur eru sameignlegar hjá hjónum og skal skrá heildar fjármagnstekjur hjóna í tekjuáætlun.\n* Ef maki er á lífeyri verða greiðslur hans einnig endurreiknaðar ef fjármagnstekjum er breytt.\n* Heimilt er að skrá atvinnutekjur á þá mánuði sem þeirra er aflað. Reiknast þá þær atvinnutekjur eingöngu í þeim mánuði. Vakin er athygli á að það þarf að haka sérstaklega við þann kost að óska mánaðarskiptingu atvinnutekna í tekjuáætlun.\n* Laun / lífeyrisgreiðslur skal skrá í þeim gjaldmiðli sem þau eru greidd.\n* Það er á ábyrgð lífeyrisþega að tekjuáætlun sé rétt og að nauðsynlegar upplýsingar til að hægt sé að ákvarða réttar greiðslur séu fyrirliggjandi.',
      description:
        '\n* On the next page you will find your proposed income plan. There you can edit amounts and add income categories.\n* You must submit your total pre-tax income in your income plan.\n* For couples, their total income must be recorded in the income plan, as their income is considered shared.\n* If a spouse is receiving disability, his or her benefits will also be recalculated if there is a change in income.\n* Income may be recorded in the month in which it is earned. The income is then calculated only for that month. Attention, it is necessary to select the option of requesting a monthly distribution of income in the income plan.\n* Salary / pension payments must be recorded in the currency in which they are paid.\n* It is the responsibility of the pensioner that the income plan is correct and that the necessary information for determining the correct payments is available.',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'ip.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    title: {
      id: 'ip.application:confirmation.title',
      defaultMessage: 'Senda inn tekjuáætlun',
      description: 'Review and submit',
    },
    description: {
      id: 'ip.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir tekjuáætlunina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    buttonEdit: {
      id: 'ip.application:button.edit',
      defaultMessage: 'Breyta tekjuáætlun',
      description: 'Edit application',
    },
  }),
}