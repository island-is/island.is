import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'

/**
 * Renders nothing. A multi-field screen only saves the answers of its own
 * children, so placing this field on a screen makes that screen save the
 * answer with the field's id, e.g. a value reset by `setOnChange`.
 */
export const PersistAnswer: FC<FieldBaseProps> = () => null
