import { useEffect, useState } from 'react'

// TODO: Only show /umsokn/gogn if form.income is true

const useNavigationTree = () => {
  const section = [
    {
      name: 'Gagnaöflun',
      url: '/umsokn',
    },
    {
      name: 'Upplýsingar',
      url: '/umsokn/rettur',
    },
    {
      name: 'Persónuhagir',
      children: [
        { type: 'SUB_SECTION', name: 'Búseta', url: '/umsokn/buseta' },
        { type: 'SUB_SECTION', name: 'Nám', url: '/umsokn/nam' },
        { type: 'SUB_SECTION', name: 'Atvinna', url: '/umsokn/atvinna' },
      ],
    },
    {
      name: 'Fjármál',
      children: [
        { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
        { type: 'SUB_SECTION', name: 'Gögn', url: '/umsokn/gogn' },
        {
          type: 'SUB_SECTION',
          name: 'Skattframtal',
          url: '/umsokn/skattframtal',
        },
        {
          type: 'SUB_SECTION',
          name: 'Persónuafsláttur',
          url: '/umsokn/personuafslattur',
        },
        {
          type: 'SUB_SECTION',
          name: 'Bankaupplýsingar',
          url: '/umsokn/bankaupplysingar',
        },
      ],
    },
    {
      name: 'Samskipti',
      url: '/umsokn/samskipti',
    },
    {
      name: 'Útreikningur',
      url: '/umsokn/utreikningur',
    },
    {
      name: 'Staðfesting',
      url: '/umsokn/stadfesting',
    },
  ]

  return section
}

export default useNavigationTree
