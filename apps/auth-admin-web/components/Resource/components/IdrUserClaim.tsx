import React, { useEffect, useState } from 'react';
import ResourceUserClaim from './../../../entities/models/resource-user-claims';
import HelpBox from './../../Common/HelpBox';
import { ResourcesService } from './../../../services/ResourcesService';

interface Props {
  identityResourceId: string;
}

const IdentityResourceUserClaim: React.FC<Props> = ({ identityResourceId }) => {
  const [claims, setClaims] = useState<ResourceUserClaim[]>([]);

  useEffect(() => {
    getResources();
  }, []);

  const getResources = async () => {
    const response = await ResourcesService.getResourceUserClaims(identityResourceId);
    if(response){
      setClaims(response.data);
    }
  };

  const changeClaimResource = async (claim: ResourceUserClaim) => {
    claim.exists = !claim.exists;

    if (claim.exists) {
      const response = await ResourcesService.addResourceUserClaim(identityResourceId, claim.claim_name);
      // TODO: What should happen now?
      
    } else {
      const response = await ResourcesService.removeResourceUserClaim(identityResourceId, claim.claim_name);
      // TODO: What should happen now?
    }
  };

  return (
    <div>
      <p>Identity resource user claims</p>
      <ul>
        {claims.map((claim) => (
          <div
            key={claim.claim_name}
            className="client-idp-restriction__container__checkbox__field"
          >
            <label className="client-idp-restriction__label">
              {claim.claim_name}
            </label>
            <input
              type="checkbox"
              name="sim"
              className="client__checkbox"
              defaultChecked={claim.exists}
              onChange={(e) => changeClaimResource(claim)}
              title={claim.claim_description}
            />
            <HelpBox helpText={claim.claim_description} />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default IdentityResourceUserClaim;
