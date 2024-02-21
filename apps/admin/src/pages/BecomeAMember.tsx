import { useCurrentDao } from '@daohaus/moloch-v3-hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FormBuilder } from '@daohaus/form-builder';
import { COMMON_FORMS } from '@daohaus/moloch-v3-legos';
import { AppFieldLookup } from '../legos/legoConfig';

export function BecomeAMember() {
  const { daoChain, daoId } = useCurrentDao();
  const navigate = useNavigate();

  useEffect(() => {
    const path = `/molochv3/${daoChain}/${daoId}/new-proposal?formLego=BECOME_A_MEMBER`;
    navigate(path);
  }, [daoChain, daoId, navigate]); // Dependencies array, re-run effect if these values change

  const onFormComplete = () => {
    console.log('It seems that form has been completed');
  };
  const onSubmit = () => {
    console.log('It seems that form has been completed');
  };

  return null;
  // return (
  //   <FormBuilder
  //     form={{ ...COMMON_FORMS.BECOME_A_MEMBER, log: true, devtool: true }}
  //     customFields={AppFieldLookup}
  //     lifeCycleFns={{
  //       onPollSuccess: () => {
  //         onFormComplete();
  //       },
  //       onTxSuccess: () => {
  //         console.log("Transaction sucessfully completed!");
  //       }
  //     }}
  //     targetNetwork={daoChain}
  //   />
  // );
}

export default BecomeAMember;
