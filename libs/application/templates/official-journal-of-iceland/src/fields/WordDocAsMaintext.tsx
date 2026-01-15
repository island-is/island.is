import { useLayoutEffect, useRef } from 'react'
import { AlertMessage, Button, Text } from '@island.is/island-ui/core'
import { ApplicationAttachmentType } from '../lib/constants'
import { useFormContext } from 'react-hook-form'
import { InputFields } from '../lib/types'
import { attachments } from '../lib/messages/attachments'
import { useLocale } from '@island.is/localization'
import { InputFileUploadDeprecated, Box } from '@island.is/island-ui/core'
import { useApplication } from '../hooks/useUpdateApplication'

import { useFileUpload } from '../hooks/useFileUpload'

export const DocAsMainText = ({ applicationId }: { applicationId: string }) => {
  const { formatMessage: f } = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  const { setValue } = useFormContext()
  const { updateApplication, application: currentApplication } = useApplication(
    {
      applicationId: applicationId,
    },
  )
  const { files, onChange, onRemove } = useFileUpload({
    applicationId: applicationId,
    attachmentType: ApplicationAttachmentType.MAINTEXT,
  })
  return (
    <Box ref={ref} style={{ scrollMarginTop: '120px' }}>
      <Box marginBottom={2}>
        {files.length > 0 ? (
          <Text>{`Skrá sem verður að meginmáli:`}</Text>
        ) : (
          <AlertMessage
            type="warning"
            title="Efni til birtingar of stórt í ritil"
            message="Meginmál efnis til birtingar er of stórt til að halda áfram með umsókn. Til þess að halda áfram verður að hlaða upp Word skjali sem
                    inniheldur meginmálið. Texti í ritli mun hreinsast út þegar skjali er hlaðið upp."
          />
        )}
      </Box>
      <InputFileUploadDeprecated
        header={f(attachments.inputs.fileUpload.header)}
        description={f(attachments.inputs.fileUpload.descriptionMainAsDoc)}
        buttonLabel={f(attachments.inputs.fileUpload.buttonLabel)}
        fileList={files}
        accept={['.doc', '.docx']}
        onChange={(f) => {
          setValue(InputFields.misc.mainTextFilename, f)
          updateApplication({
            ...currentApplication.answers,
            advert: {
              ...currentApplication.answers.advert,
              html: '',
            },
            misc: {
              ...currentApplication.answers.misc,
              mainTextAsFile: true,
              mainTextFilename: f[0]?.name || 'meginmal.docx',
            },
          })
          onChange(f)
        }}
        onRemove={(f) => {
          setValue(InputFields.misc.mainTextFilename, '')
          setValue(InputFields.misc.mainTextAsFile, false)
          updateApplication({
            ...currentApplication.answers,
            misc: {
              ...currentApplication.answers.misc,
              mainTextFilename: '',
              mainTextAsFile: false,
            },
          })
          onRemove(f)
        }}
        multiple={false}
        defaultFileBackgroundColor={{
          background: 'blue100',
          border: 'blue200',
          icon: 'blue200',
        }}
      />
    </Box>
  )
}
