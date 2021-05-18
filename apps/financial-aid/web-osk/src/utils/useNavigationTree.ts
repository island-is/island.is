import { useEffect, useState } from 'react'

const useNavigationTree = (hasIncome: boolean | number | undefined) => {
  const section = [
    {
      name: 'Gagnaöflun',
      url: '/umsokn',
    },
    {
      name: 'Persónuhagir',
      children: [
        { type: 'SUB_SECTION', name: 'Heimili', url: '/umsokn/heimili' },
        { type: 'SUB_SECTION', name: 'Búseta', url: '/umsokn/buseta' },
        { type: 'SUB_SECTION', name: 'Nám', url: '/umsokn/nam' },
        { type: 'SUB_SECTION', name: 'Atvinna', url: '/umsokn/atvinna' },
      ],
    },
    {
      name: 'Fjármál',
      children: hasIncome
        ? [
            { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
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
          ]
        : [
            { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
            { type: 'SUB_SECTION', name: 'Gögn', url: '/umsokn/gogn' },
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

// const sections = [
//   {
//     name: 'Gagnaöflun',
//     url: '/umsokn',
//   },
//   {
//     name: 'Persónuhagir',
//     children: [
//       { type: 'SUB_SECTION', name: 'Heimili', url: '/umsokn/heimili' },
//       { type: 'SUB_SECTION', name: 'Búseta', url: '/umsokn/buseta' },
//       { type: 'SUB_SECTION', name: 'Nám', url: '/umsokn/nam' },
//       { type: 'SUB_SECTION', name: 'Staða', url: '/umsokn/stada' },
//     ],
//   },
//   {
//     name: 'Fjármál',
//     children: [
//       { type: 'SUB_SECTION', name: 'Tekjur', url: '/umsokn/tekjur' },
//       {
//         type: 'SUB_SECTION',
//         name: 'Persónuafsláttur',
//         url: '/umsokn/personuafslattur',
//       },
//       {
//         type: 'SUB_SECTION',
//         name: 'Bankaupplýsingar',
//         url: '/umsokn/bankaupplysingar',
//       },
//     ],
//     // :
//     // [
//     //   { type: 'SUB_SECTION', name: 'Tekjur'},
//     //   { type: 'SUB_SECTION', name: 'Gögn'},
//     //   { type: 'SUB_SECTION', name: 'Persónuafsláttur'},
//     //   { type: 'SUB_SECTION', name: 'Bankaupplýsingar'},
//     // ]
//   },
//   {
//     name: 'Samskipti',
//     url: '/umsokn/samskipti',
//   },
//   {
//     name: 'Útreikningur',
//     url: '/umsokn/utreikningur',
//   },
//   {
//     name: 'Staðfesting',
//     url: '/stadfesting',
//   },
// ]

// interface Parameters {
//   currentUrl?: string
// }

// const useFormNavigation = ({ currentUrl }: Parameters) => {
//   // console.log(currentUrl, sections)
//   // const findUrl = (searchUrl: string) => {}
//   // // const currIndex = sections.findIndex((item) => item.url === currentUrl)
//   // const element = sections.map((item, index) => {
//   //   if (item.children) {
//   //     // console.log(item.children)
//   //   } else {
//   //     if (item.url === currentUrl) {
//   //     }
//   //   }
//   // })
//   // console.log(currIndex)
//   // const [current, setCurrent] = useState(
//   //   sections.findIndex((item) => item.route === currentRoute),
//   // )
//   // const current = sections.findIndex((item) => item.route === currentRoute)
//   // if (current === 0) {
//   //   return {
//   //     activeSectionNumber: current,
//   //     nextUrl: sections[current].route,
//   //   }
//   // } else {
//   //   return {
//   //     activeSectionNumber: current,
//   //     prevUrl: sections[current - 1]?.route,
//   //     nextUrl: sections[current + 1]?.route,
//   //   }
//   // }
// }

// export default useFormNavigation

// const useSections = ({ hasIncome }: Parameters) => {

//   // console.log(currentUrl, sections)
//   // const findUrl = (searchUrl: string) => {}
//   // // const currIndex = sections.findIndex((item) => item.url === currentUrl)
//   // const element = sections.map((item, index) => {
//   //   if (item.children) {
//   //     // console.log(item.children)
//   //   } else {
//   //     if (item.url === currentUrl) {
//   //     }
//   //   }
//   // })
//   // console.log(currIndex)
//   // const [current, setCurrent] = useState(
//   //   sections.findIndex((item) => item.route === currentRoute),
//   // )
//   // const current = sections.findIndex((item) => item.route === currentRoute)
//   // if (current === 0) {
//   //   return {
//   //     activeSectionNumber: current,
//   //     nextUrl: sections[current].route,
//   //   }
//   // } else {
//   //   return {
//   //     activeSectionNumber: current,
//   //     prevUrl: sections[current - 1]?.route,
//   //     nextUrl: sections[current + 1]?.route,
//   //   }
//   // }
// }
