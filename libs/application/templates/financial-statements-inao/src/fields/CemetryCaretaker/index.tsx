import React, { useState } from 'react'
import { Box, Button, GridContainer, GridRow } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { CEMETRYCARETAKER } from '../../lib/constants'
import { InputController } from '@island.is/shared/form-fields'
import { CemetryCaretakerRepeater } from './CemetryCaretakerRepeater'

export { CemetryCaretakerRepeater as CemetryCaretaker }

// export const CemetryCaretaker = () => {
//   const { formatMessage } = useLocale()
//   const [boardMembers, setBoardMembers] = useState([])

//   return (
//     <GridContainer>
//       <GridRow align="spaceBetween">
//         <Box width="half" paddingTop={3} paddingRight={2}>
//           <InputController
//             id={CEMETRYCARETAKER.socialSecurity}
//             name={CEMETRYCARETAKER.socialSecurity}
//             label={formatMessage(m.nationalId)}
//             backgroundColor="blue"
//             format="######-####"
//           />
//         </Box>
//         <Box width="half" paddingTop={3} paddingRight={2}>
//           <InputController
//             id={CEMETRYCARETAKER.name}
//             name={CEMETRYCARETAKER.name}
//             label={formatMessage(m.fullName)}
//             backgroundColor="blue"
//           />
//         </Box>
//       </GridRow>
//       <GridRow align="spaceBetween">
//         <Box width="half" paddingTop={2} paddingRight={2}>
//           <SelectController
//             id={CEMETRYCARETAKER.role}
//             name={CEMETRYCARETAKER.role}
//             label={formatMessage(m.role)}
//             placeholder={formatMessage(m.selectRole)}
//             backgroundColor="blue"
//             options={[
//               { label: 'Skoðunarmaður', value: 'Skoðunarmaður' },
//               { label: 'Stjórnarmaður', value: 'Stjórnarmaður' },
//             ]}
//           />
//         </Box>
//       </GridRow>
//       <GridRow>
//         <Box paddingTop={2}>
//           <Button
//             variant="ghost"
//             icon="add"
//             iconType="outline"
//             size="small"
//             onClick={() => console.log('bæta við')}
//           >
//             {formatMessage(m.add)}
//           </Button>
//         </Box>
//       </GridRow>
//     </GridContainer>
//   )
// }
