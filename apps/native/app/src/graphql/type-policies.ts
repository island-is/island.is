import { LicenseType } from "../types/license-type";

const allDocuments = [
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

const allLicenses = [
  { id: '1', serviceProvider: 'Þjóðskrá Íslands', title: 'Nafnskírteini', type: LicenseType.IDENTIDY_CARD },
  { id: '2', serviceProvider: 'Ríkislögreglustjóri', title: 'Ökuskírteini', type: LicenseType.DRIVERS_LICENSE },
  { id: '3', serviceProvider: 'Þjóðskrá Íslands', title: 'Vegabréf', type: LicenseType.PASSPORT },
  { id: '4', serviceProvider: 'Ríkislögreglustjóri', title: 'Skotvopnaleyfi', type: LicenseType.WEAPON_LICENSE },
  { id: '5', serviceProvider: 'Ríkissaksóknari', title: 'Sakavottorð', type: LicenseType.CRIMINAL_RECORD_CERTIFICATE },
  { id: '6', serviceProvider: 'Umhverfisstofnun', title: 'Veiðikort', type: LicenseType.FISHING_CARD },
  { id: '7', serviceProvider: 'Vinnueftirlitið', title: 'Vinnuvélaskírteini', type: LicenseType.MACHINE_CERTIFICATE },
  { id: '8', serviceProvider: 'Vinnueftirlitið', title: 'ADR skírteini', type: LicenseType.ADR_LICENSE },
  { id: '9', serviceProvider: 'Landlæknisembættið', title: 'Bólusetningaskíreini', type: LicenseType.VACCINE_CERTIFICATE }
]

export const typePolicies = {
  Query: {
    fields: {
      listDocuments: {
        read() {
          return allDocuments;
        }
      },
      listLicenses: {
        read() {
          return allLicenses;
        }
      },
      License: {
        read(_noop: unknown, { args: { id } }: any) {
          return allLicenses.find(l => l.id === id);
        }
      }
    },
  }
}
