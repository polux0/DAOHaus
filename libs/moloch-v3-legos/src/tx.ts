import { LOCAL_ABI } from '@daohaus/abis';
import {
  NestedArray,
  POSTER_TAGS,
  TABULA_TAGS,
  TXLego,
  ValidArgType,
  TXLegoBase,
} from '@daohaus/utils';
import { CONTRACT_KEYCHAINS } from '@daohaus/keychain-utils';

import { buildMultiCallTX } from '@daohaus/tx-builder';
import { MaxUint256 } from '@daohaus/utils';
import { ProposalTypeIds } from '@daohaus/utils';
import { CONTRACT } from './contracts';

// modified for purposes of RobinHoodDAO
import { SupabaseKycRepository } from '../kyc/supabaseKycRepository';
import { KycService } from '../kyc/kycService';

const nestInArray = (arg: ValidArgType | ValidArgType[]): NestedArray => {
  return {
    type: 'nestedArray',
    args: Array.isArray(arg) ? arg : [arg],
  };
};

export const TX: Record<string, TXLego> = {
  POST_SIGNAL: buildMultiCallTX({
    id: 'POST_SIGNAL',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: `.formValues.title`,
        description: `.formValues.description`,
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.Signal },
      },
    },
    actions: [
      {
        contract: CONTRACT.POSTER,
        method: 'post',
        operations: { type: 'static', value: 0 },
        args: [
          {
            type: 'JSONDetails',
            jsonSchema: {
              daoId: '.daoId',
              table: { type: 'static', value: 'signal' },
              queryType: { type: 'static', value: 'list' },
              title: `.formValues.title`,
              description: `.formValues.description`,
              link: `.formValues.link`,
            },
          },
          { type: 'static', value: POSTER_TAGS.daoDatabaseProposal },
        ],
      },
    ],
  }),
  APPROVE_TOKEN: {
    id: 'APPROVE_TOKEN',
    contract: CONTRACT.ERC_20,
    method: 'approve',
    args: [
      { type: 'singleton', keychain: CONTRACT_KEYCHAINS.TRIBUTE_MINION },
      { type: 'static', value: MaxUint256 },
    ],
  },
  // added for purposes of RobinHoodDAO
  MINT_MEMBERSHIP: {
    id: 'MINT_MEMBERSHIP',
    contract: CONTRACT.MEMBERSHIP_NFT,
    method: 'mint',
    args: [],
    disablePoll: true,
    customPoll: {},
    persist: {
      saveInDatabase: async (formValues: any, nftId: number) => {
        const kycService = new KycService(new SupabaseKycRepository());
        try {
          kycService.createAndEncryptUser(formValues, nftId);
        } catch (error) {
          console.log('Error persisting kyc information');
        }
      },
    },
  },

  ISSUE: buildMultiCallTX({
    id: 'ISSUE',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.IssueSharesLoot,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'mintShares',
        args: [
          nestInArray('.formValues.recipient'),
          nestInArray('.formValues.sharesRequested'),
        ],
      },
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'mintLoot',
        args: [
          nestInArray('.formValues.recipient'),
          nestInArray('.formValues.lootRequested'),
        ],
      },
    ],
  }),
  ISSUE_SHARES: buildMultiCallTX({
    id: 'ISSUE',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.IssueSharesLoot,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'mintShares',
        args: [
          '.formValues.addressesAndAmounts.recipients',
          '.formValues.addressesAndAmounts.values',
        ],
      },
    ],
  }),
  ADD_SHAMAN: buildMultiCallTX({
    id: 'ADD_SHAMAN',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.AddShaman },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'setShamans',
        args: [
          nestInArray('.formValues.shamanAddress'),
          nestInArray('.formValues.shamanPermission'),
        ],
      },
    ],
  }),
  ISSUE_ERC20: buildMultiCallTX({
    id: 'ISSUE_ERC20',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.TransferErc20,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.ERC_20_FUNDING,
        method: 'transfer',
        args: ['.formValues.recipient', '.formValues.paymentTokenAmt'],
      },
    ],
  }),
  ISSUE_ERC20_SIDECAR: buildMultiCallTX({
    id: 'ISSUE_ERC20_SIDECAR',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.TransferErc20,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'executeAsBaal',
        args: [
          '.formValues.safeAddress',
          { type: 'static', value: '0' },
          {
            type: 'encodeCall',
            action: {
              contract: CONTRACT.GNOSIS_MODULE,
              method: 'execTransactionFromModule',
              args: [
                {
                  type: 'singleton',
                  keychain: CONTRACT_KEYCHAINS.GNOSIS_MULTISEND,
                },
                { type: 'static', value: '0' },
                {
                  type: 'multicall',
                  actions: [
                    {
                      contract: CONTRACT.ERC_20_FUNDING,
                      method: 'transfer',
                      args: [
                        '.formValues.recipient',
                        '.formValues.paymentTokenAmt',
                      ],
                    },
                  ],
                },
                { type: 'static', value: '1' },
              ],
            },
          },
        ],
      },
    ],
  }),
  ISSUE_NETWORK_TOKEN: buildMultiCallTX({
    id: 'ISSUE_NETWORK_TOKEN',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.TransferNetworkToken,
        },
      },
    },
    actions: [
      {
        contract: {
          type: 'static',
          contractName: 'NETWORK',
          abi: LOCAL_ABI.ERC20,
          targetAddress: '.formValues.recipient',
        },
        method: 'noMethod',
        args: [],
        value: '.formValues.paymentAmount',
        data: {
          type: 'static',
          value: '0x',
        },
      },
    ],
  }),
  ISSUE_NETWORK_TOKEN_SIDECAR: buildMultiCallTX({
    id: 'ISSUE_NETWORK_TOKEN_SIDECAR',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.TransferNetworkToken,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'executeAsBaal',
        args: [
          '.formValues.safeAddress',
          { type: 'static', value: '0' },
          {
            type: 'encodeCall',
            action: {
              contract: CONTRACT.GNOSIS_MODULE,
              method: 'execTransactionFromModule',
              args: [
                {
                  type: 'singleton',
                  keychain: CONTRACT_KEYCHAINS.GNOSIS_MULTISEND,
                },
                { type: 'static', value: '0' },
                {
                  type: 'multicall',
                  actions: [
                    {
                      contract: {
                        type: 'static',
                        contractName: 'NETWORK',
                        abi: LOCAL_ABI.ERC20,
                        targetAddress: '.formValues.recipient',
                      },
                      method: 'noMethod',
                      args: [],
                      value: '.formValues.paymentAmount',
                      data: {
                        type: 'static',
                        value: '0x',
                      },
                    },
                  ],
                },
                { type: 'static', value: '1' },
              ],
            },
          },
        ],
      },
    ],
  }),
  UPDATE_METADATA_SETTINGS: {
    id: 'UPDATE_METADATA_SETTINGS',
    contract: CONTRACT.POSTER,
    method: 'post',
    args: [
      {
        type: 'JSONDetails',
        jsonSchema: {
          daoId: '.daoId',
          table: { type: 'static', value: 'daoProfile' },
          queryType: { type: 'static', value: 'latest' },
          name: '.formValues.name',
          description: '.formValues.description',
          longDescription: '.formValues.long_description',
          avatarImg: '.formValues.icon',
          tags: '.formValues.tags',
          links: {
            type: 'nestedArray',
            args: [
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.discord',
                  label: { type: 'static', value: 'Discord' },
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.github',
                  label: { type: 'static', value: 'Github' },
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.blog',
                  label: { type: 'static', value: 'Blog' },
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.telegram',
                  label: { type: 'static', value: 'Telegram' },
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.twitter',
                  label: { type: 'static', value: 'Twitter' },
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.web',
                  label: { type: 'static', value: 'Web' },
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.custom1',
                  label: '.formValues.custom1Label',
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.custom2',
                  label: '.formValues.custom2Label',
                },
              },
              {
                type: 'JSONDetails',
                jsonSchema: {
                  url: '.formValues.custom3',
                  label: '.formValues.custom3Label',
                },
              },
            ],
          },
        },
      },
      { type: 'static', value: POSTER_TAGS.daoProfileUpdate },
    ],
  },
  UPDATE_GOV_SETTINGS: buildMultiCallTX({
    id: 'UPDATE_GOV_SETTINGS',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.UpdateGovSettings,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'setGovernanceConfig',
        args: [
          {
            type: 'argEncode',
            args: [
              '.formValues.votingPeriodInSeconds',
              '.formValues.gracePeriodInSeconds',
              '.formValues.newOffering',
              '.formValues.quorum',
              '.formValues.sponsorThreshold',
              '.formValues.minRetention',
            ],
            solidityTypes: [
              'uint32',
              'uint32',
              'uint256',
              'uint256',
              'uint256',
              'uint256',
            ],
          },
        ],
      },
    ],
  }),
  TOKEN_SETTINGS: buildMultiCallTX({
    id: 'TOKEN_SETTINGS',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        vTokenTransferable: '.formValues.vStake',
        nvTokenTransferable: '.formValues.nvStake',
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.UpdateTokenSettings,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'setAdminConfig',
        args: ['.formValues.vStake', '.formValues.nvStake'],
      },
    ],
  }),
  TOKENS_FOR_SHARES: {
    id: 'TOKENS_FOR_SHARES',
    contract: CONTRACT.TRIBUTE_MINION,
    method: 'submitTributeProposal',
    args: [
      '.daoId',
      '.formValues.tokenAddress',
      '.formValues.tokenAmount',
      '.formValues.sharesRequested',
      '.formValues.lootRequested',
      {
        type: 'proposalExpiry',
        search: '.formValues.proposalExpiry',
        fallback: 0,
      },
      {
        type: 'static',
        value: '0',
      },
      {
        type: 'JSONDetails',
        jsonSchema: {
          title: '.formValues.title',
          description: '.formValues.description',
          contentURI: `.formValues.link`,
          contentURIType: { type: 'static', value: 'url' },
          proposalType: {
            type: 'static',
            value: ProposalTypeIds.TokensForShares,
          },
        },
      },
    ],
  },
  GUILDKICK: buildMultiCallTX({
    id: 'GUILDKICK',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        link: '.formValues.link',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.GuildKick },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'mintLoot',
        args: [
          {
            type: 'nestedArray',
            args: ['.formValues.memberAddress'],
          },
          {
            type: 'nestedArray',
            args: ['.formValues.memberShares'],
          },
        ],
      },
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'burnShares',
        args: [
          {
            type: 'nestedArray',
            args: ['.formValues.memberAddress'],
          },
          {
            type: 'nestedArray',
            args: ['.formValues.memberShares'],
          },
        ],
      },
    ],
  }),
  MANAGE_DELEGATE: {
    id: 'MANAGE_DELEGATE',
    contract: CONTRACT.SHARES_ERC20,
    method: 'delegate',
    args: ['.formValues.delegatingTo'],
  },
  RAGEQUIT: {
    id: 'RAGEQUIT',
    contract: CONTRACT.CURRENT_DAO,
    method: 'ragequit',
    args: [
      '.formValues.to',
      '.formValues.sharesToBurn',
      '.formValues.lootToBurn',
      '.formValues.tokens',
    ],
  },
  WALLETCONNECT: buildMultiCallTX({
    id: 'WALLETCONNECT',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        link: '.formValues.link',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.WalletConnect },
      },
    },
    actions: [
      {
        contract: {
          type: 'static',
          contractName: 'ACE',
          abi: [],
          targetAddress: '.formValues.txTo',
        },
        args: [],
        method: 'noMethod',
        value: '.formValues.txValue',
        data: '.formValues.txData',
        operations: '.formValues.txOperation',
      },
    ],
  }),
  ADD_SAFE: {
    id: 'ADD_SAFE',
    contract: CONTRACT.VAULT_SUMMONER,
    method: 'summonVault',
    args: ['.daoId', '.formValues.name'],
  },
  MULTICALL: buildMultiCallTX({
    id: 'MULTICALL',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        link: '.formValues.link',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.Multicall },
      },
    },
    actions: [], // TODO: refactor: argtype
    formActions: true,
  }),
  MULTICALL_SIDECAR: buildMultiCallTX({
    id: 'MULTICALL_SIDECAR',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        link: '.formValues.link',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: ProposalTypeIds.Multicall },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'executeAsBaal',
        args: [
          '.formValues.safeAddress',
          { type: 'static', value: '0' },
          {
            type: 'encodeCall',
            action: {
              contract: CONTRACT.GNOSIS_MODULE,
              method: 'execTransactionFromModule',
              args: [
                {
                  type: 'singleton',
                  keychain: CONTRACT_KEYCHAINS.GNOSIS_MULTISEND,
                },
                { type: 'static', value: '0' },
                {
                  type: 'multicall',
                  actions: [],
                  formActions: true,
                },
                { type: 'static', value: '1' },
              ],
            },
          },
        ],
      },
    ],
  }),
  ADD_SIGNER_TO_SIDECAR: buildMultiCallTX({
    id: 'ADD_SIGNER_TO_SIDECAR',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: {
          type: 'static',
          value: ProposalTypeIds.AddSigner,
        },
      },
    },
    actions: [
      {
        contract: CONTRACT.CURRENT_DAO,
        method: 'executeAsBaal',
        args: [
          '.formValues.safeAddress',
          { type: 'static', value: '0' },
          {
            type: 'encodeCall',
            action: {
              contract: CONTRACT.GNOSIS_MODULE,
              method: 'execTransactionFromModule',
              args: [
                {
                  type: 'singleton',
                  keychain: CONTRACT_KEYCHAINS.GNOSIS_MULTISEND,
                },
                { type: 'static', value: '0' },
                {
                  type: 'multicall',
                  actions: [
                    {
                      contract: CONTRACT.GNOSIS_MODULE,
                      method: 'addOwnerWithThreshold',
                      args: ['.formValues.signer', '.formValues.threshold'],
                    },
                  ],
                },
                { type: 'static', value: '1' },
              ],
            },
          },
        ],
      },
    ],
  }),
};

export const TABULA_TX: Record<string, TXLego> = {
  CREATE_PUBLICATION: buildMultiCallTX({
    id: 'CREATE_PUBLICATION',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: 'Create Publication Proposal' },
      },
    },
    actions: [
      {
        contract: CONTRACT.POSTER,
        method: 'post',
        args: [
          {
            type: 'JSONDetails',
            jsonSchema: {
              action: { type: 'static', value: TABULA_TAGS.PUB_ACTION },
              title: '.formValues.pubName',
              tags: '.formValues.tags',
              description: '.formValues.pubDescription',
              image: '.formValues.pubImage',
            },
          },
          { type: 'static', value: TABULA_TAGS.PUBLICATION },
        ],
      },
    ],
  }),
  CREATE_ARTICLE: buildMultiCallTX({
    id: 'CREATE_ARTICLE',
    JSONDetails: {
      type: 'JSONDetails',
      jsonSchema: {
        title: '.formValues.title',
        description: '.formValues.description',
        contentURI: `.formValues.link`,
        contentURIType: { type: 'static', value: 'url' },
        proposalType: { type: 'static', value: 'Create Article Proposal' },
      },
    },
    actions: [
      {
        contract: CONTRACT.POSTER,
        method: 'post',
        args: [
          {
            type: 'JSONDetails',
            jsonSchema: {
              action: { type: 'static', value: TABULA_TAGS.ARTICLE_ACTION },
              publicationId: '.formValues.pubId',
              article: { type: 'ipfsPinata', content: '.formValues.article' },
              title: '.formValues.articleTitle',
            },
          },
          { type: 'static', value: TABULA_TAGS.PUBLICATION },
        ],
      },
    ],
  }),
};

export const ACTION_TX: Record<string, TXLegoBase> = {
  SPONSOR: {
    id: 'SPONSOR',
    contract: CONTRACT.CURRENT_DAO,
    method: 'sponsorProposal',
  },
  VOTE: {
    id: 'VOTE',
    contract: CONTRACT.CURRENT_DAO,
    method: 'submitVote',
  },
  PROCESS: {
    id: 'PROCESS',
    contract: CONTRACT.CURRENT_DAO,
    method: 'processProposal',
  },
  CANCEL: {
    id: 'CANCEL',
    contract: CONTRACT.CURRENT_DAO,
    method: 'cancelProposal',
  },
  // added for purposes of RobinHoodDAO
  MINT_MEMBERSHIP: {
    id: 'MINT_MEMBERSHIP',
    contract: CONTRACT.MEMBERSHIP_NFT,
    method: 'mint',
  },
};
