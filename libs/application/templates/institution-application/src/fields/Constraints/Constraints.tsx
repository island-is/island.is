import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Stack } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import ConstraintController from './ConstraintController'

const Constraints: FC<FieldBaseProps> = ({ field, application }) => {
  const { answers } = application
  const { id } = field

  const getConstraintVal = (constraintId: string) =>
    getValueViaPath(
      answers,
      `${id}.${constraintId}` as string,
      false,
    ) as boolean

  return (
    <Box background="blue100" padding={4}>
      <Stack space={2}>
        <ConstraintController
          id={`${id}.technical`}
          checkboxId={`${id}.hasTechnical`}
          label={'Tæknilegar skorður'}
          tooltip={'Herba derpa'}
          defaultValue={getConstraintVal('hasTechnical')}
        />
        <ConstraintController
          id={`${id}.financial`}
          checkboxId={`${id}.hasFinancial`}
          label={'Fjárhagslegar skorður'}
          tooltip={'Herba derpa'}
          defaultValue={getConstraintVal('hasFinancial')}
        />
        <ConstraintController
          id={`${id}.time`}
          checkboxId={`${id}.hasTime`}
          label={'Tímaskorður'}
          tooltip={'Herba derpa'}
          defaultValue={getConstraintVal('hasTime')}
        />
        <ConstraintController
          id={`${id}.shopping`}
          checkboxId={`${id}.hasShopping`}
          label={'Innkaupaskorður'}
          tooltip={'Herba derpa'}
          defaultValue={getConstraintVal('hasShopping')}
        />
        <ConstraintController
          id={`${id}.moral`}
          checkboxId={`${id}.hasMoral`}
          label={'Siðferðilegar skorður'}
          tooltip={'Herba derpa'}
          defaultValue={getConstraintVal('hasMoral')}
        />
        <ConstraintController
          id={`${id}.other`}
          checkboxId={`${id}.hasOther`}
          label={'Aðrar skorður'}
          tooltip={'Herba derpa'}
          defaultValue={getConstraintVal('hasOther')}
        />
      </Stack>
    </Box>
  )
}

export default Constraints
