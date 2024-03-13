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
} from '@daohaus/ui';
import {
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

import { Kyc } from '@daohaus/moloch-v3-legos';
import { SupabaseKycRepository } from '@daohaus/moloch-v3-legos';
import { KycService } from '@daohaus/moloch-v3-legos';

type MembersTableType = MolochV3Members[number];
type PendingMembersTableType = {
  createdAt: string,
  fullName: string,
  emailAddress: string,
  phoneNumber: string,
  id: number
}


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
  useEffect(() => {
    const fetchPendingMembers = async () => {
      const kycService = new KycService(new SupabaseKycRepository());
      const pendingMembers = await kycService.getAllUsers();

      if (pendingMembers) {
        const members = pendingMembers.filter((member) => member !== undefined);
        const membersTransformed = members.map((member) => ({
          createdAt: new Date(member.created_at).toISOString().substring(0, new Date(member.created_at).toISOString().lastIndexOf(':')),
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, row: Row<PendingMembersTableType>) => {
    const isChecked = e.target.checked;
    console.log(`Checkbox for row ${row.id} is now ${isChecked ? 'checked' : 'unchecked'}`);
    
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
      Cell: ({ row } : {row: Row<PendingMembersTableType>}) => (
        <input
          type="checkbox"
          onChange={(e) => handleCheckboxChange(e, row)}
        />
      ),
    }
  ];
  
  const handleColumnSort = (
    orderBy: string,
    orderDirection: 'asc' | 'desc'
  ) => {
    orderMembers({ orderBy: orderBy as Member_OrderBy, orderDirection });
  };

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
      )}
      {dao && isLoadingMembers && (
        <LoadingContainer>
          <Loading size={120} />
        </LoadingContainer>
      )}
    </MemberContainer>
  );
};
