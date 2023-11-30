import {ScanResultCard} from '@ui';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {client} from '../../../graphql/client';
import {useVerifyPkPassMutation} from '../../../graphql/types/schema';
// import {VERIFY_PKPASS_MUTATION} from '../../../graphql/queries/verify-pkpass.mutation';

export const LicenseScanResult = ({
  data,
  onLoad,
  isExpired,
  title,
  hasNoData,
  type,
}: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [name, setName] = useState<string>();
  const [nationalId, setNationalId] = useState<string>();
  const [photo, setPhoto] = useState<string>();
  const intl = useIntl();
  const [verifyPkPass] = useVerifyPkPassMutation();

  useEffect(() => {
    onLoad(!loading);
  }, [loading]);

  useEffect(() => {
    verifyPkPass({
      variables: {
        input: {
          data,
        },
      },
    })
      .then(res => {
        if (res.errors) {
          setError(true);
          setErrorMessage(
            intl.formatMessage({id: 'licenseScanDetail.errorUnknown'}),
          );
          setLoading(false);
        } else {
          const {data, valid, error: smartError} = res.data?.verifyPkPass ?? {};

          if (!valid && smartError) {
            setError(true);
            setErrorMessage(
              intl.formatMessage(
                {id: 'licenseScanDetail.errorCodeMessage'},
                {errorCode: smartError?.status},
              ),
            );
            setLoading(false);
          } else {
            try {
              const {name, nationalId, photo} = JSON.parse(data ?? '{}');
              setError(false);
              setErrorMessage(undefined);
              setNationalId(nationalId);
              setName(name);
              setPhoto(photo?.mynd ?? photo);
            } catch (err) {
              // whoops
            }
            setError(false);
            setLoading(false);
          }
        }
      })
      .catch(err => {
        setError(true);
        setErrorMessage(
          intl.formatMessage({id: 'licenseScanDetail.errorNetwork'}),
        );
        setLoading(false);
      });
  }, [data]);

  let driverLicenseNumber;
  try {
    const parsed = JSON.parse(data);
    driverLicenseNumber = parsed?.TGLJZW;
  } catch (err) {
    // noop
  }

  return (
    <ScanResultCard
      title={title}
      loading={loading}
      isExpired={isExpired}
      error={error}
      errorMessage={errorMessage}
      name={name}
      nationalId={nationalId}
      licenseNumber={driverLicenseNumber}
      photo={photo}
      hasNoData={!nationalId}
      type={type}
    />
  );
};
