import { defineMessages } from 'react-intl'

export const complaintInformation = defineMessages({
  title: {
    id: 'ctao.application:section.complaintInformation.pageTitle',
    defaultMessage: 'Upplýsingar um kvörtunarefnið',
    description: 'Information about the complaint',
  },
  decisionLabel: {
    id: 'ctao.application:section.complaintInformation.decision',
    defaultMessage: 'Kvörtunin varðar ákvörðun eða útskurð stjórnvalds',
    description: 'Label for court decision radio',
  },
  proceedingsLabel: {
    id: 'ctao.application:section.complaintInformation.proceedings',
    defaultMessage: 'Kvörtunin varðar málsmeðferð eða aðra athöfn stjórnvalds',
    description: 'Label for proceedings radio',
  },
  decisionAlertMessage: {
    id: 'ctao.application:section.complaintInformation.decision.alertMessage',
    defaultMessage: `Ef kvörtunin varðar ákvörðun eða úrskurð stjórnvalds skalt þú haka við þennan reit og skrifa 
    viðeigandi dagsetningu á næstu síðu. Eitt af skilyrðunum fyrir því að umboðsmaður Alþingis 
    geti tekið kvörtun til meðferðar er að hún sé borin fram innan árs frá niðurstöðu stjórnvalds í 
    máli.`,
    description:
      'The message that appears in the alert when decision is selected',
  },
  proceedingsAlertMessage: {
    id: 'ctao.application:section.complaintInformation.proceedings.alertMessage',
    defaultMessage: `Ef þú vilt kvarta yfir einhverju öðru í samskiptum þínum við stjórnvöld skalt þú haka við þennan reit,
      t.d. ef kvörtun varðar tafir á meðferð stjórnvalda á máli þínu, ef stjórnvöld svara ekki erindum þínum eða 
      ef þú ert ósátt/-ur við framkomu og/eða þjónustu sem þú hefur fengið hjá stjórnvaldi. `,
    description:
      'The message that appears in the alert when proceedings is selected',
  },
  alertMessageTitle: {
    id: 'ctao.application:section.complaintInformation.alertMessageTitle',
    defaultMessage: `Athugið`,
    description: 'The title of the alert message',
  },
  appealsHeader: {
    id: 'ctao.application:complaintInformation.appeals.header',
    defaultMessage: 'Hafa kæruleiðir verið nýttar',
    description: 'The header of the appeals section',
  },
  appealsSectionTitle: {
    id: 'ctao.application:complaintInformation.appeals.sectionTitle',
    defaultMessage: 'Kæruleiðir',
    description: 'The title of the appeals section',
  },
})
