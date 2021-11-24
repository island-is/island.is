import type { RolesRule } from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

// Allows prosecutors to perform any action
export const prosecutorRule = UserRole.PROSECUTOR as RolesRule

// Allows judges to perform any action
export const judgeRule = UserRole.JUDGE as RolesRule

// Allows registrars to perform any action
export const registrarRule = UserRole.REGISTRAR as RolesRule

// Allows staff to perform any action
export const staffRule = UserRole.STAFF as RolesRule

// Allows admins to perform any action
export const adminRule = UserRole.ADMIN as RolesRule
