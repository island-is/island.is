import { Box } from '@island.is/island-ui/core'
import { NumberInput } from '@island.is/financial-aid-web/veita/src/components'
import {
  aidDescriptionFromName,
  AidName,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  id: string
  aid: number
  prefix: string
  error: boolean
  update: (value: number) => void
}

const MunicipalityNumberInput = ({ id, aid, prefix, error, update }: Props) => {
  return (
    <Box id={`${prefix}${id}`} marginBottom={[1, 1, 3]}>
      <NumberInput
        id={`input${prefix}${id}`}
        name={`${prefix}${id}`}
        label={aidDescriptionFromName[id as AidName]}
        maximumInputLength={6}
        value={aid.toString()}
        hasError={error && aid === 0}
        errorMessage={'Grunnupphæð þarf að vera hærri en 0'}
        onUpdate={(value) => update(value)}
      />
    </Box>
  )
}

export default MunicipalityNumberInput
