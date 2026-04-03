import { useState } from 'react'
import {
  IntroWrapperV2,
  LinkButton,
  m,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  FilterInput,
  Hidden,
  Inline,
  Input,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolMessages as psm } from '../../../lib/messages'

export const PrimarySchoolStudentPermission = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const [searchValue, setSearchValue] = useState('')

  return (
    <IntroWrapperV2
      title={psm.permissionTitle}
      intro={psm.permissionIntro}
      buttonGroup={{
        actions: [
          <LinkButton
            key={'action-button'}
            to={formatMessage(psm.headerLinkButtonUrl)}
            text={formatMessage(psm.headerLinkButtonText)}
            variant="utility"
            icon="open"
          />,
        ],
      }}
      serviceProvider={{ slug: MMS_SLUG, tooltip: formatMessage(m.mmsTooltip) }}
    >
      {/*}
      <Hidden print>
        <Inline space={2}>
          <FilterInput
            name="permission-search"
            placeholder={formatMessage(psm.filterByKeyword)}
            value={searchValue}
            onChange={(e) => setSearchValue(e)}
            size="xs"
            backgroundColor="blue"
          />
        </Inline>
      </Hidden> */}

      {/* TODO: replace with real permission data when permissions API is available */}
      <Box marginTop={5}>
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      </Box>
    </IntroWrapperV2>
  )
}

export default PrimarySchoolStudentPermission
