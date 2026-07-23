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
        'Segðu okkur hvað þú sást, hvenær og hvar atvikið eða aðstæðurnar áttu sér stað og hverjir voru viðstaddir. Ekki hika við að segja okkur frá hverju því öðru sem þér þykir mikilvægt að komi fram í þessu samhengi.',
      description: 'Description of the incident or circumstances',
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
        'Ef þú óskar eftir því að koma viðbótargögnum á framfæri við barnavernd hakaðu þá við hér. Viðbótargögn geta verið ljósmyndir, einstaklingsáætlanir, skýrslur, eða annað sem varpað getur frekara ljósi á á atvikið eða aðstæðurnar sem þú lýsir.',
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
      defaultMessage:
        'Hefurðu tilkynnt áður um sömu áhyggjur til barnaverndar?',
      description:
        'Have you reported the same concerns to child protection before?',
    },
    hasDiscussedWithCustodians: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasDiscussedWithCustodians',
      defaultMessage:
        'Hefurðu rætt núverandi áhyggjur þínar við umsjónaraðila barnsins?',
      description:
        'Have you discussed your current concerns with the custodians of the child?',
    },
    hasDiscussedWithGuardians: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasDiscussedWithGuardians',
      defaultMessage:
        'Hefurðu rætt núverandi áhyggjur þínar við forsjáraðila barnsins?',
      description:
        'Have you discussed your current concerns with the guardians of the child?',
    },
    hasDiscussedWithExpectantParents: {
      id: 'cpn.application:reasonForNotification.notificationHistory.hasDiscussedWithExpectantParents',
      defaultMessage:
        'Hefurðu rætt núverandi áhyggjur þínar við verðandi foreldra barnsins?',
      description:
        'Have you discussed your current concerns with the expectant parents of the child?',
    },
    areCustodiansInformed: {
      id: 'cpn.application:reasonForNotification.notificationHistory.areCustodiansInformed',
      defaultMessage:
        'Eru umsjónaraðilar upplýstir um að tilkynning verði send til barnaverndar?',
      description:
        'Are the custodians informed that a report will be sent to child protection?',
    },
    areGuardiansInformed: {
      id: 'cpn.application:reasonForNotification.notificationHistory.areGuardiansInformed',
      defaultMessage:
        'Eru forsjáraðilar upplýstir um að tilkynning verði send til barnaverndar?',
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
  }),
}
