import { LOCAL_ABI } from '@daohaus/abis';
import { ContractLego } from '@daohaus/utils';
import { CONTRACT_KEYCHAINS } from '@daohaus/keychain-utils';

export const CONTRACT: Record<string, ContractLego> = {
  POSTER: {
    type: 'static',
    contractName: 'Poster',
    abi: LOCAL_ABI.POSTER,
    targetAddress: CONTRACT_KEYCHAINS.POSTER,
  },
  ERC_20: {
    type: 'static',
    contractName: 'ERC20',
    abi: LOCAL_ABI.ERC20,
    targetAddress: '.tokenAddress',
  },
  ERC_20_FUNDING: {
    type: 'static',
    contractName: 'ERC20',
    abi: LOCAL_ABI.ERC20,
    targetAddress: '.formValues.paymentTokenAddress',
  },
  CURRENT_DAO: {
    type: 'static',
    contractName: 'Current DAO (Baal)',
    abi: LOCAL_ABI.BAAL,
    targetAddress: '.daoId',
  },
  TRIBUTE_MINION: {
    type: 'static',
    contractName: 'Tribute Minion',
    abi: LOCAL_ABI.TRIBUTE_MINION,
    targetAddress: CONTRACT_KEYCHAINS.TRIBUTE_MINION,
  },
  SHARES_ERC20: {
    type: 'static',
    contractName: 'SHARES_ERC20',
    abi: LOCAL_ABI.SHARES,
    targetAddress: '.dao.sharesAddress',
  },
  LOOT_ERC20: {
    type: 'static',
    contractName: 'LOOT_ERC20',
    abi: LOCAL_ABI.LOOT,
    targetAddress: '.dao.sharesAddress',
  },
  VAULT_SUMMONER: {
    type: 'static',
    contractName: 'VAULT_SUMMONER',
    abi: LOCAL_ABI.VAULT_SUMMONER,
    targetAddress: CONTRACT_KEYCHAINS.VAULT_SUMMONER,
  },
  GNOSIS_MODULE: {
    type: 'static',
    contractName: 'GNOSIS_MODULE',
    abi: LOCAL_ABI.GNOSIS_MODULE,
    targetAddress: '.formValues.safeAddress',
  },
  GNOSIS_MULTISEND: {
    type: 'static',
    contractName: 'GNOSIS_MULTISEND',
    abi: LOCAL_ABI.GNOSIS_MULTISEND,
    targetAddress: CONTRACT_KEYCHAINS.GNOSIS_MULTISEND,
  },
  // added for purposes of RobinHoodDAO
  MEMBERSHIP_NFT:{
    type: 'static',
    contractName: 'MembershipNFT',
    abi: LOCAL_ABI.MEMBERSHIP_NFT,
    targetAddress: CONTRACT_KEYCHAINS.MEMBERSHIP_NFT
  }
};
