import { getSession } from 'next-auth/client';

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
