import ContentWrapper from "./../../components/Layout/ContentWrapper"
import { withAuthentication } from "./../../utils/auth.utils"
import { NextPageContext } from "next"
import Link from "next/link"
import React from "react"

const Index: React.FC = () => {
    return (
      <ContentWrapper>
          <Link href="/admin/idp-provider"><a>Create a new Idp Provider</a></Link>
      </ContentWrapper>
    )
  }
  export default Index
  
  export const getServerSideProps = withAuthentication(
    async (context: NextPageContext) => {
      return {
        props: {},
      }
    },
  )