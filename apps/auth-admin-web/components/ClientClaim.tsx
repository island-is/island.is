import React from 'react';
import { ClientClaimDTO } from '../models/dtos/client-claim.dto';

interface Props {
    claim: ClientClaimDTO,
    handleSaved?: (claim: ClientClaimDTO) => void
}

const ClientClaim: React.FC<Props> = (props: Props) =>
{
    const save = () => {
        const temp = new ClientClaimDTO();
        temp.clientId = props.claim.clientId;
        props.handleSaved(temp);
    }
    return <div onClick={() => save()}>Client Claim {props.claim.clientId}</div>
}
export default ClientClaim;