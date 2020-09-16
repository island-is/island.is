import React, { ElementType, FC, ReactElement } from 'react'
import cn from 'classnames'
import {
  Tooltip as ReakitTooltip,
  TooltipArrow,
  TooltipReference,
  useTooltipState,
} from 'reakit'
import * as styles from './Tooltip.treat'

type Placement = 'top' | 'right' | 'bottom' | 'left'

const InfoIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={styles.iconSVG}
      viewBox={`0 0 20 20`}
    >
      <path
        className={styles.iconPath}
        d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8H9V5h2v2z"
      ></path>
    </svg>
  )
}

interface ArrowIconProps {
  placement: string
}

const ArrowIcon: FC<ArrowIconProps> = ({ placement }) => {
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
      <path fill="#F2F7FF" d="M7 12l6.928-12H.072L7 12z"></path>
      <path
        fill="#CCDFFF"
        fillRule="evenodd"
        d="M6.998 12L.07 0h13.856L6.998 12zm0-2L1.22 0h11.56L6.998 10z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

interface TooltipProps {
  placement?: Placement
  text: string
  iconSize?: number
  children?: ReactElement
  as?: ElementType
}

export const Tooltip: FC<TooltipProps> = ({
  placement,
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
        <div className={styles.tooltip}>
          <TooltipArrow {...tooltip}>
            <ArrowIcon placement={tooltip.placement} />
          </TooltipArrow>
          {text}
        </div>
      </ReakitTooltip>
    </>
  )
}
