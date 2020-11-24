import React, { useCallback } from 'react';
import { ClientClaimDTO } from '../models/dtos/client-claim.dto';

interface Props {
    claim: ClientClaimDTO,
    handleSaved?: () => void
}

const ClientClaim: React.FC<Props> = (props: Props) =>
{
    return <div onClick={props.handleSaved}>Client Claim {props.claim.clientId}</div>
}
export default ClientClaim;