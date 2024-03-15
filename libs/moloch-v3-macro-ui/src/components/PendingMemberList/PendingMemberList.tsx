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
import { FormFooter } from '@daohaus/form-builder';

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

  const [ tableData, setTableData ] = useState<PendingMembersTableType[]>([]);
  const [ selectedMembersNFTIds, setSelectedMembersNFTIds ] = useState<number[]>([]);
  const { errorToast, defaultToast, successToast } = useToast();
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const { fireTransaction } = useTxBuilder();

  useEffect(() => {
    const fetchPendingMembers = async () => {
      const kycService = new KycService(new SupabaseKycRepository());
      const pendingMembers = await kycService.getAllUsers();

      if (pendingMembers) {
        const members = pendingMembers.filter((member) => member !== undefined);
        const membersTransformed = members.map((member) => ({
          createdAt: new Date(member.created_at)
            .toISOString()
            .substring(
              0,
              new Date(member.created_at).toISOString().lastIndexOf(':')
            ),
          fullName: member.full_name,
          emailAddress: member.email_address,
          phoneNumber: member.phone_number,
          id: member.nft_id, // Assuming nft_id is the appropriate id for your table
        }));
        setTableData(membersTransformed.length ? membersTransformed : []);
      }
    };

    fetchPendingMembers().catch(console.error);
  }, [members]);

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
    fireTransaction({
      tx: {...ACTION_TX.MINT_MEMBERSHIP, staticArgs:[]} as TXLego,
      lifeCycleFns: {
        onTxSuccess: () => {
          defaultToast({
            title: 'Cancel Success',
            description: 'Please wait for subgraph to sync',
          });
          console.log('do something on success');
        },
      }, // Use a comma here if you have more properties to add, otherwise it can be omitted.
    });
  }
  
  if ((!dao && !isLoadingDao) || (!members && !isLoadingMembers))
    return (
      <AlertContainer>
        <ParLg className="warn">No Members Found</ParLg>
      </AlertContainer>
    );

  return (
    <MemberContainer>
      {!dao && isLoadingDao && (
        <LoadingContainer>
          <Loading size={120} />
        </LoadingContainer>
      )}
      {dao && members && tableData && columns && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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
          <div style={{ marginTop: '20px' }}>
            <Button 
              justify="center"
              onClick={(e) => sendTransaction(selectedMembersNFTIds)}>Submit</Button>
          </div>
          {/* We probably need to setup <FormFooter> here in order to have status indicator of transactions */}
        </div>
      )}
      {dao && isLoadingMembers && (
        <LoadingContainer>
          <Loading size={120} />
        </LoadingContainer>
      )}
    </MemberContainer>
  );
};
