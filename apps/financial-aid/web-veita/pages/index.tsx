import ApplicationOverview from '../src/routes/ApplicationOverview/applicationOverview'

export default ApplicationOverview

// import React, { useContext, useEffect } from 'react'
// import { useQuery } from '@apollo/client'
// import { GetApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'
// import { Application } from '@island.is/financial-aid/shared'
// import { Logo, Text, Box, Button } from '@island.is/island-ui/core'
// import {
//   AdminLayout,
//   ApplicationTable,
//   GeneratedProfile,
//   GenerateName,
// } from '../src/components'

// interface ApplicationData {
//   applications: Application[]
// }

// const Index = () => {
//   const { data, error, loading } = useQuery<ApplicationData>(
//     GetApplicationQuery,
//     {
//       fetchPolicy: 'no-cache',
//       errorPolicy: 'all',
//     },
//   )

//   const applicationHeaders = ['Nafn', 'Staða', 'Tími án umsjár', 'Umsjá']

//   return (
//     <div className="">
//       <AdminLayout>
//         <Text as="h1" variant="h1" marginBottom={[4, 4, 6]}>
//           Vantar úrvinnslu
//         </Text>
//         {data?.applications && (
//           <ApplicationTable
//             header={applicationHeaders}
//             applications={data.applications.map((a) => [
//               <Box display="flex" alignItems="center">
//                 <GeneratedProfile size={32} />
//                 {/* <Text variant="h5">{GenerateName(a.nationalId)}</Text> */}
//                 <Text variant="h5">{a.name}</Text>
//               </Box>,
//               <Text>Ný umsókn</Text>,
//               <Text>2klst</Text>,
//               <Button
//                 colorScheme="default"
//                 iconType="filled"
//                 onClick={function noRefCheck() {}}
//                 preTextIconType="filled"
//                 size="default"
//                 type="button"
//                 variant="ghost"
//               >
//                 Sjá um
//               </Button>,
//             ])}
//           />
//         )}
//       </AdminLayout>
//     </div>
//   )
// }

// export default Index
