import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceUserClaim from 'apps/auth-admin-web/models/interfaces/resource-user-claims';
import HelpBox from '../../HelpBox';

interface Props {
  identityResourceId: string;
}

const IdentityResourceUserClaim: React.FC<Props> = ({ identityResourceId }) => {
  const [claims, setClaims] = useState<ResourceUserClaim[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    getResources();
  }, [loaded]);

  const getResources = async () => {
    await axios
      .get(`/api/user-claims/${identityResourceId}`)
      .then((response) => {
        setClaims(response.data);
      });
  };

  const changeClaimResource = async (claim: ResourceUserClaim) => {
    claim.exists = !claim.exists;

    if (claim.exists == true) {
      await axios.post(
        `/api/user-claims/${identityResourceId}/${claim.claim_name}`
      );
    } else {
      await axios.delete(
        `/api/user-claims/${identityResourceId}/${claim.claim_name}`
      );
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
