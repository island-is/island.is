import { Fasteign } from '@island.is/clients/assets'

export const getMockedFasteign = (
  birting: string,
  fasteignanumer: string,
  brunabotamat: number,
): Fasteign => {
  return {
    fasteignanumer,
    sjalfgefidStadfang: {
      stadfanganumer: 1234,
      landeignarnumer: 567,
      postnumer: 113,
      sveitarfelagBirting: 'Reykjavík',
      birting,
      birtingStutt: 'Vesturhóp 34',
    },
    fasteignamat: {
      gildandiFasteignamat: 50000000,
      fyrirhugadFasteignamat: 55000000,
      gildandiMannvirkjamat: 30000000,
      fyrirhugadMannvirkjamat: 35000000,
      gildandiLodarhlutamat: 20000000,
      fyrirhugadLodarhlutamat: 25000000,
      gildandiAr: 2024,
      fyrirhugadAr: 2025,
    },
    landeign: {
      landeignarnumer: '123456',
      lodamat: 75000000,
      notkunBirting: 'Íbúðarhúsalóð',
      flatarmal: '300000',
      flatarmalEining: 'm²',
    },
    thinglystirEigendur: {
      thinglystirEigendur: [
        {
          nafn: 'Gervimaður Danmörk',
          kennitala: '0101302479',
          eignarhlutfall: 0.5,
          kaupdagur: new Date(),
          heimildBirting: 'Afsal',
        },
        {
          nafn: 'Gervimaður Færeyjar',
          kennitala: '0101302399',
          eignarhlutfall: 0.5,
          kaupdagur: new Date(),
          heimildBirting: 'Afsal',
        },
      ],
    },
    notkunareiningar: {
      notkunareiningar: [
        {
          birtStaerdMaelieining: 'm²',
          notkunareininganumer: '010101',
          fasteignanumer: 'F12345',
          stadfang: {
            birtingStutt: 'RVK',
            birting: 'Reykjavík',
            landeignarnumer: 1234,
            sveitarfelagBirting: 'Reykjavík',
            postnumer: 113,
            stadfanganumer: 1234,
          },
          merking: 'SomeValue',
          notkunBirting: 'SomeUsage',
          skyring: 'SomeDescription',
          byggingararBirting: 'SomeYear',
          birtStaerd: 100,
          fasteignamat: {
            gildandiFasteignamat: 50000000,
            fyrirhugadFasteignamat: 55000000,
            gildandiMannvirkjamat: 30000000,
            fyrirhugadMannvirkjamat: 35000000,
            gildandiLodarhlutamat: 20000000,
            fyrirhugadLodarhlutamat: 25000000,
            gildandiAr: 2024,
            fyrirhugadAr: 2025,
          },
          brunabotamat,
        },
      ],
    },
  }
}
