import type { ButtonSizes, ButtonTypes } from '../Button/types'
import type { TagVariant } from '../Tag/types'
import type { Icon as IconType } from '../IconRC/iconMap'
import type { ProgressMeterVariant } from '../ProgressMeter/types'

export type BackgroundColor = 'white' | 'blue' | 'red'
export type EyebrowColor = 'blue400' | 'purple400'

export type ActionCardProps = {
  date?: string
  heading?: string
  headingVariant?: 'h3' | 'h4'
  renderHeading?: (headingEl: React.ReactNode) => React.ReactNode
  text?: string
  subText?: string
  eyebrow?: string
  eyebrowColor?: EyebrowColor
  backgroundColor?: BackgroundColor
  focused?: boolean
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
    renderTag?: (tagEl: React.ReactNode) => React.ReactNode
  }
  cta?: {
    label: string
    /** Allows for simple variant configuration of the button. If buttonType is defined it will supersede this property. */
    variant?: ButtonTypes['variant']
    /** Allows for full buttonType control. Supersedes the variant property when both are defined. */
    buttonType?: ButtonTypes
    size?: ButtonSizes
    icon?: IconType
    iconType?: 'filled' | 'outline'
    onClick?: () => void
    disabled?: boolean
    fluid?: boolean
  }
  unavailable?: {
    active?: boolean
    label?: string
    message?: string
  }
  avatar?: boolean
  progressMeter?: {
    currentProgress: number
    maxProgress: number
    withLabel?: boolean
    variant?: ProgressMeterVariant
  }
}
