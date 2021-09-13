import { createStore } from '@island.is/shared/mocking'

export const store = createStore(() => {
  const getFasteignir = {
    fasteignir: [
      {
        fasteignanr: 'F00011',
        sjalfgefidStadfang: {
          stadfanganr: 's001',
          sveitarfelag: 'Reykjavík',
          postnr: '101',
          stadvisir: 'Götuheiti',
          stadgreinir: '100',
          landeignarnr: 'L1234',
          display: 'Götuheiti 100, Reykjavík',
          displayShort: 'Götuheiti 100',
        },
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
  }

  return {
    getFasteignir,
  }
})
