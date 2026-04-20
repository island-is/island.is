import { HTMLEditor } from '../components/html-editor/HTMLEditor'
import { HTMLText } from '@dmr.is/regulations-tools/types'
import { useFormContext } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { LGFieldBaseProps } from '../utils/types'

export const AdvertField = ({ application, errors }: LGFieldBaseProps) => {
  const { setValue, clearErrors, trigger } = useFormContext()

  const handleChange = (val: HTMLText) => {
    const base64 = Buffer.from(val).toString('base64')
    setValue('application.html', base64)
  }

  const handleBlur = (val: HTMLText) => {
    if (val.length > 0) {
      clearErrors('application.html')
    } else {
      setValue('application.html', '')
      trigger('application.html')
    }

    const base64 = Buffer.from(val).toString('base64')
    setValue('application.html', base64)
  }

  const base64 =
    getValueViaPath<string>(application.answers, 'application.html') ?? ''

  const defaultHtml = Buffer.from(base64, 'base64').toString(
    'utf-8',
  ) as HTMLText

  return (
    <HTMLEditor
      error={errors && getErrorViaPath(errors, 'application.html')}
      value={defaultHtml}
      onChange={handleChange}
      onBlur={handleBlur}
      fileUploader={() => Promise.resolve({} as unknown)}
    />
  )
}

export default AdvertField
