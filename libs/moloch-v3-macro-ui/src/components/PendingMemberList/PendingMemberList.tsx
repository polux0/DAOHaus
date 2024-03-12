import { useMemo } from 'react';
import { Column, Row } from 'react-table';

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

type MembersTableType = MolochV3Members[number];

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

  const tableData = useMemo<MolochV3Members>(() => {
    if (members) {
      const filteredMembers = members.filter((member) => member !== undefined);
      return filteredMembers?.length
        ? (filteredMembers as MolochV3Members)
        : [];
    }
    return [];
  }, [members]);

  const columns = useMemo<Column<MembersTableType>[]>(
    () => [
      {
        Header: 'Member',
        accessor: 'memberAddress',
        Cell: ({ value }: { value: string }) => {
          return (
            <MemberProfileAvatar
              daoChain={daoChain}
              daoId={daoId}
              memberAddress={value}
              allowLinks={allowLinks}
            />
          );
        },
      },
      {
        Header: () => {
          return <div className="hide-sm">Membership Request Date</div>;
        },
        accessor: 'createdAt',
        Cell: ({ value }: { value: string }) => {
          console.log('value: ', value);
          return <div className="hide-sm">{formatDateFromSeconds(value)}</div>;
        },
      },
      {
        Header: () => {
          return <div className="hide-sm">Full name</div>;
        },
        accessor: 'delegateShares',
        Cell: ({
          value,
          row,
        }: {
          value: string;
          row: Row<MembersTableType>;
        }) => {
          const delegatedShares = sharesDelegatedToMember(
            row.original.delegateShares,
            row.original.shares
          );
          return (
            <div className="hide-sm">
              {votingPowerPercentage(dao?.totalShares || '0', value)}
              {' %'}
              {Number(delegatedShares) > 0 && (
                <Tooltip
                  content={`${formatValueTo({
                    value: fromWei(delegatedShares),
                    decimals: 2,
                    format: 'number',
                  })} voting tokens are delegated to this member`}
                  side="bottom"
                />
              )}
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div className="hide-sm">Email Address</div>;
        },
        accessor: 'delegatingTo',
        Cell: ({
          value,
          row,
        }: {
          value: string;
          row: Row<MembersTableType>;
        }) => {
          return (
            <div className="hide-sm">
              {value === row.original.memberAddress ? (
                '--'
              ) : (
                <AddressDisplay address={value} truncate />
              )}
            </div>
          );
        },
      },
      {
        Header: () => {
          return <>Phone Number</>;
        },
        accessor: 'shares',
        Cell: ({ value }: { value: string }) => {
          return (
            <div>
              {formatValueTo({
                value: fromWei(value),
                decimals: 2,
                format: 'number',
              })}
            </div>
          );
        },
      },
      {
        Header: () => {
          return <div>Id</div>;
        },
        accessor: 'loot',
        Cell: ({ value }: { value: string }) => {
          return (
            <div>
              {formatValueTo({
                value: fromWei(value),
                decimals: 2,
                format: 'number',
              })}
            </div>
          );
        },
      },

      {
        accessor: 'id',
        Cell: ({ row }: { row: Row<MembersTableType> }) => {
          return (
            <ActionContainer>
              <MemberProfileMenu
                daoChain={daoChain}
                daoId={daoId}
                memberAddress={row.original.memberAddress}
                allowLinks={allowLinks}
                allowMemberMenu={allowMemberMenu}
              />
            </ActionContainer>
          );
        },
      },
    ],
    [daoChain, dao, allowLinks, daoId, allowMemberMenu]
  );

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
        <DaoTable<MembersTableType>
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
