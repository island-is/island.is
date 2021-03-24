export const typePolicies = {
  Query: {
    fields: {
      listDocuments: {
        read() {
          return [
            { id: '1', title: 'Skatturinn', subtitle: 'Greiðsluseðill (Bifr.gjöld TSE12)' },
            { id: '2', title: 'Skatturinn', subtitle: 'Greiðsluseðill' },
            { id: '3', title: 'Fjárssýsla ríkisins', subtitle: 'Greiðsluáskorun' },
            { id: '4', title: 'Skatturinn', subtitle: 'Álagningaseðill' },
            { id: '5', title: 'Skatturinn', subtitle: 'Greiðsluseðill' },
            { id: '6', title: 'Fjárssýsla ríkisins', subtitle: 'Greiðsluáskorun' },
            { id: '7', title: 'Skatturinn', subtitle: 'Álagningaseðill' },
            { id: '8', title: 'Fjárssýsla ríkisins', subtitle: 'Greiðsluseðill' },
            { id: '9', title: 'Skatturinn', subtitle: 'Álagningaseðill' }
          ];
        }
      },
      listLicenses: {
        read() {
          return [
            { id: '1', title: 'Ríkislögreglustjóri', subtitle: 'Ökuskírteini' },
            { id: '2', title: 'Ríkislögreglustjóri', subtitle: 'Skotvopnaleyfi' },
            { id: '3', title: 'Rauði Krossinn ríkisins', subtitle: 'Fyrsta hjálp' },
            { id: '4', title: 'Ríkislögreglustjóri', subtitle: 'Siglingaréttindi' },
          ]
        }
      }
    },
  }
}
