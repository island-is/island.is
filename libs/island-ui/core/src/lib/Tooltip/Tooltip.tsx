import React, { FC, ReactElement, ReactType } from 'react'
import cn from 'classnames'
import {
  Tooltip as ReakitTooltip,
  TooltipArrow,
  TooltipReference,
  useTooltipState,
} from 'reakit'
import * as styles from './Tooltip.treat'

type Placement = 'top' | 'right' | 'bottom' | 'left'

interface InfoIconProps {
  color?: string
}

const InfoIcon: FC<InfoIconProps> = ({ color = '#0061FF' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={{ width: '100%' }}
      viewBox={`0 0 20 20`}
    >
      <path
        fill={color}
        d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8H9V5h2v2z"
      ></path>
    </svg>
  )
}

interface ArrowIconProps {
  placement: string
  color?: string
  colored?: boolean
}

const ArrowIcon: FC<ArrowIconProps> = ({
  placement,
  color = '#CCDFFF',
  colored,
}) => {
  let deg = 0

  if (placement.startsWith('left')) {
    deg = -90
  } else if (placement.startsWith('right')) {
    deg = 90
  } else if (placement.startsWith('bottom')) {
    deg = 180
  }

  const transform = `rotate(${deg}deg)`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      style={{ transform }}
    >
      <path
        fill={colored ? '#F2F7FF' : '#FFFFFF'}
        d="M7 12l6.928-12H.072L7 12z"
      ></path>
      <path
        fill={color}
        fillRule="evenodd"
        d="M6.998 12L.07 0h13.856L6.998 12zm0-2L1.22 0h11.56L6.998 10z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

interface TooltipProps {
  placement?: Placement
  colored?: boolean
  text: string
  iconSize?: number
  children?: ReactElement
  as?: ReactType
}

export const Tooltip: FC<TooltipProps> = ({
  placement,
  colored = false,
  text,
  iconSize = 14,
  children,
  as = 'span',
}) => {
  const tooltip = useTooltipState({
    animated: 250,
    ...(placement && { placement }),
  })

  return (
    <>
      {children ? (
        <TooltipReference {...tooltip} {...children.props}>
          {(referenceProps) => React.cloneElement(children, referenceProps)}
        </TooltipReference>
      ) : (
        <TooltipReference
          {...tooltip}
          as={as}
          className={cn(styles.icon)}
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
          }}
        >
          <InfoIcon />
        </TooltipReference>
      )}
      <ReakitTooltip {...tooltip}>
        <div className={cn(styles.tooltip, { [styles.colored]: colored })}>
          <TooltipArrow {...tooltip}>
            <ArrowIcon colored={colored} placement={tooltip.placement} />
          </TooltipArrow>
          {text}
        </div>
      </ReakitTooltip>
    </>
  )
}

export default Tooltip
