import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, ProfileCard } from '@island.is/island-ui/core'
import { format as formatNationalId } from 'kennitala'

export const EstateMemberRepeater: FC<FieldBaseProps<any>> = () => {
  return (
    <Box marginTop={2}>
      <ProfileCard
        title={'Karl Sveinn Markúsarson'}
        description={[formatNationalId('0101422569'), 'Maki']}
      />
    </Box>
  )
}
