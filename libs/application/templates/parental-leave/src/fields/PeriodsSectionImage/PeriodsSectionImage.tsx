import React, { FC, ReactElement } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import ManWithStrollerIllustration from './ManWithStrollerIllustration'
import { Box, ResponsiveProp } from '@island.is/island-ui/core'

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
const PeriodsSectionImage: FC<PeriodsSectionImageProp> = ({
  children,
  height,
  display,
  marginTop,
  alignItems,
  marginRight,
  flexDirection,
  justifyContent,
}) => {
  // TODO style the image so it is not this huge...
  return (
    <Box
      display={display || 'flex'}
      flexDirection={flexDirection || 'column'}
      justifyContent={justifyContent || 'flexEnd'}
      alignItems={alignItems || 'flexEnd'}
      height={height || 'full'}
      marginRight={marginRight || 8}
      marginTop={marginTop || 8}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451 510" width="50%">
        <g fill="#ccdfff">
          <circle cx="311.385" cy="122.243" r="2" />
          <circle cx="263.385" cy="122.243" r="2" />
          <circle cx="215.385" cy="122.243" r="2" />
          <circle cx="311.385" cy="170.243" r="2" />
          <circle cx="311.385" cy="242.243" r="2" />
          <circle cx="263.385" cy="170.243" r="2" />
          <circle cx="215.385" cy="170.243" r="2" />
          <circle cx="263.385" cy="242.243" r="2" />
          <circle cx="215.385" cy="242.243" r="2" />
          <circle cx="287.385" cy="122.243" r="2" />
          <circle cx="239.385" cy="122.243" r="2" />
          <circle cx="191.385" cy="122.243" r="2" />
          <circle cx="167.385" cy="122.243" r="2" />
          <circle cx="287.385" cy="170.243" r="2" />
          <circle cx="287.385" cy="242.243" r="2" />
          <circle cx="239.385" cy="170.243" r="2" />
          <circle cx="191.385" cy="170.243" r="2" />
          <circle cx="167.385" cy="170.243" r="2" />
          <circle cx="239.385" cy="242.243" r="2" />
          <circle cx="191.385" cy="242.243" r="2" />
          <circle cx="167.385" cy="242.243" r="2" />
          <circle cx="311.385" cy="146.243" r="2" />
          <circle cx="311.385" cy="218.243" r="2" />
          <circle cx="263.385" cy="146.243" r="2" />
          <circle cx="215.385" cy="146.243" r="2" />
          <circle cx="263.385" cy="218.243" r="2" />
          <circle cx="215.385" cy="218.243" r="2" />
          <circle cx="311.385" cy="194.243" r="2" />
          <circle cx="311.385" cy="266.243" r="2" />
          <circle cx="263.385" cy="194.243" r="2" />
          <circle cx="215.385" cy="194.243" r="2" />
          <circle cx="263.385" cy="266.243" r="2" />
          <circle cx="215.385" cy="266.243" r="2" />
          <circle cx="287.385" cy="146.243" r="2" />
          <circle cx="287.385" cy="218.243" r="2" />
          <circle cx="239.385" cy="146.243" r="2" />
          <circle cx="191.385" cy="146.243" r="2" />
          <circle cx="167.385" cy="146.243" r="2" />
          <circle cx="239.385" cy="218.243" r="2" />
          <circle cx="191.385" cy="218.243" r="2" />
          <circle cx="167.385" cy="218.243" r="2" />
          <circle cx="287.385" cy="194.243" r="2" />
          <circle cx="287.385" cy="266.243" r="2" />
          <circle cx="239.385" cy="194.243" r="2" />
          <circle cx="191.385" cy="194.243" r="2" />
          <circle cx="167.385" cy="194.243" r="2" />
          <circle cx="239.385" cy="266.243" r="2" />
          <circle cx="191.385" cy="266.243" r="2" />
          <circle cx="167.385" cy="266.243" r="2" />
          <circle cx="335.385" cy="122.243" r="2" />
          <circle cx="335.385" cy="170.243" r="2" />
          <circle cx="335.385" cy="242.243" r="2" />
          <circle cx="335.385" cy="146.243" r="2" />
          <circle cx="335.385" cy="218.243" r="2" />
          <circle cx="335.385" cy="194.243" r="2" />
          <circle cx="335.385" cy="266.243" r="2" />
          <circle cx="143.385" cy="122.243" r="2" />
          <circle cx="95.385" cy="122.243" r="2" />
          <circle cx="47.385" cy="122.243" r="2" />
          <circle cx="143.385" cy="170.243" r="2" />
          <circle cx="143.385" cy="242.243" r="2" />
          <circle cx="95.385" cy="170.243" r="2" />
          <circle cx="47.385" cy="170.243" r="2" />
          <circle cx="95.385" cy="242.243" r="2" />
          <circle cx="47.385" cy="242.243" r="2" />
          <circle cx="119.385" cy="122.243" r="2" />
          <circle cx="71.385" cy="122.243" r="2" />
          <circle cx="23.385" cy="122.243" r="2" />
          <circle cx="119.385" cy="170.243" r="2" />
          <circle cx="119.385" cy="242.243" r="2" />
          <circle cx="71.385" cy="170.243" r="2" />
          <circle cx="23.385" cy="170.243" r="2" />
          <circle cx="71.385" cy="242.243" r="2" />
          <circle cx="23.385" cy="242.243" r="2" />
          <circle cx="143.385" cy="146.243" r="2" />
          <circle cx="143.385" cy="218.243" r="2" />
          <circle cx="95.385" cy="146.243" r="2" />
          <circle cx="47.385" cy="146.243" r="2" />
          <circle cx="95.385" cy="218.243" r="2" />
          <circle cx="47.385" cy="218.243" r="2" />
          <circle cx="143.385" cy="194.243" r="2" />
          <circle cx="143.385" cy="266.243" r="2" />
          <circle cx="95.385" cy="194.243" r="2" />
          <circle cx="47.385" cy="194.243" r="2" />
          <circle cx="95.385" cy="266.243" r="2" />
          <circle cx="47.385" cy="266.243" r="2" />
          <circle cx="119.385" cy="146.243" r="2" />
          <circle cx="119.385" cy="218.243" r="2" />
          <circle cx="71.385" cy="146.243" r="2" />
          <circle cx="23.385" cy="146.243" r="2" />
          <circle cx="71.385" cy="218.243" r="2" />
          <circle cx="23.385" cy="218.243" r="2" />
          <circle cx="119.385" cy="194.243" r="2" />
          <circle cx="119.385" cy="266.243" r="2" />
          <circle cx="71.385" cy="194.243" r="2" />
          <circle cx="23.385" cy="194.243" r="2" />
          <circle cx="71.385" cy="266.243" r="2" />
          <circle cx="23.385" cy="266.243" r="2" />
          <circle cx="311.385" cy="290.243" r="2" />
          <circle cx="263.385" cy="290.243" r="2" />
          <circle cx="215.385" cy="290.243" r="2" />
          <circle cx="311.385" cy="338.243" r="2" />
          <circle cx="311.385" cy="410.243" r="2" />
          <circle cx="263.385" cy="338.243" r="2" />
          <circle cx="215.385" cy="338.243" r="2" />
          <circle cx="263.385" cy="410.243" r="2" />
          <circle cx="215.385" cy="410.243" r="2" />
          <circle cx="287.385" cy="290.243" r="2" />
          <circle cx="239.385" cy="290.243" r="2" />
          <circle cx="191.385" cy="290.243" r="2" />
          <circle cx="167.385" cy="290.243" r="2" />
          <circle cx="287.385" cy="338.243" r="2" />
          <circle cx="287.385" cy="410.243" r="2" />
          <circle cx="239.385" cy="338.243" r="2" />
          <circle cx="191.385" cy="338.243" r="2" />
          <circle cx="167.385" cy="338.243" r="2" />
          <circle cx="239.385" cy="410.243" r="2" />
          <circle cx="191.385" cy="410.243" r="2" />
          <circle cx="167.385" cy="410.243" r="2" />
          <circle cx="311.385" cy="314.243" r="2" />
          <circle cx="311.385" cy="386.243" r="2" />
          <circle cx="263.385" cy="314.243" r="2" />
          <circle cx="215.385" cy="314.243" r="2" />
          <circle cx="263.385" cy="386.243" r="2" />
          <circle cx="215.385" cy="386.243" r="2" />
          <circle cx="311.385" cy="362.243" r="2" />
          <circle cx="311.385" cy="434.243" r="2" />
          <circle cx="263.385" cy="362.243" r="2" />
          <circle cx="215.385" cy="362.243" r="2" />
          <circle cx="263.385" cy="434.243" r="2" />
          <circle cx="215.385" cy="434.243" r="2" />
          <circle cx="287.385" cy="314.243" r="2" />
          <circle cx="287.385" cy="386.243" r="2" />
          <circle cx="239.385" cy="314.243" r="2" />
          <circle cx="191.385" cy="314.243" r="2" />
          <circle cx="167.385" cy="314.243" r="2" />
          <circle cx="239.385" cy="386.243" r="2" />
          <circle cx="191.385" cy="386.243" r="2" />
          <circle cx="167.385" cy="386.243" r="2" />
          <circle cx="287.385" cy="362.243" r="2" />
          <circle cx="287.385" cy="434.243" r="2" />
          <circle cx="239.385" cy="362.243" r="2" />
          <circle cx="191.385" cy="362.243" r="2" />
          <circle cx="167.385" cy="362.243" r="2" />
          <circle cx="239.385" cy="434.243" r="2" />
          <circle cx="191.385" cy="434.243" r="2" />
          <circle cx="167.385" cy="434.243" r="2" />
          <circle cx="335.385" cy="290.243" r="2" />
          <circle cx="335.385" cy="338.243" r="2" />
          <circle cx="335.385" cy="410.243" r="2" />
          <circle cx="335.385" cy="314.243" r="2" />
          <circle cx="335.385" cy="386.243" r="2" />
          <circle cx="335.385" cy="362.243" r="2" />
          <circle cx="335.385" cy="434.243" r="2" />
          <circle cx="311.385" cy="74.243" r="2" />
          <circle cx="263.385" cy="74.243" r="2" />
          <circle cx="215.385" cy="74.243" r="2" />
          <circle cx="287.385" cy="74.243" r="2" />
          <circle cx="239.385" cy="74.243" r="2" />
          <circle cx="191.385" cy="74.243" r="2" />
          <circle cx="167.385" cy="74.243" r="2" />
          <circle cx="311.385" cy="50.243" r="2" />
          <circle cx="263.385" cy="50.243" r="2" />
          <circle cx="215.385" cy="50.243" r="2" />
          <circle cx="311.385" cy="98.243" r="2" />
          <circle cx="263.385" cy="98.243" r="2" />
          <circle cx="215.385" cy="98.243" r="2" />
          <circle cx="287.385" cy="50.243" r="2" />
          <circle cx="239.385" cy="50.243" r="2" />
          <circle cx="191.385" cy="50.243" r="2" />
          <circle cx="167.385" cy="50.243" r="2" />
          <circle cx="287.385" cy="98.243" r="2" />
          <circle cx="239.385" cy="98.243" r="2" />
          <circle cx="191.385" cy="98.243" r="2" />
          <circle cx="167.385" cy="98.243" r="2" />
          <circle cx="335.385" cy="74.243" r="2" />
          <circle cx="335.385" cy="50.243" r="2" />
          <circle cx="335.385" cy="98.243" r="2" />
          <circle cx="143.385" cy="290.243" r="2" />
          <circle cx="95.385" cy="290.243" r="2" />
          <circle cx="47.385" cy="290.243" r="2" />
          <circle cx="143.385" cy="338.243" r="2" />
          <circle cx="143.385" cy="410.243" r="2" />
          <circle cx="95.385" cy="338.243" r="2" />
          <circle cx="47.385" cy="338.243" r="2" />
          <circle cx="95.385" cy="410.243" r="2" />
          <circle cx="47.385" cy="410.243" r="2" />
          <circle cx="119.385" cy="290.243" r="2" />
          <circle cx="71.385" cy="290.243" r="2" />
          <circle cx="23.385" cy="290.243" r="2" />
          <circle cx="119.385" cy="338.243" r="2" />
          <circle cx="119.385" cy="410.243" r="2" />
          <circle cx="71.385" cy="338.243" r="2" />
          <circle cx="23.385" cy="338.243" r="2" />
          <circle cx="71.385" cy="410.243" r="2" />
          <circle cx="23.385" cy="410.243" r="2" />
          <circle cx="143.385" cy="314.243" r="2" />
          <circle cx="143.385" cy="386.243" r="2" />
          <circle cx="95.385" cy="314.243" r="2" />
          <circle cx="47.385" cy="314.243" r="2" />
          <circle cx="95.385" cy="386.243" r="2" />
          <circle cx="47.385" cy="386.243" r="2" />
          <circle cx="143.385" cy="362.243" r="2" />
          <circle cx="143.385" cy="434.243" r="2" />
          <circle cx="95.385" cy="362.243" r="2" />
          <circle cx="47.385" cy="362.243" r="2" />
          <circle cx="95.385" cy="434.243" r="2" />
          <circle cx="47.385" cy="434.243" r="2" />
          <circle cx="119.385" cy="314.243" r="2" />
          <circle cx="119.385" cy="386.243" r="2" />
          <circle cx="71.385" cy="314.243" r="2" />
          <circle cx="23.385" cy="314.243" r="2" />
          <circle cx="71.385" cy="386.243" r="2" />
          <circle cx="23.385" cy="386.243" r="2" />
          <circle cx="119.385" cy="362.243" r="2" />
          <circle cx="119.385" cy="434.243" r="2" />
          <circle cx="71.385" cy="362.243" r="2" />
          <circle cx="23.385" cy="362.243" r="2" />
          <circle cx="71.385" cy="434.243" r="2" />
          <circle cx="23.385" cy="434.243" r="2" />
          <circle cx="143.385" cy="74.243" r="2" />
          <circle cx="95.385" cy="74.243" r="2" />
          <circle cx="47.385" cy="74.243" r="2" />
          <circle cx="119.385" cy="74.243" r="2" />
          <circle cx="71.385" cy="74.243" r="2" />
          <circle cx="23.385" cy="74.243" r="2" />
          <circle cx="143.385" cy="50.243" r="2" />
          <circle cx="95.385" cy="50.243" r="2" />
          <circle cx="47.385" cy="50.243" r="2" />
          <circle cx="143.385" cy="98.243" r="2" />
          <circle cx="95.385" cy="98.243" r="2" />
          <circle cx="47.385" cy="98.243" r="2" />
          <circle cx="119.385" cy="50.243" r="2" />
          <circle cx="71.385" cy="50.243" r="2" />
          <circle cx="23.385" cy="50.243" r="2" />
          <circle cx="119.385" cy="98.243" r="2" />
          <circle cx="71.385" cy="98.243" r="2" />
          <circle cx="23.385" cy="98.243" r="2" />
          <circle cx="311.385" cy="458.243" r="2" />
          <circle cx="263.385" cy="458.243" r="2" />
          <circle cx="215.385" cy="458.243" r="2" />
          <circle cx="311.385" cy="506.243" r="2" />
          <circle cx="263.385" cy="506.243" r="2" />
          <circle cx="215.385" cy="506.243" r="2" />
          <circle cx="287.385" cy="458.243" r="2" />
          <circle cx="239.385" cy="458.243" r="2" />
          <circle cx="191.385" cy="458.243" r="2" />
          <circle cx="167.385" cy="458.243" r="2" />
          <circle cx="287.385" cy="506.243" r="2" />
          <circle cx="239.385" cy="506.243" r="2" />
          <circle cx="191.385" cy="506.243" r="2" />
          <circle cx="167.385" cy="506.243" r="2" />
          <circle cx="311.385" cy="482.243" r="2" />
          <circle cx="263.385" cy="482.243" r="2" />
          <circle cx="215.385" cy="482.243" r="2" />
          <circle cx="311.385" cy="530.243" r="2" />
          <circle cx="263.385" cy="530.243" r="2" />
          <circle cx="215.385" cy="530.243" r="2" />
          <circle cx="287.385" cy="482.243" r="2" />
          <circle cx="239.385" cy="482.243" r="2" />
          <circle cx="191.385" cy="482.243" r="2" />
          <circle cx="167.385" cy="482.243" r="2" />
          <circle cx="287.385" cy="530.243" r="2" />
          <circle cx="239.385" cy="530.243" r="2" />
          <circle cx="191.385" cy="530.243" r="2" />
          <circle cx="167.385" cy="530.243" r="2" />
          <circle cx="335.385" cy="458.243" r="2" />
          <circle cx="335.385" cy="506.243" r="2" />
          <circle cx="335.385" cy="482.243" r="2" />
          <circle cx="335.385" cy="530.243" r="2" />
          <circle cx="143.385" cy="458.243" r="2" />
          <circle cx="95.385" cy="458.243" r="2" />
          <circle cx="47.385" cy="458.243" r="2" />
          <circle cx="143.385" cy="506.243" r="2" />
          <circle cx="95.385" cy="506.243" r="2" />
          <circle cx="47.385" cy="506.243" r="2" />
          <circle cx="119.385" cy="458.243" r="2" />
          <circle cx="71.385" cy="458.243" r="2" />
          <circle cx="23.385" cy="458.243" r="2" />
          <circle cx="119.385" cy="506.243" r="2" />
          <circle cx="71.385" cy="506.243" r="2" />
          <circle cx="23.385" cy="506.243" r="2" />
          <circle cx="143.385" cy="482.243" r="2" />
          <circle cx="95.385" cy="482.243" r="2" />
          <circle cx="47.385" cy="482.243" r="2" />
          <circle cx="143.385" cy="530.243" r="2" />
          <circle cx="95.385" cy="530.243" r="2" />
          <circle cx="47.385" cy="530.243" r="2" />
          <circle cx="119.385" cy="482.243" r="2" />
          <circle cx="71.385" cy="482.243" r="2" />
          <circle cx="23.385" cy="482.243" r="2" />
          <circle cx="119.385" cy="530.243" r="2" />
          <circle cx="71.385" cy="530.243" r="2" />
          <circle cx="23.385" cy="530.243" r="2" />
          <circle cx="407.5" cy="122.243" r="2" />
          <circle cx="359.5" cy="122.243" r="2" />
          <circle cx="407.5" cy="170.243" r="2" />
          <circle cx="359.5" cy="170.243" r="2" />
          <circle cx="407.5" cy="242.243" r="2" />
          <circle cx="359.5" cy="242.243" r="2" />
          <circle cx="431.5" cy="122.243" r="2" />
          <circle cx="383.5" cy="122.243" r="2" />
          <circle cx="431.5" cy="170.243" r="2" />
          <circle cx="431.5" cy="242.243" r="2" />
          <circle cx="383.5" cy="170.243" r="2" />
          <circle cx="383.5" cy="242.243" r="2" />
          <circle cx="407.5" cy="146.243" r="2" />
          <circle cx="359.5" cy="146.243" r="2" />
          <circle cx="407.5" cy="218.243" r="2" />
          <circle cx="359.5" cy="218.243" r="2" />
          <circle cx="407.5" cy="194.243" r="2" />
          <circle cx="359.5" cy="194.243" r="2" />
          <circle cx="407.5" cy="266.243" r="2" />
          <circle cx="359.5" cy="266.243" r="2" />
          <circle cx="431.5" cy="146.243" r="2" />
          <circle cx="431.5" cy="218.243" r="2" />
          <circle cx="383.5" cy="146.243" r="2" />
          <circle cx="383.5" cy="218.243" r="2" />
          <circle cx="431.5" cy="194.243" r="2" />
          <circle cx="431.5" cy="266.243" r="2" />
          <circle cx="383.5" cy="194.243" r="2" />
          <circle cx="383.5" cy="266.243" r="2" />
          <circle cx="407.5" cy="290.243" r="2" />
          <circle cx="359.5" cy="290.243" r="2" />
          <circle cx="407.5" cy="338.243" r="2" />
          <circle cx="359.5" cy="338.243" r="2" />
          <circle cx="407.5" cy="410.243" r="2" />
          <circle cx="359.5" cy="410.243" r="2" />
          <circle cx="431.5" cy="290.243" r="2" />
          <circle cx="383.5" cy="290.243" r="2" />
          <circle cx="431.5" cy="338.243" r="2" />
          <circle cx="431.5" cy="410.243" r="2" />
          <circle cx="383.5" cy="338.243" r="2" />
          <circle cx="383.5" cy="410.243" r="2" />
          <circle cx="407.5" cy="314.243" r="2" />
          <circle cx="359.5" cy="314.243" r="2" />
          <circle cx="407.5" cy="386.243" r="2" />
          <circle cx="359.5" cy="386.243" r="2" />
          <circle cx="407.5" cy="362.243" r="2" />
          <circle cx="359.5" cy="362.243" r="2" />
          <circle cx="407.5" cy="434.243" r="2" />
          <circle cx="359.5" cy="434.243" r="2" />
          <circle cx="431.5" cy="314.243" r="2" />
          <circle cx="431.5" cy="386.243" r="2" />
          <circle cx="383.5" cy="314.243" r="2" />
          <circle cx="383.5" cy="386.243" r="2" />
          <circle cx="431.5" cy="362.243" r="2" />
          <circle cx="431.5" cy="434.243" r="2" />
          <circle cx="383.5" cy="362.243" r="2" />
          <circle cx="383.5" cy="434.243" r="2" />
          <circle cx="407.5" cy="74.243" r="2" />
          <circle cx="359.5" cy="74.243" r="2" />
          <circle cx="431.5" cy="74.243" r="2" />
          <circle cx="383.5" cy="74.243" r="2" />
          <circle cx="407.5" cy="50.243" r="2" />
          <circle cx="359.5" cy="50.243" r="2" />
          <circle cx="407.5" cy="98.243" r="2" />
          <circle cx="359.5" cy="98.243" r="2" />
          <circle cx="431.5" cy="50.243" r="2" />
          <circle cx="383.5" cy="50.243" r="2" />
          <circle cx="431.5" cy="98.243" r="2" />
          <circle cx="383.5" cy="98.243" r="2" />
          <circle cx="407.5" cy="458.243" r="2" />
          <circle cx="359.5" cy="458.243" r="2" />
          <circle cx="407.5" cy="506.243" r="2" />
          <circle cx="359.5" cy="506.243" r="2" />
          <circle cx="431.5" cy="458.243" r="2" />
          <circle cx="383.5" cy="458.243" r="2" />
          <circle cx="431.5" cy="506.243" r="2" />
          <circle cx="383.5" cy="506.243" r="2" />
          <circle cx="407.5" cy="482.243" r="2" />
          <circle cx="359.5" cy="482.243" r="2" />
          <circle cx="407.5" cy="530.243" r="2" />
          <circle cx="359.5" cy="530.243" r="2" />
          <circle cx="431.5" cy="482.243" r="2" />
          <circle cx="383.5" cy="482.243" r="2" />
          <circle cx="431.5" cy="530.243" r="2" />
          <circle cx="383.5" cy="530.243" r="2" />
        </g>
        {children || <ManWithStrollerIllustration />}
      </svg>
    </Box>
  )
}

export default PeriodsSectionImage
