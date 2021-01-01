import '../styles/App.scss';
import React from 'react';
import { Provider } from 'next-auth/client';

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
