// import { useContext } from 'react'
// import { Box, Text } from '@island.is/island-ui/core'
// import SelectNavComponent from './components/SelectNavComponent'
// import FormBuilderContext from '../../context/FormBuilderContext'
// import { NavbarSelectStatus } from '../../types/interfaces'
// import ControlContext from '../../context/ControlContext'
// import { FormSystemStep } from '@island.is/api/schema'

// export default function NavbarSelect() {
//   const { control } = useContext(ControlContext)
//   const { activeItem, steps, groups, inputs } = control
//   let selectable = false
//   return (
//     <Box>
//       <Box paddingBottom={2} overflow="hidden">
//         <Text variant="h5">Skref</Text>
//       </Box>
//       {steps
//         ?.filter((s): s is FormSystemStep => s !== null && s !== undefined)
//         .filter((s) => s.type === 'Innsláttur')
//         .map((s) => (
//           <Box key={s.guid}>
//             <SelectNavComponent
//               type="Step"
//               data={s as FormSystemStep}
//               active={activeItem.data.guid === s.guid}
//               selectable={selectable}
//             />
//             {groups
//               .filter((g) => g.stepGuid === s.guid)
//               .map((g) => (
//                 <Box key={g.guid}>
//                   <SelectNavComponent
//                     type="Group"
//                     data={g}
//                     active={activeItem.data.guid === g.guid}
//                     selectable={selectable}
//                   />
//                   {inputs
//                     .filter((i) => i.groupGuid === g.guid)
//                     .map((i) => {
//                       if (activeItem.data.guid === i.guid) {
//                         if (
//                           selectStatus !== NavbarSelectStatus.ON_WITHOUT_SELECT
//                         ) {
//                           selectable = true
//                         }
//                       }
//                       return (
//                         <SelectNavComponent
//                           key={i.guid}
//                           type="Input"
//                           data={i}
//                           active={activeItem.data.guid === i.guid}
//                           selectable={selectable}
//                         />
//                       )
//                     })}
//                 </Box>
//               ))}
//           </Box>
//         ))}
//     </Box>
//   )
// }
