import { createStore } from '@island.is/shared/mocking'
import { fasteign } from './factories'

export const store = createStore(() => {
  const fasteignir = fasteign.list(5)
  const getFasteignir = {
    fasteignir: fasteignir,
    paging: {
      page: 2,
      pageSize: 5,
      total: 20,
      totalPages: 4,
      offset: 10,
      hasPreviousPage: true,
      hasNextPage: false,
    },
  }

  const detailRealEstateAssets = fasteignir.map((eign) => ({
    ...eign,
    fasteignamat: {
      gildandi: 1000000,
      gildandiAr: 2021,
      fyrirhugad: 2000000, // Optional
      fyrirhugadAr: 2022, // Optional
    },
    thinglystirEigendur: [
      {
        nafn: 'Nafn 1',
        kennitala: '1111111100',
        eignarhlutfall: 0.55,
        kaupdagur: '2021-06-25T15:36:48+00:00',
        heimild: 'xyz',
        display: '55.00%',
      },
      {
        nafn: 'Nafn 2',
        kennitala: '1111111100',
        eignarhlutfall: 0.45,
        kaupdagur: '2021-06-25T15:36:48+00:00',
        heimild: 'xyz',
        display: '45.00%',
      },
    ],
    notkunareiningar: {
      data: [
        {
          notkunareininganr: 'N8',
          fasteignanr: 'F0001',
          stadfang: {
            stadfanganr: 's001',
            sveitarfelag: 'Reykjavík',
            postnr: '101',
            stadvisir: 'Götuheiti',
            stadgreinir: '100',
            landeignarnr: 'L1234',
            display: 'Götuheiti 100, Reykjavík',
            displayShort: 'Götuheiti 100',
          },
          merking: 'Íbúð 8',
          notkun: 'Notkun 8',
          starfsemi: 'Starfsemi 8',
          lysing: 'Lysing 8',
          byggingarAr: 2008,
          birtStaerd: 100.5,
          fasteignamat: {
            gildandi: 1000000,
            gildandiAr: '2021',
            fyrirhugad: 2000000,
            fyrirhugadAr: '2022',
          },
          lodarmat: 1000000,
          brunabotamat: 1000000,
        },
      ],
      paging: {
        page: 2,
        pageSize: 5,
        total: 20,
        totalPages: 4,
        offset: 10,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    },
  }))

  return {
    getFasteignir,
    detailRealEstateAssets,
  }
})
