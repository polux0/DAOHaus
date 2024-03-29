import React, { PropsWithChildren, useMemo } from 'react';

import { generateExplorerLink } from '@daohaus/keychain-utils';

import {
  MemberCardProps,
  MemberCardExplorerLinkProps,
  MemberCardItemProps,
  MemberCardCopyAddressProps,
} from './MemberCard.types';

import {
  DropdownMenu,
  DropdownProfileTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLink,
} from '../../molecules/Dropdown/Dropdown';
import { useCopyToClipboard } from '../../../hooks';

export const MemberCard = ({
  align = 'end',
  size,
  variant,
  profile,
  fullWidth,
  profileButtonColor,
  dropdownColor,
  children,
}: PropsWithChildren<MemberCardProps>) => {
  return (
    <DropdownMenu>
      <DropdownProfileTrigger
        size={size}
        variant={variant}
        color={profileButtonColor}
        profile={profile}
        fullWidth={fullWidth}
      ></DropdownProfileTrigger>
      <DropdownContent color={dropdownColor} align={align}>
        {children}
      </DropdownContent>
    </DropdownMenu>
  );
};

export const MemberCardExplorerLink = ({
  explorerNetworkId,
  profileAddress,
  children,
}: PropsWithChildren<MemberCardExplorerLinkProps>) => {
  const explorerLink = useMemo(() => {
    if (explorerNetworkId) {
      return generateExplorerLink({
        chainId: explorerNetworkId,
        address: profileAddress,
        type: 'address',
      });
    }
  }, [profileAddress, explorerNetworkId]);
  return (
    <DropdownItem asChild>
      <DropdownLink href={explorerLink}>{children}</DropdownLink>
    </DropdownItem>
  );
};

export const MemberCardCopyAddress = ({
  profileAddress,
  children,
  ...props
}: PropsWithChildren<MemberCardCopyAddressProps>) => {
  const copy = useCopyToClipboard();

  const handleCopy = () => {
    copy(profileAddress, 'Success!');
  };
  return (
    <DropdownItem onClick={handleCopy} {...props}>
      {children}
    </DropdownItem>
  );
};

export const MemberCardItem = ({
  children,
  ...props
}: PropsWithChildren<MemberCardItemProps>) => {
  return (
    <DropdownItem asChild {...props}>
      {children}
    </DropdownItem>
  );
};
