import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { RadioController } from '@island.is/shared/form-fields'
import { SkeletonLoader } from '@island.is/island-ui/core'
import useOtherParentOptions from '../../hooks/useOtherParentOptions'

const OtherParent: FC<FieldBaseProps> = ({ field, application, error }) => {
  const { options, loading } = useOtherParentOptions()
  if (loading) {
    return <SkeletonLoader repeat={3} space={1} height={48} />
  }
  return (
    <RadioController
      id="otherParent"
      disabled={false}
      name="otherParent"
      defaultValue={getValueViaPath(application.answers, field.id) as string[]}
      largeButtons
      options={options}
      error={error}
    />
  )
}

export default OtherParent
