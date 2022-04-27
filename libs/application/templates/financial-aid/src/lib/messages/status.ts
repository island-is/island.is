import { defineMessages } from 'react-intl'

export const status = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.status.general.sectionTitle',
      defaultMessage: 'Staða umsóknar fyrir fjárhagsaðstoð',
      description: 'Status section title',
    },
    pageTitle: {
      id: 'fa.application:section.status.general.pageTitle',
      defaultMessage: 'Aðstoðin þín',
      description: 'Status page title',
    },
    spousePageTitle: {
      id: 'fa.application:section.status.general.spousePageTitle',
      defaultMessage: 'Aðstoð maka þíns',
      description: 'Status page title',
    },
  }),
  moreActions: defineMessages({
    title: {
      id: 'fa.application:section.status.moreActions.title',
      defaultMessage: 'Frekari aðgerðir í boði',
      description: 'More action title',
    },
    rulesLink: {
      id: 'fa.application:section.status.moreActions.rulesLink#markup',
      defaultMessage: '[Reglur um fjárhagsaðstoð]({rulesPage})',
      description: 'More action link to rules',
    },
    emailLink: {
      id: 'fa.application:section.status.moreActions.emailLink#markup',
      defaultMessage: '[Hafa samband]({email})',
      description: 'More action link to email',
    },
  }),
  timeline: defineMessages({
    title: {
      id: 'fa.application:section.status.timeline.title',
      defaultMessage: 'Umsóknarferlið',
      description: 'Timeline title',
    },
    description: {
      id: 'fa.application:section.status.timeline.description',
      defaultMessage:
        'Hér geturðu séð hvað hefur gerst og hvað er framundan. Hikaðu ekki við að senda okkur athugasemd ef þú telur eitthvað óljóst eða rangt.',
      description: 'Timeline description',
    },
    receivedTitle: {
      id: 'fa.application:section.status.timeline.receivedTitle',
      defaultMessage: 'Umsókn móttekin',
      description: 'Timeline received step title',
    },
    receivedDescription: {
      id: 'fa.application:section.status.timeline.receivedDescription',
      defaultMessage:
        'Umsóknin verður tekin til úrvinnslu eins fljótt og kostur er.',
      description: 'Timeline received step description',
    },
    inProgressTitle: {
      id: 'fa.application:section.status.timeline.inProgressTitle',
      defaultMessage: 'Umsókn í vinnslu',
      description: 'Timeline in progress step title',
    },
    inProgressDescription: {
      id: 'fa.application:section.status.timeline.inProgressDescription',
      defaultMessage:
        'Úrvinnsla umsóknarinnar er hafin. Ef þörf er á frekari upplýsingum eða gögnum mun vinnsluaðili óska eftir því hér á þessari stöðusíðu.',
      description: 'Timeline in progress step description',
    },
    resultsTitle: {
      id: 'fa.application:section.status.timeline.resultsTitle',
      defaultMessage: 'Niðurstaða',
      description: 'Timeline results step title',
    },
    resultsDescription: {
      id: 'fa.application:section.status.timeline.resultsDescription',
      defaultMessage:
        'Umsókn verður samþykkt eða henni hafnað og umsækjandi látinn vita um niðurstöðuna.',
      description: 'Timeline results step description',
    },
  }),
  aidAmount: defineMessages({
    title: {
      id: 'fa.application:section.status.aidAmount.title',
      defaultMessage: 'Áætluð aðstoð',
      description: 'Aid amount title',
    },
    titleApproved: {
      id: 'fa.application:section.status.aidAmount.titleApproved',
      defaultMessage: 'Veitt aðstoð',
      description: 'Aid amount title for approved applications',
    },
    description: {
      id: 'fa.application:section.status.aidAmount.description#markup',
      defaultMessage:
        'Athugaðu að þessi útreikningur er <b style="color: #FF0050">eingöngu til viðmiðunar og getur tekið breytingum</b>. Þú færð skilaboð þegar frekari útreikningur liggur fyrir. Umsóknin verður afgreidd eins fljótt og auðið er.',
      description: 'Aid amount description',
    },
  }),
  missingFilesCard: defineMessages({
    title: {
      id: 'fa.application:section.status.missingFilesCard.title',
      defaultMessage: 'Vantar gögn',
      description: 'Title of the card',
    },
    description: {
      id: 'fa.application:section.status.missingFilesCard.description',
      defaultMessage:
        'Við þurfum að fá gögn frá þér áður en við getum haldið áfram með umsóknina.',
      description: 'Description of the card',
    },
    action: {
      id: 'fa.application:section.status.missingFilesCard.action',
      defaultMessage: 'Hlaða upp gögnum',
      description: 'Action title of the card',
    },
  }),
  header: defineMessages({
    new: {
      id: 'fa.application:section.status.header.new',
      defaultMessage: 'Umsókn móttekin',
      description: 'New text',
    },
    inProgress: {
      id: 'fa.application:section.status.header.inProgress#markup',
      defaultMessage: 'Umsókn í vinnslu til útgreiðslu í {month} {year}',
      description: 'In progress text',
    },
    approved: {
      id: 'fa.application:section.status.header.approved',
      defaultMessage: 'Umsókn samþykkt',
      description: 'Approved text',
    },
    rejected: {
      id: 'fa.application:section.status.header.rejected',
      defaultMessage: 'Umsókn synjað',
      description: 'Rejected text',
    },
  }),
  rejectionMessage: defineMessages({
    explanation: {
      id: 'fa.application:section.status.rejectionMessage.explanation#markup',
      defaultMessage:
        'Umsókn þinni um fjárhagsaðstoð í ágúst hefur verið synjað {rejectionComment}.',
      description: 'Explanation of rejection',
    },
    explanationLink: {
      id: 'fa.application:section.status.rejectionMessage.explanationLink',
      defaultMessage:
        'Smelltu á hlekkinn hér fyrir neðan til að kynna þér reglur um fjárhagsaðstoð.',
      description: 'Text to direct to the rules link',
    },
    rulesPageLink: {
      id: 'fa.application:section.status.rejectionMessage.rulesPageLink',
      defaultMessage: 'Sjá reglur um fjárhagsaðstoð',
      description: 'Text on link to rules page',
    },
    appealTitle: {
      id: 'fa.application:section.status.rejectionMessage.appealTitle',
      defaultMessage: 'Málskot',
      description: 'Appeal title',
    },
    appealDescription: {
      id: 'fa.application:section.status.rejectionMessage.appealDescription#markup',
      defaultMessage: 'Bent skal á að unnt er að skjóta ákvörðun þessari til áfrýjunarnefndar þíns sveitarfélags. Skal það gert skriflega og innan fjögurra vikna. Fyrir frekari upplýsingar um málskot hafðu samband með tölvupósti á netfangið [{email}]({email}). \n\n Ákvörðun ráðsins má síðan skjóta til úrskurðarnefndar velferðarmála, Katrínartúni 2, 105 Reykjavík innan þriggja mánaða.',
      description: 'Appeal title',
    },
  }),
}
