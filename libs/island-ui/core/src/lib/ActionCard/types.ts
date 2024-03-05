import type { ButtonSizes, ButtonTypes } from '../Button/types'
import type { TagVariant } from '../Tag/types'
import type { Icon as IconType } from '../IconRC/iconMap'

export type ActionCardProps = {
  date?: string
  heading?: string
  headingVariant?: 'h3' | 'h4'
  text?: string
  eyebrow?: string
  backgroundColor?: 'white' | 'blue' | 'red'
  focused?: boolean
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
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
  }
  secondaryCta?: {
    label: string
    visible?: boolean
    size?: ButtonSizes
    icon?: IconType
    onClick?: () => void
    disabled?: boolean
  }
  unavailable?: {
    active?: boolean
    label?: string
    message?: string
  }
  avatar?: boolean
  deleteButton?: {
    visible?: boolean
    onClick?: () => void
    disabled?: boolean
    icon?: IconType
    dialogTitle?: string
    dialogDescription?: string
    dialogConfirmLabel?: string
    dialogCancelLabel?: string
  }
  progressMeter?: {
    currentProgress: number
    maxProgress: number
    withLabel?: boolean
  }
}
