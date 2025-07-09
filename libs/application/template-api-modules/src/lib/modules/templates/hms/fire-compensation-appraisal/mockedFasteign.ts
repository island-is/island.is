import { Fasteign } from '@island.is/clients/assets'

const getMockedNotkunareining = (
  fasteignanumer: string,
  notkunBirting: string,
  brunabotamat: number,
  notkunareininganumer: string,
) => {
  return {
    birtStaerdMaelieining: 'm²',
    notkunareininganumer,
    fasteignanumer,
    stadfang: {
      birtingStutt: 'RVK',
      birting: 'Reykjavík',
      landeignarnumer: 1234,
      sveitarfelagBirting: 'Reykjavík',
      postnumer: 113,
      stadfanganumer: 1234,
    },
    merking: 'SomeValue',
    notkunBirting,
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
  }
}

type NotkunarValues = {
  notkunBirting: string
  brunabotamat: number
  notkunareininganumer: string
}

export const getMockedFasteign = (
  birting: string,
  fasteignanumer: string,
  notkunareiningar: Array<NotkunarValues>,
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
        ...notkunareiningar.map((notkun) =>
          getMockedNotkunareining(
            fasteignanumer,
            notkun.notkunBirting,
            notkun.brunabotamat,
            notkun.notkunareininganumer,
          ),
        ),
      ],
    },
  }
}

export const mockGetProperties = (): Array<Fasteign> => {
  return [
    getMockedFasteign('Vesturhóp 34, 240 Grindavík', '2240134', [
      {
        notkunBirting: 'Íbúð á hæð',
        brunabotamat: 100000000,
        notkunareininganumer: '010101',
      },
    ]),
    getMockedFasteign('Mosarimi 2, 112 Reykjavík', '2213525', [
      {
        notkunBirting: 'Íbúðarhúsalóð',
        brunabotamat: 70000000,
        notkunareininganumer: '010102',
      },
      {
        notkunBirting: 'Íbúð í kjallara',
        brunabotamat: 91204000,
        notkunareininganumer: '010103',
      },
    ]),
    getMockedFasteign('Dúfnahólar 10, 105 Reykjavík', '2038399', [
      {
        notkunBirting: 'Íbúðarhúsalóð',
        brunabotamat: 50000000,
        notkunareininganumer: '010104',
      },
      {
        notkunBirting: 'Fjós',
        brunabotamat: 7300000,
        notkunareininganumer: '010105',
      },
      {
        notkunBirting: 'Skemma',
        brunabotamat: 8600000,
        notkunareininganumer: '010106',
      },
    ]),
  ]
}
