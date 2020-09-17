import React from 'react'
import { useRouter} from 'next/router'

export function ServiceDetails() {
    const router = useRouter();
return (
    <h2>
        Details page {router.query.service}
    </h2>)
}