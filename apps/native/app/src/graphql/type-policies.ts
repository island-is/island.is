export const typePolicies = {
  Query: {
    fields: {
      listDocuments: {
        read() {
          return [
            { id: '1', date: '2019-12-03T09:54:33Z', subject: 'Greiðsluseðill (Bifr.gjöld TSE12)', senderName: 'Skatturinn', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '2', date: '2019-12-04T09:54:33Z', subject: 'Greiðsluseðill', senderName: 'Fjársýsla ríkisins', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '3', date: '2019-12-05T09:54:33Z', subject: 'Álagningaseðill', senderName: 'Skatturinn', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '4', date: '2019-12-06T09:54:33Z', subject: 'Greiðsluseðill', senderName: 'Skatturinn', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '5', date: '2019-12-07T09:54:33Z', subject: 'Greiðsluseðill', senderName: 'Fjársýsla ríkisins', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '6', date: '2019-12-08T09:54:33Z', subject: 'Álagningaseðill', senderName: 'Skatturinn', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '7', date: '2019-12-09T09:54:33Z', subject: 'Greiðsluseðill', senderName: 'Fjársýsla ríkisins', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '8', date: '2019-12-10T09:54:33Z', subject: 'Álagningaseðill', senderName: 'Skatturinn', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
            { id: '9', date: '2019-12-11T09:54:33Z', subject: 'Greiðsluseðill', senderName: 'Skatturinn', senderNatReg: 'Icelandic', opened: false, fileType: 'pdf', url: '/demo.pdf' },
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
