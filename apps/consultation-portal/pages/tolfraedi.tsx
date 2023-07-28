import { Layout } from '../components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
const Statistics = () => {
  return (
    <Layout seo={{ title: 'Tölfræði', url: 'tolfraedi' }}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <iframe
              title="Report Section"
              width="100%"
              height="700"
              src="https://app.powerbi.com/view?r=eyJrIjoiOTVmZjE2ZmUtZTMzMS00NDU3LWE3N2EtODE2NTZjMjIwYTlhIiwidCI6Ijk2YWI5NGU3LWY0M2QtNDk5Yi05OTgzLTQ1NGExYWE2MTg2OCIsImMiOjh9"
              allowFullScreen={true}
            ></iframe> */}
          </Box>
        </GridColumn>
      </GridRow>
    </Layout>
  )
}

export default Statistics
