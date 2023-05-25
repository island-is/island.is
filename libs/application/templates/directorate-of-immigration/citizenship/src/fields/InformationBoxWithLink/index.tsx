import { AlertMessage, Box, Column, Columns, LinkV2 } from "@island.is/island-ui/core"

export const InformationBoxWithLink = () => {

    const actionItem = 
        <Columns>
            <Column>
                <LinkV2 href="/something" color="blue400" underline="normal" underlineVisibility="always">
                    Sjá eyðublöð á vefsíðu Útlendingastofnunar
                </LinkV2>
            </Column>
        </Columns>
    
    return(
        <AlertMessage
            type="info"
            title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
            message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
            action={actionItem}
        />
    )
}