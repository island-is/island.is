import  { ReactNode } from 'react'

/**
 * React properties interface to easily add to components consistent test ID support for Cypress tests
 */
export interface TestSupport {
  children?: ReactNode
  dataTestId?: string
}
