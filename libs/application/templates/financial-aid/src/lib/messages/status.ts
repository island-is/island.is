import { defineMessages } from 'react-intl'

export const status = defineMessages({
  sectionTitle: {
    id: 'fa.application:section.status.sectionTitle',
    defaultMessage: 'Staða umsóknar fyrir fjárhagsaðstoð',
    description: 'Status section title',
  },
  pageTitle: {
    id: 'fa.application:section.status.pageTitle',
    defaultMessage: 'Aðstoðin þín',
    description: 'Status page title',
  },
  spousePageTitle: {
    id: 'fa.application:section.status.spousePageTitle',
    defaultMessage: 'Aðstoð maka þíns',
    description: 'Status page title',
  },
})

export const moreActions = defineMessages({
  title: {
    id: 'fa.application:section.moreActions.title',
    defaultMessage: 'Frekari aðgerðir í boði',
    description: 'More action title',
  },
  rulesLink: {
    id: 'fa.application:section.moreActions.rulesLink#markdown',
    defaultMessage: '[Reglur um fjárhagsaðstoð]({rulesPage})',
    description: 'More action link to rules',
  },
  emailLink: {
    id: 'fa.application:section.moreActions.emailLink#markdown',
    defaultMessage: '[Hafa samband]({email})',
    description: 'More action link to email',
  },
})

export const timeline = defineMessages({
  title: {
    id: 'fa.application:section.timeline.title',
    defaultMessage: 'Umsóknarferlið',
    description: 'Timeline title',
  },
  description: {
    id: 'fa.application:section.timeline.description',
    defaultMessage:
      'Hér geturðu séð hvað hefur gerst og hvað er framundan. Hikaðu ekki við að senda okkur athugasemd ef þú telur eitthvað óljóst eða rangt.',
    description: 'Timeline description',
  },
  receivedTitle: {
    id: 'fa.application:section.timeline.receivedTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Timeline received step title',
  },
  receivedDescription: {
    id: 'fa.application:section.timeline.receivedDescription',
    defaultMessage:
      'Umsóknin verður tekin til úrvinnslu eins fljótt og kostur er.',
    description: 'Timeline received step description',
  },
  spouseTitle: {
    id: 'fa.application:section.timeline.spouseTitle',
    defaultMessage: 'Bið eftir gögnum frá maka',
    description: 'Waiting spouse step title',
  },
  spouseDescription: {
    id: 'fa.application:section.timeline.spouseDescription',
    defaultMessage:
      'Umsóknin verður tekin til úrvinnslu þegar maki skilar inn gögnum.',
    description: 'Waiting spouse step description',
  },
  inProgressTitle: {
    id: 'fa.application:section.timeline.inProgressTitle',
    defaultMessage: 'Umsókn í vinnslu',
    description: 'Timeline in progress step title',
  },
  inProgressDescription: {
    id: 'fa.application:section.timeline.inProgressDescription',
    defaultMessage:
      'Úrvinnsla umsóknarinnar er hafin. Ef þörf er á frekari upplýsingum eða gögnum mun vinnsluaðili óska eftir því hér á þessari stöðusíðu.',
    description: 'Timeline in progress step description',
  },
  resultsTitle: {
    id: 'fa.application:section.timeline.resultsTitle',
    defaultMessage: 'Niðurstaða',
    description: 'Timeline results step title',
  },
  resultsDescription: {
    id: 'fa.application:section.timeline.resultsDescription',
    defaultMessage:
      'Umsókn verður samþykkt eða henni hafnað og umsækjandi látinn vita um niðurstöðuna.',
    description: 'Timeline results step description',
  },
})

export const aidAmount = defineMessages({
  title: {
    id: 'fa.application:section.aidAmount.title',
    defaultMessage: 'Áætluð aðstoð',
    description: 'Aid amount title',
  },
  titleApproved: {
    id: 'fa.application:section.aidAmount.titleApproved',
    defaultMessage: 'Veitt aðstoð',
    description: 'Aid amount title for approved applications',
  },
  description: {
    id: 'fa.application:section.aidAmount.description#markdown',
    defaultMessage:
      'Athugaðu að þessi útreikningur er <b style="color: #FF0050">eingöngu til viðmiðunar og getur tekið breytingum</b>. Þú færð skilaboð þegar frekari útreikningur liggur fyrir. Umsóknin verður afgreidd eins fljótt og auðið er.',
    description: 'Aid amount description',
  },
})

export const missingFilesCard = defineMessages({
  title: {
    id: 'fa.application:section.missingFilesCard.title',
    defaultMessage: 'Vantar gögn',
    description: 'Title of the card',
  },
  description: {
    id: 'fa.application:section.missingFilesCard.description',
    defaultMessage:
      'Við þurfum að fá gögn frá þér áður en við getum haldið áfram með umsóknina.',
    description: 'Description of the card',
  },
  action: {
    id: 'fa.application:section.missingFilesCard.action',
    defaultMessage: 'Hlaða upp gögnum',
    description: 'Action title of the card',
  },
})

export const header = defineMessages({
  new: {
    id: 'fa.application:section.header.new',
    defaultMessage: 'Umsókn móttekin',
    description: 'New text',
  },
  inProgress: {
    id: 'fa.application:section.header.inProgress#markdown',
    defaultMessage: 'Umsókn í vinnslu til útgreiðslu í {month} {year}',
    description: 'In progress text',
  },
  approved: {
    id: 'fa.application:section.header.approved',
    defaultMessage: 'Umsókn samþykkt',
    description: 'Approved text',
  },
  rejected: {
    id: 'fa.application:section.header.rejected',
    defaultMessage: 'Umsókn synjað',
    description: 'Rejected text',
  },
})

export const rejectionMessage = defineMessages({
  explanation: {
    id: 'fa.application:section.rejectionMessage.explanation#markdown',
    defaultMessage:
      'Umsókn þinni um fjárhagsaðstoð í ágúst hefur verið synjað {rejectionComment}.',
    description: 'Explanation of rejection',
  },
  explanationLink: {
    id: 'fa.application:section.rejectionMessage.explanationLink',
    defaultMessage:
      'Smelltu á hlekkinn hér fyrir neðan til að kynna þér reglur um fjárhagsaðstoð.',
    description: 'Text to direct to the rules link',
  },
  rulesPageLink: {
    id: 'fa.application:section.rejectionMessage.rulesPageLink',
    defaultMessage: 'Sjá reglur um fjárhagsaðstoð',
    description: 'Text on link to rules page',
  },
  appealTitle: {
    id: 'fa.application:section.rejectionMessage.appealTitle',
    defaultMessage: 'Málskot',
    description: 'Appeal title',
  },
  appealDescription: {
    id: 'fa.application:section.rejectionMessage.appealDescription#markdown',
    defaultMessage:
      'Bent skal á að unnt er að skjóta ákvörðun þessari til áfrýjunarnefndar þíns sveitarfélags. Skal það gert skriflega og innan fjögurra vikna. Fyrir frekari upplýsingar um málskot hafðu samband með tölvupósti á netfangið [{email}]({email}). \n\n Ákvörðun ráðsins má síðan skjóta til úrskurðarnefndar velferðarmála, Katrínartúni 2, 105 Reykjavík innan þriggja mánaða.',
    description: 'Appeal title',
  },
})

export const spouseAlert = defineMessages({
  title: {
    id: 'fa.application:section.spouseAlert.title',
    defaultMessage: 'Gögn maka vantar',
    description: 'Title of alert',
  },
  message: {
    id: 'fa.application:section.spouseAlert.message',
    defaultMessage:
      'Umsóknin verður tekin til úrvinnslu þegar maki skilar inn gögnum. Maki hefur fengið tölvupóst þess efnis.',
    description: 'Message of alert',
  },
  messageCopyUrl: {
    id: 'fa.application:section.spouseAlert.messageCopyUrl',
    defaultMessage:
      'Umsóknin verður tekin til úrvinnslu þegar maki hefur fylgt hlekknum hér að neðan til að skila inn gögnum',
    description:
      'Message of alert to tell the spouse to follow the upload link',
  },
})

export const spouseApproved = defineMessages({
  message: {
    id: 'fa.application:section.spouseApproved.message#markdown',
    defaultMessage:
      'Umsóknin maka þíns um fjárhagsaðstoð í {month} er samþykkt. Maki þinn fær frekari upplýsingar um veitta aðstoð.',
    description: 'Message for spouse when application is apporoved',
  },
})

export const approvedAlert = defineMessages({
  title: {
    id: 'fa.application:section.acceptedAlert.title',
    defaultMessage: 'Skýring frá vinnsluaðila',
    description: 'Title of accepted alert box',
  },
})
