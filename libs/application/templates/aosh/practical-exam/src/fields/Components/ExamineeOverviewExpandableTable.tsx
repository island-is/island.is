// import { Box, Button, Table as T } from '@island.is/island-ui/core'
// import { useLocale } from '@island.is/localization'
// import { useState } from 'react'
// import { ExamCategoryType } from '../../lib/dataSchema'
// import { overview } from '../../lib/messages'

// interface Props {
//   data: ExamCategoryType[]
// }

// const TableRow = ({ line }: { line: string[] }) => {
//   return (
//     <T.Row>
//       {line.map((cell, index) => (
//         <T.Data key={`${cell}-${index}`}>{cell}</T.Data>
//       ))}
//     </T.Row>
//   )
// }

// export const ExamineeOverviewExpandableTable = ({ data }: Props) => {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const { formatMessage } = useLocale()
//   const MAX_ROWS = 5

//   const examineeList = data.flatMap((examinee) =>
//     examinee.categoryAndInstructor.map((ci) => ({
//       nationalId: examinee.nationalId,
//       name: examinee.name,
//       category: ci.category,
//       instructor: {
//         nationalId: ci.instructor.nationalId,
//         name: ci.instructor.name,
//       },
//     })),
//   )

//   const handleExpandTable = () => setIsExpanded(!isExpanded)
//   return (
//     <Box marginTop={1}>
//       <T.Table>
//         <T.Head>
//           <T.Row>
//             <T.HeadData>{formatMessage(overview.table.examinee)}</T.HeadData>
//             <T.HeadData>
//               {formatMessage(overview.table.examineeNationalId)}
//             </T.HeadData>
//             <T.HeadData>
//               {formatMessage(overview.table.examCategory)}
//             </T.HeadData>
//             <T.HeadData>{formatMessage(overview.table.instructor)}</T.HeadData>
//           </T.Row>
//         </T.Head>
//         <T.Body>
//           {!isExpanded && examineeList.length > MAX_ROWS
//             ? examineeList
//                 .slice(0, MAX_ROWS)
//                 .map((line, index) => (
//                   <TableRow
//                     key={index}
//                     line={[
//                       line.name,
//                       line.nationalId,
//                       line.category,
//                       line.instructor.name,
//                     ]}
//                   />
//                 ))
//             : examineeList.map((line, index) => (
//                 <TableRow
//                   key={index}
//                   line={[
//                     line.name,
//                     line.nationalId,
//                     line.category,
//                     line.instructor.name,
//                   ]}
//                 />
//               ))}
//         </T.Body>
//       </T.Table>
//       {examineeList.length > MAX_ROWS && (
//         <Box display="flex" justifyContent="center" marginY={2}>
//           <Button variant="text" onClick={handleExpandTable} size="small">
//             {isExpanded
//               ? formatMessage(overview.labels.seeLessButton)
//               : formatMessage(overview.labels.seeMoreButton)}
//           </Button>
//         </Box>
//       )}
//     </Box>
//   )
// }
