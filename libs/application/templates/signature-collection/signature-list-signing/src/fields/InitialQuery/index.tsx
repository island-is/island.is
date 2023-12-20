import { useLocation } from 'react-router-dom'
import { FC, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'

export const InitialQuery: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
}) => {
  const { search } = useLocation()
  const { id } = field
  const query = useMemo(() => new URLSearchParams(search), [search])
  const { setValue } = useFormContext()
  setValue(id, query.get('q'))
  return <> </>
}

export default InitialQuery
