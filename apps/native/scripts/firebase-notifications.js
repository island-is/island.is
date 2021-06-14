const admin = require('firebase-admin')
const serviceAccount  = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

(async () => {

  const res = await admin.messaging().sendToDevice(
    'f4XghAZSRs6L-RNWRo9-Mw:APA91bFGgAc-0rhMgeHCDvkMJBH_nU4dApG6qqATliEbPs9xXf5n7EJ7FiAjJ6NNCHMBKdqHMdLrkaFHxuShzTwmZquyCjchuVMwAGmlwdXY8vZWnVqvMVItYn5lfIH-mR7Q9FvnNlhv', {
    notification: {
      title: 'Sjúkratryggingar Íslands',
      body: 'Nýtt skjal frá Sjúkratryggingum Íslands',
    },
    data: {
      copy: `Nú er hægt að nálgast öll skírteini frá Ríkislögreglustjóra í appinu, en þar má nefna ökuskírteini, siglingaleyfi og skotvopnaleyfi.
Ríkislögreglustjóri er fyrst stofnana til að tengjast Straumnum að fullu með því að tengja gagnagátt ökuskírteina. Eftir því sem fleiri stofnanir tengjast Straumnum eykst hagræðing og stafræn þjónusta batnar bæði milli stofnana sem og við almenning.
Um er að ræða tveggja ára ferli frá því innleiðing hófst formlega þar fyrsta stofnun tengdist að fullu enda mikil vinna að baki í uppbyggingu grunnkerfa. Stafrænt Ísland fer fyrir verkefninu fyrir hönd fjármálaráðuneytisins.`,
      documentId: '61450575-0dd7-4a55-a083-71461ec7386c'
    },
  })

//   const res = await admin.messaging().sendMulticast({
//     tokens: [
//       // 'dlZ1inVtAEG2vICLlFjxGb:APA91bETgXHpZPtdag2z6jr-9AyC8LckMw0SN3ZqBKeMzQ9i375wlspyqhPczBbtz4MAarX1qxUEe5fRuOTh_knjlDMHGNBKsxmxh8IBBLr-if_o69ZKGYgcgmKjRqrm7lOL50mH8N5e'
//       // 'f9KBkMdbb0DbtefMDZJc6a:APA91bHL0teQTLgUpozgp_nmwDJ_rJjcIPn1ydpWupKxwd5USfxzKtKDKNt_vvBLDPzQHqCLKPGHjjUyFMg7KqOtnRl9HNWbmfnzpSds_YDr75KFe9Pj2cuYZMqpDN1O54DAhGcA-kwS'
//          'd8q3J5dMSWi_acr5L116Cb:APA91bH050J8e7vfW-CseeUPVFwzaA_mk7Ory_HWMjaNiCK3JKwVz9DpPYChcr3h2YC1MmljOWU2HB1kqCmKZYyfFFrS8wHPnxzROV3UOkw7eSF4pyin6g6oc9xsebaM_9hNWXBu72la'
//     ],
//     notification: {
//       title: 'Sjúkratryggingar Íslands',
//       body: 'Nýtt skjal frá Sjúkratryggingum Íslands',
//     },
//     data: {
//       copy: `Nú er hægt að nálgast öll skírteini frá Ríkislögreglustjóra í appinu, en þar má nefna ökuskírteini, siglingaleyfi og skotvopnaleyfi.
// Ríkislögreglustjóri er fyrst stofnana til að tengjast Straumnum að fullu með því að tengja gagnagátt ökuskírteina. Eftir því sem fleiri stofnanir tengjast Straumnum eykst hagræðing og stafræn þjónusta batnar bæði milli stofnana sem og við almenning.
// Um er að ræða tveggja ára ferli frá því innleiðing hófst formlega þar fyrsta stofnun tengdist að fullu enda mikil vinna að baki í uppbyggingu grunnkerfa. Stafrænt Ísland fer fyrir verkefninu fyrir hönd fjármálaráðuneytisins.`,
//       documentId: '61450575-0dd7-4a55-a083-71461ec7386c'
//     },
//     // apns: {
//     //   payload: {
//     //     aps: {
//     //       category: 'NEW_DOCUMENT',
//     //     }
//     //   }
//     // }
//   });
//   const res = await admin.messaging().sendMulticast({
//     tokens: [
//       // 'dlZ1inVtAEG2vICLlFjxGb:APA91bETgXHpZPtdag2z6jr-9AyC8LckMw0SN3ZqBKeMzQ9i375wlspyqhPczBbtz4MAarX1qxUEe5fRuOTh_knjlDMHGNBKsxmxh8IBBLr-if_o69ZKGYgcgmKjRqrm7lOL50mH8N5e'
//       'f9KBkMdbb0DbtefMDZJc6a:APA91bHL0teQTLgUpozgp_nmwDJ_rJjcIPn1ydpWupKxwd5USfxzKtKDKNt_vvBLDPzQHqCLKPGHjjUyFMg7KqOtnRl9HNWbmfnzpSds_YDr75KFe9Pj2cuYZMqpDN1O54DAhGcA-kwS'
//     ],
//     notification: {
//       title: 'Stafrænt Ísland',
//       body: 'Nú getur þú sótt um Vegabréf á Ísland.is',
//     },
//     data: {
//       copy: `Nú er hægt að nálgast öll skírteini frá Ríkislögreglustjóra í appinu, en þar má nefna ökuskírteini, siglingaleyfi og skotvopnaleyfi.
// Ríkislögreglustjóri er fyrst stofnana til að tengjast Straumnum að fullu með því að tengja gagnagátt ökuskírteina. Eftir því sem fleiri stofnanir tengjast Straumnum eykst hagræðing og stafræn þjónusta batnar bæði milli stofnana sem og við almenning.
// Um er að ræða tveggja ára ferli frá því innleiðing hófst formlega þar fyrsta stofnun tengdist að fullu enda mikil vinna að baki í uppbyggingu grunnkerfa. Stafrænt Ísland fer fyrir verkefninu fyrir hönd fjármálaráðuneytisins.`,
//       islandIsUrl: 'https://island.is/minarsidur'
//     },
//     apns: {
//       payload: {
//         aps: {
//           category: 'ISLANDIS_LINK',
//         }
//       }
//     },
//   });
  console.log(res.results[0]);
})();
