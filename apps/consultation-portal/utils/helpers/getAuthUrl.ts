
import { useQuery } from "@apollo/client"
import initApollo from "../../graphql/client"
import { GET_AUTH_URL } from "../../graphql/queries.graphql"

export const getAuthUrl = () => {
    const client = initApollo()
    const { data, loading } =  useQuery(GET_AUTH_URL, {
        client: client,
        ssr: true,
        fetchPolicy: 'cache-first'
    })

    const { consultationPortalAuthenticationUrl: authUrl = '' } = data ?? ''

    return { authUrl, authUrlLoading: loading }
}

export default getAuthUrl
