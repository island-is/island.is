// // TODO(balli) Look into removing this all together and replace with built in overview field
// import {
//   FieldBaseProps,
//   FieldComponents,
//   FieldTypes,
// } from '@island.is/application/types'
// import { FC } from 'react'
// import { Box } from '@island.is/island-ui/core'
// import { useLocale } from '@island.is/localization'
// import { ReviewGroup } from '../Components/ReviewGroup'
// import { KeyValueFormField } from '@island.is/application/ui-fields'
// import { overview } from '../../lib/messages'
// import {
//   getPaymentArrangementForOverview,
// } from '../../utils'
// // import { ParticipantsOverviewExpandableTable } from '../Components/ParticipantsOverviewExpandableTable'
// import { getValueViaPath } from '@island.is/application/core'
// import { ExamineeOverviewExpandableTable } from '../Components/ExamineeOverviewExpandableTable'
// import { ExamCategoryType } from '../../lib/dataSchema'

// export const Overview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
//   ...props
// }) => {
//   const { application, goToScreen } = props
//   const { formatMessage } = useLocale()

//   const onClick = (page: string) => {
//     if (goToScreen) goToScreen(page)
//   }

//   return (
//     <Box>
//       <ReviewGroup title={formatMessage(overview.labels.personalInfo)}>
//         <KeyValueFormField
//           application={application}
//           field={{
//             ...props.field,
//             type: FieldTypes.KEY_VALUE,
//             component: FieldComponents.KEY_VALUE,
//             title: '',
//             label: '',
//             value: getPersonalInformationForOverview(
//               application.answers,
//               formatMessage,
//             ),
//           }}
//         />
//       </ReviewGroup>

//       <ReviewGroup
//         handleClick={() => onClick('paymentArrangementMultiField')}
//         editMessage={formatMessage(overview.labels.editMessage)}
//         title={formatMessage(overview.labels.paymentArrangement)}
//       >
//         <KeyValueFormField
//           application={application}
//           field={{
//             ...props.field,
//             type: FieldTypes.KEY_VALUE,
//             component: FieldComponents.KEY_VALUE,
//             title: '',
//             label: '',
//             value: getPaymentArrangementForOverview(
//               application.answers,
//               application.externalData,
//               formatMessage,
//             ),
//           }}
//         />
//       </ReviewGroup>

//       <ReviewGroup
//         handleClick={() => onClick('participantsMultiField')}
//         editMessage={formatMessage(overview.labels.editMessage)}
//         title={formatMessage(overview.labels.examinee)}
//         isLast
//       >
//         <ExamineeOverviewExpandableTable
//           data={
//             getValueViaPath<ExamCategoryType[]>(
//               application.answers,
//               'examCategory',
//             ) ?? []
//           }
//         />
//       </ReviewGroup>
//     </Box>
//   )
// }
