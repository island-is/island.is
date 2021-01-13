import '../styles/App.scss';
import React from 'react';
import { Provider } from 'next-auth/client';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }) {
  return (
    <Provider
      session={pageProps.session}
      options={{
        keepAlive: process.env.NEXT_PUBLIC_SESSION_KEEP_ALIVE_SECONDS,
      }}
    >
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
