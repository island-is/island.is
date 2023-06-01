import { AlertMessage, GridColumn, Link, LinkV2, Text } from "@island.is/island-ui/core"
import { selectChildren } from "../../lib/messages"
import { FieldBaseProps } from "@island.is/application/types"
import { FC } from "react"
import * as styles from './AlertWithLink.css'

interface AlertWithLinkProps {
    field:{
        props: {
            title: string
            message?: string
            linkTitle: string
            linkUrl: string
        }
    }
}

export const AlertWithLink: FC<
AlertWithLinkProps & FieldBaseProps
> = ({ field }) => {
    const linkTitle = field?.props?.linkTitle
    const linkUrl = field?.props?.linkUrl
    const title = field?.props?.title
    const message = field?.props?.message

    const messageComponent = 
        <div>
            <Text as="span" variant="small">
                {`${message} `}
            </Text>
            <LinkV2 
                href={linkUrl} 
                color="blue400" 
                underline="normal" 
                underlineVisibility="hover"
                newTab
                className={styles.link}
            >       
                {linkTitle}
            </LinkV2>
        </div>
    
    return(
        <AlertMessage
            type="warning"
            title={title}
            message={messageComponent}
        />
    )
}