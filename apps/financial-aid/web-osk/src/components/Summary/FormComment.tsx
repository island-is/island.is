import React, { useContext } from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'

const FormComment = () => {
  const { form, updateForm } = useContext(FormContext)

  return (
    <>
      <Box marginBottom={[3, 3, 4]}>
        <Text variant="h3">Annað sem þú vilt koma á framfæri?</Text>
      </Box>

      <Box marginBottom={[4, 4, 10]}>
        <Input
          backgroundColor={'blue'}
          label="Athugasemd"
          name="formComment"
          placeholder="Skrifaðu hér"
          rows={8}
          textarea
          value={form?.formComment}
          onChange={(event) => {
            updateForm({ ...form, formComment: event.target.value })
          }}
        />
      </Box>
    </>
  )
}

export default FormComment
