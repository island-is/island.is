import React, { FC, ReactElement } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import ManWithStrollerIllustration from './ManWithStrollerIllustration'
import { Box, ResponsiveProp } from '@island.is/island-ui/core'
import BackgroundImage from '../../assets/BackgroundImage'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'

type ResponsivePropType =
  | ResponsiveProp<
      | 0
      | 1
      | 2
      | 3
      | 12
      | 4
      | 28
      | 20
      | 30
      | 6
      | 10
      | 15
      | 31
      | 29
      | 5
      | 22
      | 7
      | 8
      | 9
      | 14
      | 21
      | 23
      | 24
      | 25
      | 26
      | 27
      | 'auto'
      | 'none'
      | 'smallGutter'
      | 'gutter'
      | 'containerGutter'
      | 'p1'
      | 'p2'
      | 'p3'
      | 'p4'
      | 'p5'
    >
  | undefined

interface PeriodsSectionImageProp extends FieldBaseProps {
  children?: ReactElement
  display?:
    | ResponsiveProp<
        'none' | 'flex' | 'block' | 'inline' | 'inlineBlock' | 'inlineFlex'
      >
    | undefined
  flexDirection?:
    | ResponsiveProp<'column' | 'row' | 'rowReverse' | 'columnReverse'>
    | undefined
  justifyContent?:
    | ResponsiveProp<
        'center' | 'flexStart' | 'flexEnd' | 'spaceBetween' | 'spaceAround'
      >
    | undefined
  alignItems?:
    | ResponsiveProp<
        'stretch' | 'center' | 'baseline' | 'flexStart' | 'flexEnd'
      >
    | undefined
  height?: 'touchable' | 'full' | undefined
  marginRight?: ResponsivePropType
  marginTop?: ResponsivePropType
}

// TODO later move the illustrations from the web project and into a reusable library
const PeriodsSectionImage: FC<
  React.PropsWithChildren<PeriodsSectionImageProp>
> = ({
  application,
  field,
  children,
  height,
  display,
  marginTop,
  alignItems,
  marginRight,
  flexDirection,
  justifyContent,
}) => {
  const { formatMessage } = useLocale()
  const { description } = field

  return (
    <Box
      display={display || 'flex'}
      flexDirection={flexDirection || 'column'}
      justifyContent={justifyContent || 'flexEnd'}
      alignItems={alignItems || 'flexEnd'}
      height={height || 'full'}
      marginRight={marginRight || 0}
      marginTop={marginTop || 0}
    >
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}
      <BackgroundImage>
        {children || <ManWithStrollerIllustration />}
      </BackgroundImage>
    </Box>
  )
}

export default PeriodsSectionImage
