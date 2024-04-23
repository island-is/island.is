import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'

export const CustomFormConclusionSectionField: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const [fileToView, setFileToView] = useState<
    | {
        base64: string
        filename: string
      }
    | undefined
  >(undefined)

  if (fileToView) {
    return <></>
  }

  return <></>
}
