import { Box, Breadcrumbs } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { Admin } from '../Admin/Admin'
import { Forms } from '../Forms/Forms'
import { FormsHeader } from './components/FormsHeader'
import { m } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'

export const FormsLayout = () => {
  const { location } = useContext(FormsContext)
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={3}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: '/stjornbord' },
            { title: formatMessage(m.rootName) },
          ]}
        />
      </Box>
      <FormsHeader />
      {location === 'forms' ? (
        <Forms />
      ) : // ) : location === 'applications' ? (
      //   <Applications />
      location === 'admin' ? (
        <Admin />
      ) : null}
    </>
  )
}
