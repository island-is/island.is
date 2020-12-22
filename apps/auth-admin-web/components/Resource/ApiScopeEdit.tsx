import React from 'react';
import { useRouter } from 'next/router';
import ApiScopeData from './components/ApiScopeData'

export default function ApiScopeEdit() {
  const { query } = useRouter();
  const apiScopeId = query.edit;

  if (apiScopeId) {
    return <ApiScopeData apiScopeId={apiScopeId.toString()}/>;
  } else {
    return <div></div>;
  }
}
