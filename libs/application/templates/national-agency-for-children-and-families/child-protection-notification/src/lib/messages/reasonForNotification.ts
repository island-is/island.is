import { defineMessages } from 'react-intl'

export const reasonForNotificationMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:reasonForNotification.shared.sectionTitle',
      defaultMessage: 'Ástæða tilkynningar',
      description: 'Reason for notification',
    },
    selectPlaceholder: {
      id: 'cpn.application:reasonForNotification.shared.selectPlaceholder',
      defaultMessage: 'Merktu við það sem veldur þér mestum áhyggjum',
      description: 'Placeholder',
    },
  }),
  description: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:reasonForNotification.description.subSectionTitle',
      defaultMessage: 'Lýsing',
      description: 'Description',
    },
    title: {
      id: 'cpn.application:reasonForNotification.description.title',
      defaultMessage: 'Lýsing á atviki eða aðstæðum',
      description: 'Description of the incident or circumstances',
    },
    description: {
      id: 'cpn.application:reasonForNotification.description.description',
      defaultMessage:
        'Lýstu atvikinu eða aðstæðum sem tilkynntar eru með nákvæmum og hnitmiðuðum hætti. Reyndu að gera greinarmun á því sem þjónustuveitandi hefur upplýsingar um, þess sem er frásögn annars aðila og frásögn frá barninu sjálfu.',
      description: 'Description of the incident or circumstances',
    },
    descriptionUnborn: {
      id: 'cpn.application:reasonForNotification.description.descriptionUnborn',
      defaultMessage:
        'Lýstu aðstæðum eða áhættuhegðun verðandi foreldra með nákvæmum og hnitmiðuðum hætti. Í hverju þær felast og hversu lengi þær hafa varað. Eða í tilfelli atviks hvað þú sást, hvar og hvernig það átti sér stað, hverjir voru viðstaddir, og hvort sambærilegt atvik hafi átt sér stað áður.',
      description:
        'Description of the incident or circumstances for the unborn child flow',
    },
    placeholder: {
      id: 'cpn.application:reasonForNotification.description.placeholder',
      defaultMessage: 'Skrifaðu lýsingu hér',
      description: 'Placeholder for the description field',
    },
    additionalDataTitle: {
      id: 'cpn.application:reasonForNotification.description.additionalDataTitle',
      defaultMessage: 'Viðbótargögn',
      description: 'Additional data',
    },
    additionalDataCheckbox: {
      id: 'cpn.application:reasonForNotification.description.additionalDataCheckbox',
      defaultMessage:
        'Ef þú óskar eftir því að koma viðbótargögnum á framfæri við barnavernd hakaðu þá við hér. Barnavernd mun hafa samband til þess að nálgast þau gögn. Viðbótargögn get verið ljósmyndir, skjáskot af samskiptum, tölvupóstar eða annað sem varpað geta frekara ljósi á atvikið eða aðstæðurnar sem þú lýsir.',
      description: 'Additional data checkbox',
    },
  }),
  reason: defineMessages({
    description: {
      id: 'cpn.application:reasonForNotification.reason.description',
      defaultMessage:
        'Vinsamlegast tilgreinið ástæður þessarar tilkynningar. Það aðstoðar okkur við mat á aðstæðum og stuðlar að betri undirbúningi að ákvarðanatöku um mögulega íhlutun eða þjónustu sem mætir þörfum barns og fjölskyldu. \n\nÞú gerir það með því að opna flokkana hér fyrir neðan og haka við allt það sem lýsir þeim aðstæðum eða því atviki sem tilkynnt er. Í næsta skrefi biðjum við þig svo að gera betur grein fyrir þínu vali.',
      description: 'Reason description',
    },
    unbornQuestion: {
      id: 'cpn.application:reasonForNotification.reason.unbornQuestion',
      defaultMessage: 'Hverskonar athæfi hefurðu áhyggjur af?',
      description: 'What kind of behavior are you concerned about?',
    },
    biggestConcern: {
      id: 'cpn.application:reasonForNotification.reason.biggestConcern',
      defaultMessage: 'Mestar áhyggjur',
      description: 'Biggest concern',
    },
    biggestConcernDescription: {
      id: 'cpn.application:reasonForNotification.reason.biggestConcernDescription',
      defaultMessage:
        'Þú hefur merkt við fleiri en eina ástæðu tilkynningar. Hjálpaðu okkur að skilja hver meginástæðan er og hverjar hliðarástæðurnar eru. Meginástæðan er alvarlegasti eða mest knýjandi þátturinn í tilkynningunni að þínu mati. Hliðarástæður eru aðrir samhangandi þættir sem dýpka skilninginn á því sem er tilkynnt. \n\nVinsamlegast merktu við hver meginástæða tilkynningarinnar er, en með því skiljum við betur upphaflegu kveikjuna að tilkynningunni og kjarna vandans.',
      description: 'Description for biggest concern',
    },
    concerns: {
      id: 'cpn.application:reasonForNotification.reason.concerns',
      defaultMessage: 'Áhyggjur',
      description: 'Concerns',
    },
  }),
  notificationHistory: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:reasonForNotification.notificationHistory.subSectionTitle',
      defaultMessage: 'Tilkynningasaga',
      description: 'Notification history',
    },
    hasReportedBefore: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasReportedBefore',
      defaultMessage: 'Hefur þjónustuveitandi áður tilkynnt sama barn?',
      description:
        'Have you reported the same concerns to child protection before?',
    },
    hasReportedBeforeExpectantParents: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasReportedBeforeExpectantParents',
      defaultMessage:
        'Hefur þjónustuveitandi áður tilkynnt verðandi foreldra til barnaverndar?',
      description:
        'Have you reported the expectant parents to child protection before?',
    },
    hasDiscussedWithCustodians: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasDiscussedWithCustodians',
      defaultMessage:
        'Hefur þjónustuveitandi rætt áhyggjur um barnið við umsjáraðila þess?',
      description:
        'Have you discussed your current concerns with the custodians of the child?',
    },
    hasDiscussedWithGuardians: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasDiscussedWithGuardians',
      defaultMessage:
        'Hefur þjónustuveitandi rætt áhyggjur um barnið við forsjáraðila þess?',
      description:
        'Have you discussed your current concerns with the guardians of the child?',
    },
    hasDiscussedWithExpectantParents: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasDiscussedWithExpectantParents',
      defaultMessage:
        'Hefur þjónustuveitandi rætt núverandi áhyggjur við verðandi foreldra barnsins?',
      description:
        'Have you discussed your current concerns with the expectant parents of the child?',
    },
    areCustodiansInformed: {
      id: 'cpn.application:reasonForNotification.notificationHistory.areCustodiansInformed',
      defaultMessage:
        'Hefur þjónustuveitandi upplýst umsjáraðila um að tilkynning verði send til barnaverndar?',
      description:
        'Are the custodians informed that a report will be sent to child protection?',
    },
    areGuardiansInformed: {
      id: 'cpn.application:reasonForNotification.notificationHistory.areGuardiansInformed',
      defaultMessage:
        'Hefur þjónustuveitandi upplýst forsjáraðila um að tilkynning verði send til barnaverndar?',
      description:
        'Are the guardians informed that a report will be sent to child protection?',
    },
    areExpectantParentsInformed: {
      id: 'cpn.application:reasonForNotification.notificationHistory.areExpectantParentsInformed',
      defaultMessage:
        'Eru verðandi foreldrar upplýstir um að tilkynning verði send til barnaverndar?',
      description:
        'Are the expectant parents informed that a report will be sent to child protection?',
    },
    explanation: {
      id: 'cpn.application:reasonForNotification.notificationHistory.explanation',
      defaultMessage: 'Ástæða',
      description: 'Reason label for why the guardian is not informed',
    },
    abuseSuspicionWarning: {
      id: 'cpn.application:reasonForNotification.notificationHistory.abuseSuspicionWarning',
      // TODO: Placeholder text, replace once the correct wording is provided.
      defaultMessage: 'Ekki skal upplýsa foreldri',
      description:
        'Warning shown when guardian not aware reason is abuse suspicion',
    },
  }),
}
