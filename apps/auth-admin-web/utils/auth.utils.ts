/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from 'next-auth/client';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withAuthentication = (next: any) => async (context: any) => {
  const session = await getSession(context);
  if (isExpired(session)) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return next(context);
};

const isExpired = (session: any): boolean => {
  return !session || new Date() > new Date(session.expires);
};
