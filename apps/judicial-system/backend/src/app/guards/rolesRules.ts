import type { RolesRule } from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

// Allows prosecutors to perform any action
export const prosecutorRule = UserRole.Prosecutor as RolesRule

// Allows representatives to perform any action
export const representativeRule = UserRole.Representative as RolesRule

// Allows judges to perform any action
export const judgeRule = UserRole.Judge as RolesRule

// Allows registrars to perform any action
export const registrarRule = UserRole.Registrar as RolesRule

// Allows assistants to perform any action
export const assistantRule = UserRole.Assistant as RolesRule

// Allows staff to perform any action
export const staffRule = UserRole.Staff as RolesRule

// Allows admins to perform any action
export const adminRule = UserRole.Admin as RolesRule

// Allows defenders to perform any action
export const defenderRule = UserRole.Defender as RolesRule
