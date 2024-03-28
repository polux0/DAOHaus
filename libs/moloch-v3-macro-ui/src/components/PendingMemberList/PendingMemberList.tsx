import { useEffect, useMemo, useState } from 'react';
import { Column, Cell, Row } from 'react-table';

import { ValidNetwork } from '@daohaus/keychain-utils';
import { Member_OrderBy, MolochV3Members } from '@daohaus/moloch-v3-data';
import { useDaoData, useDaoMembers } from '@daohaus/moloch-v3-hooks';
import {
  AddressDisplay,
  ParLg,
  Loading,
  Tooltip,
  useBreakpoint,
  widthQuery,
  Button,
  useToast,
} from '@daohaus/ui';
import {
  TXLego,
  formatDateFromSeconds,
  formatValueTo,
  fromWei,
  handleErrorMessage,
  sharesDelegatedToMember,
  votingPowerPercentage,
} from '@daohaus/utils';

import { DaoTable } from '../DaohausTable';
import {
  ActionContainer,
  AlertContainer,
  LoadingContainer,
  MemberContainer,
} from './MemberList.styles';
// import { PendingMembersOverview } from './PendingMembersOverview';
import { MemberProfileAvatar, MemberProfileMenu } from '../MemberProfileCard';

import { ACTION_TX, Kyc } from '@daohaus/moloch-v3-legos';
import { SupabaseKycRepository } from '@daohaus/moloch-v3-legos';
import { KycService } from '@daohaus/moloch-v3-legos';
import { useTxBuilder } from '@daohaus/tx-builder';
import { FormFooterModified, StatusMsg } from '@daohaus/form-builder';
import { base64ToBuffer, decryptData, importKey } from '@daohaus/moloch-v3-legos';

type MembersTableType = MolochV3Members[number];

// technical debt - this should be moved in MolochV3 data
type PendingMembersTableType = {
  createdAt: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  id: number;
};

type MemberListProps = {
  daoChain: ValidNetwork;
  daoId: string;
  allowLinks?: boolean;
  allowMemberMenu?: boolean;
};

export const PendingMemberList = ({
  daoChain,
  daoId,
  allowLinks = false,
  allowMemberMenu = false,
}: MemberListProps) => {
  const { dao, isLoading: isLoadingDao } = useDaoData();

  const {
    members,
    isLoading: isLoadingMembers,
    fetchNextPage,
    hasNextPage,
    orderMembers,
  } = useDaoMembers();
  const isMd = useBreakpoint(widthQuery.md);

  const [tableData, setTableData] = useState<PendingMembersTableType[]>([]);
  const [selectedMembersNFTIds, setSelectedMembersNFTIds] = useState<number[]>(
    []
  );
  const { errorToast, defaultToast, successToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // status of transaction
  const [status, setStatus] = useState<null | StatusMsg>(null);
  // tx hash of the transaction
  const [txHash, setTxHash] = useState<null | string>(null);
  const { fireTransaction } = useTxBuilder();

  useEffect(() => {
    const fetchPendingMembers = async () => {
      const kycService = new KycService(new SupabaseKycRepository());
      const pendingMembers = await kycService.getAllUsers();
      console.log('pendingMembers: ', pendingMembers);
  
      if (pendingMembers) {
        const members = pendingMembers.filter((member) => member !== undefined);
  
        // Decrypt and transform members
        const membersTransformed = await Promise.all(members.map(async (member) => {

          console.log('member: ', member);
          // Convert the encrypted strings back to Uint8Array for decryption
          const fullNameEncrypted = base64ToBuffer(member.full_name);
          const emailAddressEncrypted = base64ToBuffer(member.email_address);
          const phoneNumberEncrypted = base64ToBuffer(member.phone_number);
          const memberIV = base64ToBuffer(member.iv);
  
          const keyString = process.env.NX_KYC_ENCRYPTION_KEY;
          if (!keyString) throw new Error('NX_KYC_ENCRYPTION_KEY is not defined!');
          const decryptionKey = await importKey(keyString);

          // Assuming `decryptionKey` and `iv` are available and appropriate for decryption
          const fullName = await decryptData(fullNameEncrypted, new Uint8Array(memberIV), decryptionKey);
          const emailAddress = await decryptData(emailAddressEncrypted, new Uint8Array(memberIV), decryptionKey);
          const phoneNumber = await decryptData(phoneNumberEncrypted, new Uint8Array(memberIV), decryptionKey);

          console.log("Encrypted email address data:", emailAddressEncrypted); // Log encrypted data
          const decryptedEmailAddress = await decryptData(emailAddressEncrypted, new Uint8Array(memberIV), decryptionKey);
          console.log("Decrypted email address:", decryptedEmailAddress); // Log decrypted data
  
          return {
            createdAt: new Date(member.created_at)
              .toISOString()
              .substring(
                0,
                new Date(member.created_at).toISOString().lastIndexOf(':')
              ),
            fullName,
            emailAddress,
            phoneNumber,
            id: member.nft_id, // Assuming nft_id is the appropriate id for your table
          };
        }));
  
        setTableData(membersTransformed.length ? membersTransformed : []);
      }
    };
  
    fetchPendingMembers().catch(console.error);
  }, [members]); // Ensure `decryptionKey` and `iv` are also included in the dependency array if they're dynamic

  useEffect(() => {
    console.log('Current selected row IDs:', selectedMembersNFTIds);
  }, [selectedMembersNFTIds]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: Row<PendingMembersTableType>
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // Add the rowId to the state if it's not already present
      setSelectedMembersNFTIds((prev) => {
        if (!prev.includes(row.values.id)) {
          return [...prev, row.values.id];
        }
        return prev; // Return the previous state if the ID is already included
      });
    } else {
      // Remove the rowId from the state
      setSelectedMembersNFTIds((prev) =>
        prev.filter((id) => id !== row.values.id)
      );
    }
  };

  const columns: Column<PendingMembersTableType>[] = [
    {
      Header: 'Date',
      accessor: 'createdAt', // accessor is the "key" in the data
    },
    {
      Header: 'Full Name',
      accessor: 'fullName',
    },
    {
      Header: 'Email Address',
      accessor: 'emailAddress',
    },
    {
      Header: 'Phone Number',
      accessor: 'phoneNumber',
    },
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Approve',
      id: 'approve',
      // technical debt - checkbox needs to be styled
      Cell: ({ row }: { row: Row<PendingMembersTableType> }) => (
        <input
          type="checkbox"
          checked={selectedMembersNFTIds.includes(row.original.id)}
          onChange={(e) => handleCheckboxChange(e, row)}
        />
      ),
    },
  ];

  const handleColumnSort = (
    orderBy: string,
    orderDirection: 'asc' | 'desc'
  ) => {
    orderMembers({ orderBy: orderBy as Member_OrderBy, orderDirection });
  };

  const sendTransaction = (nftIds: Array<number>): void => {
    setIsLoading(true);
    setTxHash(null);
    setStatus(StatusMsg.Compile);
    fireTransaction({
      tx: { ...ACTION_TX.VERIFY_MEMBERSHIP, staticArgs: [] } as TXLego,
      lifeCycleFns: {
        onRequestSign() {
          setStatus(StatusMsg.Request);
        },
        onTxHash(txHash) {
          setTxHash(txHash);
          setStatus(StatusMsg.Await);
        },
        onTxError: (error) => {
          setStatus(StatusMsg.TxErr);
          const errMsg = handleErrorMessage({
            error,
          });
          setIsLoading(false);
          errorToast({ title: StatusMsg.TxErr, description: errMsg });
        },
        onTxSuccess: () => {
          defaultToast({
            title: 'Cancel Success',
            description: 'Please wait for subgraph to sync',
          });
          setStatus(StatusMsg.TxSuccess);
          successToast({ title: StatusMsg.TxSuccess, description: "Success!"})
          console.log('do something on success');
        },
      }, // Use a comma here if you have more properties to add, otherwise it can be omitted.
    });
  };

  // const handleSubmit = async (formValues: FieldValues) => {
  //   if (form.tx) {
  //     setIsLoading(true);
  //     setTxHash(null);
  //     setStatus(StatusMsg.Compile);
  //     const executed = await fireTransaction({
  //       tx: form.tx,
  //       callerState: {
  //         formValues,
  //       },
  //       lifeCycleFns: {
  //         onRequestSign() {
  //           setStatus(StatusMsg.Request);
  //           lifeCycleFns?.onRequestSign?.();
  //         },
  //         onTxHash(txHash) {
  //           setTxHash(txHash);
  //           setStatus(StatusMsg.Await);
  //           lifeCycleFns?.onTxHash?.(txHash);
  //         },
  //         onTxError(error) {
  //           setStatus(StatusMsg.TxErr);
  //           const errMsg = handleErrorMessage({
  //             error,
  //             fallback: 'Could not decode error message',
  //           });

  //           setIsLoading(false);
  //           lifeCycleFns?.onTxError?.(error);
  //           errorToast({ title: StatusMsg.TxErr, description: errMsg });
  //         },
  //         onTxSuccess(...args) {
  //           setStatus(
  //             form.tx?.disablePoll ? StatusMsg.PollSuccess : StatusMsg.TxSuccess
  //           );
  //           lifeCycleFns?.onTxSuccess?.(...args);
  //           defaultToast({
  //             title: StatusMsg.TxSuccess,
  //             description: form.tx?.disablePoll
  //               ? 'Transaction cycle complete.'
  //               : 'Please wait for subgraph to sync',
  //           });
  //         },
  //         onPollStart() {
  //           setStatus(StatusMsg.PollStart);
  //           lifeCycleFns?.onPollStart?.();
  //         },
  //         onPollError(error) {
  //           setStatus(StatusMsg.PollError);
  //           const errMsg = handleErrorMessage({
  //             error,
  //             fallback: 'Could not decode poll error message',
  //           });
  //           setIsLoading(false);
  //           lifeCycleFns?.onPollError?.(error);
  //           errorToast({ title: StatusMsg.PollError, description: errMsg });
  //         },
  //         onPollSuccess(...args) {
  //           setStatus(StatusMsg.PollSuccess);
  //           setIsLoading(false);
  //           successToast({
  //             title: StatusMsg.PollSuccess,
  //             description: 'Transaction cycle complete.',
  //           });
  //           lifeCycleFns?.onPollSuccess?.(...args);
  //         },
  //       },
  //     });
  //     if (executed === undefined) {
  //       setStatus(StatusMsg.NoContext);
  //       return;
  //     }
  //     return executed;
  //   }
  //   if (onSubmit) {
  //     console.log('onSubmit.formValues: ', formValues);
  //     return await onSubmit?.(formValues);
  //   }
  //   console.error('FormBuilder: onSubmit not implemented');
  // };

  if ((!dao && !isLoadingDao) || (!members && !isLoadingMembers))
    return (
      <AlertContainer>
        <ParLg className="warn">No Members Found</ParLg>
      </AlertContainer>
    );

  return (
    <>
      <MemberContainer>
        {!dao && isLoadingDao && (
          <LoadingContainer>
            <Loading size={120} />
          </LoadingContainer>
        )}
        {dao && members && tableData && columns && (
          <div>
            <DaoTable<PendingMembersTableType>
              tableData={tableData}
              columns={columns}
              hasNextPaging={hasNextPage}
              handleLoadMore={() => fetchNextPage()}
              handleColumnSort={handleColumnSort}
              sortableColumns={
                isMd
                  ? ['loot', 'shares']
                  : ['createdAt', 'shares', 'loot', 'delegateShares']
              }
            />
          </div>
        )}
        {dao && isLoadingMembers && (
          <LoadingContainer>
            <Loading size={120} />
          </LoadingContainer>
        )}
      </MemberContainer>
      {dao && members && (
        <div
        // style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        >
          <FormFooterModified
            submitButtonFunction={() => sendTransaction(selectedMembersNFTIds)}
            submitDisabled={false}
            status={status}
            txHash={txHash}
          />
        </div>
      )}
    </>
  );
};
