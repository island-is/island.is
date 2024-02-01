import { Box, Button, Inline, Text } from '@island.is/island-ui/core'
import router from 'next/router'
import TableRow from '../components/TableRow/TableRow'
import { IFormBuilder } from '../types/interfaces'

interface Props {
  formBuilder: IFormBuilder
}
export default function Forms({ formBuilder }: Props) {
  if (formBuilder) {
    return (
      <Box>
        {/* Title and buttons  */}
        <Box>
          <Text variant="h2">Forskriftir</Text>
        </Box>
        <Box marginTop={5}>
          <Inline space={2}>
            <Button
              variant="ghost"
              size="medium"
              onClick={() => router.push('/Form')}
            >
              Ný forskrift
            </Button>
            <Button variant="ghost" size="medium">
              Hlaða inn forskrift
            </Button>
          </Inline>
        </Box>

        <Box marginTop={5}>
          {/* Warning: Did not expect server HTML to contain a <span> in <div>. */}
          {/* <LicenseProviderDropdown
            licenseProviders={licenseProviders}
            setSelectProvider={setProvider}
          /> */}
        </Box>

        <Box marginTop={5}>
          <Box width={'half'}>
            {/* <Tabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              allTemp={allApplicationTemplates}
            /> */}
          </Box>
          <Box></Box>
        </Box>
        <TableRow isHeader={true} />
        {formBuilder.forms &&
          formBuilder.forms?.map((f) => {
            return (
              // <motion.div
              //   key={f.id}
              //   initial={{ opacity: 0 }}
              //   animate={{ opacity: 1 }}
              //   exit={{ opacity: 0 }}
              //   transition={{ duration: 0.5, delay: i * 0.1 }}
              // >
              <TableRow
                key={f.id}
                id={f.id}
                name={f.name.is}
                created={f.created}
                lastModified={f.lastChanged}
                org={f.organization.id}
                isHeader={false}
                translated={f.isTranslated}
              />
              // </motion.div>
            )
          })}
      </Box>
    )
  }
  return <></>
}
