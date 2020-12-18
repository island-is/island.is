import { useRouter } from 'next/router';
import IdentityResourceUserClaim from './components/IdrUserClaim';
import IdentityResourceData from './components/IdrData'

export default function IdentityResourcesEdit() {
    const { query } = useRouter();
    const identityResourceId = query.edit;

    if (identityResourceId != undefined) {
        return (
            <div className='edit-resource-overview'>
                <div>
                    <IdentityResourceData identityResourceId={identityResourceId.toString()}></IdentityResourceData>
                </div>
                <div>
                    {/* <IdentityResourceUserClaim identityResourceId={identityResourceId.toString()}></IdentityResourceUserClaim>*/}
                </div>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}