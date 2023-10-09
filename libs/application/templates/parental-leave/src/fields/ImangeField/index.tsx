import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import PeriodsSectionImage from '../PeriodsSectionImage/PeriodsSectionImage'
import WomanWithLaptopIllustration from '../../assets/Images/WomanWithLaptopIllustration'
import ManWithStrollerIllustration from '../../assets/Images/ManWithStrollerIllustration'
import WomanWithPhoneIllustration from '../../assets/Images/WomanWithPhoneIllustration'

const ImageField: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { defaultValue } = field
  const pictures = [
    <ManWithStrollerIllustration />,
    <WomanWithLaptopIllustration />,
    <WomanWithPhoneIllustration />,
  ]
  return (
    <Box>
      <PeriodsSectionImage
        field={field}
        application={application}
        alignItems={'center'}
      >
        {pictures[typeof defaultValue === 'number' ? defaultValue : 0]}
      </PeriodsSectionImage>
    </Box>
  )
}

export default ImageField
