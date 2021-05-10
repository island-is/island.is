import { useEffect, useState } from 'react'

// const sections = [
//   {
//     name: 'Gagnaöflun',
//     id: 'approve',
//     route: '/umsokn',
//   },
//   {
//     name: 'Persónuhagir',
//     children: [
//       {
//         name: 'Heimili',
//         id: 'address',
//         route: '/umsokn/heimili',
//       },
//       {
//         name: 'Búseta',
//         id: 'homeCircumstances',
//         route: '/umsokn/buseta',
//       },
//       {
//         name: 'Nám',
//         id: 'education',
//         route: '/umsokn/nam',
//       },
//       {
//         name: 'Staða',
//         id: 'employment',
//         route: '/umsokn/stada',
//       },
//     ],
//   },
// ]

// interface Parameters {
//   currentId?: string
// }

// const useFormNavigation = ({ currentId }: Parameters) => {
// sections.some((item, i) => {
//   let index = i + 1
//   if (item.id === currentId) {
//     console.log('h')
//     return {
//       activeSectionNumber: index,
//       nextUrl: sections[index].route
//         ? sections[index].route
//         : sections[index]?.children[0]?.route,
//     }
//   }
//   if (item.children) {
//     item.children.map((el, nr) => {
//       if (el.id === currentId) {
//         return {
//           activeSectionNumber: index,
//           activeSubSection: nr,
//         }
//       }
//       // console.log(el)
//     })
//     console.log('helo')
//   }
// })
// console.log(currentId)
// const [current, setCurrent] = useState(
//   sections.findIndex((item) => item.id === currentId),
// )
// if (current === 0) {
//   return {
//     activeSectionNumber: current,
//     nextUrl: sections[current + 1].route,
//   }
// } else if (current) {
//   return {
//     activeSectionNumber: current,
//     prevUrl: sections[current - 1]?.route,
//     nextUrl: sections[current + 1]?.route,
//   }
// }
// }

// export default useFormNavigation

const sections = [
  {
    name: 'Gagnaöflun',
    id: 'approve',
    route: '/umsokn',
  },
  {
    name: 'Heimili',
    route: '/umsokn/heimili',
    id: 'address',
  },
  {
    name: 'Búseta',
    route: '/umsokn/buseta',
    id: 'homeCircumstances',
  },
  {
    name: 'Staða',
    route: '/umsokn/stada',
    id: 'employment',
  },
  {
    name: 'Tekjur',
    route: '/umsokn/tekjur',
    id: 'income',
  },
  {
    name: 'Persónuafsláttur',
    route: '/umsokn/personuafslattur',
    id: 'personalTaxAllowance',
  },
  {
    name: 'Bankaupplýsingar',
    route: '/umsokn/bankaupplysingar',
    id: 'bankInfo',
  },
  {
    name: 'Útreikningur',
    route: '/umsokn/utreikningur',
    id: 'summary',
  },
  {
    name: 'Staðfesting',
    id: 'confirm',
    route: '/umsokn',
  },
]

interface Parameters {
  currentId?: string
}

const useFormNavigation = ({ currentId }: Parameters) => {
  const [current, setCurrent] = useState(
    sections.findIndex((item) => item.id === currentId),
  )

  if (current === 0) {
    return {
      activeSectionNumber: current,
      nextUrl: sections[current].route,
    }
  } else {
    return {
      activeSectionNumber: current,
      prevUrl: sections[current - 1]?.route,
      nextUrl: sections[current + 1]?.route,
    }
  }
}

export default useFormNavigation
