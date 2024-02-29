import { SUMMON_COPY } from '@daohaus/utils';
import { MolochFormLego } from '@daohaus/moloch-v3-fields';
import { FIELD } from './fields';
import { TABULA_TX, TX } from './tx';

export const getFormLegoById = (
  id: MolochFormLego['id']
): MolochFormLego | undefined => {
  const allForms = { ...PROPOSAL_FORMS, ...COMMON_FORMS };
  const formKey = Object.keys(allForms).find((key) => {
    return allForms[key].id === id;
  });
  if (!formKey) return;
  return allForms[formKey];
};

// Proposal settings fields (e.g. proposal expiry, proposal offering)
const PROPOSAL_SETTINGS_FIELDS = [FIELD.PROPOSAL_EXPIRY, FIELD.PROP_OFFERING];

/*
Quick Reference for forms

PROPOSAL_FORMS KEYS
- SHARE_SWAP
- SIGNAL
- BECOME_A_MEMBER /* added for purposes of RobinHoodDAO, and initial ADD_MEMBER should be removed
- ISSUE
- ADD_SHAMAN
- TRANSFER_ERC20
- TRANSFER_NETWORK_TOKEN
- UPDATE_GOV_SETTINGS
- TOKEN_SETTINGS
- TOKENS_FOR_SHARES
- GUILDKICK
- CREATE_PUBLICATION
- CREATE_ARTICLE

COMMON_FORMS KEYS
- METADATA_SETTINGS
- UPDATE_SHAMAN
*/

export const PROPOSAL_FORMS: Record<string, MolochFormLego> = {
  SIGNAL: {
    id: 'SIGNAL',
    title: 'Signal Request',
    subtitle: 'Signal Proposal',
    description: 'Request an on-chain member vote.',
    requiredFields: { title: true, description: true },
    tx: TX.POST_SIGNAL,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  ISSUE: {
    id: 'ISSUE',
    title: 'DAO Token Request',
    subtitle: 'Token Proposal',
    description: 'Request voting or non-voting tokens from the DAO.',
    tx: TX.ISSUE,
    requiredFields: {
      title: true,
      description: true,
      sharesRequested: true,
      lootRequested: true,
      recipient: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'recipient',
        type: 'input',
        label: 'Recipient',
        expectType: 'ethAddress',
        placeholder: '0x...',
      },
      {
        ...FIELD.TO_WEI,
        label: 'Voting Token Requested',
        id: 'sharesRequested',
      },
      {
        ...FIELD.TO_WEI,
        label: 'Non-Voting Token Requested',
        id: 'lootRequested',
      },
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  ADD_SHAMAN: {
    id: 'ADD_SHAMAN',
    title: 'Add Shaman',
    description: 'Grant DAO permissions to an external contract.',
    subtitle: 'Shaman Proposal',
    requiredFields: {
      title: true,
      description: true,
      shamanAddress: true,
      shamanPermission: true,
    },
    tx: TX.ADD_SHAMAN,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      FIELD.SHAMAN_ADDRESS,
      FIELD.SHAMAN_PERMISSION,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  TRANSFER_ERC20: {
    id: 'TRANSFER_ERC20',
    title: 'ERC-20 Token Transfer',
    subtitle: 'Funding Proposal',
    description: 'Request ERC-20 tokens from the DAO treasury.',
    tx: TX.ISSUE_ERC20,
    requiredFields: {
      title: true,
      description: true,
      payment: true,
      recipient: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'recipient',
        type: 'input',
        label: 'Recipient',
        info: 'Address to receive the tokens',
        placeholder: '0x...',
      },
      FIELD.REQUEST_TOKEN,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  TRANSFER_ERC20_SIDECAR: {
    id: 'TRANSFER_ERC20_SIDECAR',
    title: 'Transfer ERC-20',
    subtitle: 'Transfer Proposal',
    description:
      'Create a proposal to transfer ERC-20 tokens from the DAO safe',
    tx: TX.ISSUE_ERC20_SIDECAR,
    requiredFields: {
      title: true,
      description: true,
      payment: true,
      recipient: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      FIELD.SAFE_SELECT,
      {
        id: 'recipient',
        type: 'input',
        label: 'Recipient',
        info: 'Address to receive the tokens',
        placeholder: '0x...',
      },
      FIELD.REQUEST_TOKEN,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  TRANSFER_NETWORK_TOKEN: {
    id: 'TRANSFER_NETWORK_TOKEN',
    title: 'Network Token Transfer',
    subtitle: 'Funding Proposal',
    description: "Request network's native token from the DAO treasury.",
    tx: TX.ISSUE_NETWORK_TOKEN,
    requiredFields: {
      title: true,
      description: true,
      payment: true,
      recipient: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'recipient',
        type: 'input',
        label: 'Recipient',
        info: 'Address to receive the tokens',
        placeholder: '0x...',
      },
      FIELD.REQUEST_NATIVE_TOKEN,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  TRANSFER_NETWORK_TOKEN_SIDECAR: {
    id: 'TRANSFER_NETWORK_TOKEN_SIDECAR',
    title: 'Network Token Transfer',
    subtitle: 'Funding Proposal',
    description: "Request network's native token from the DAO safe.",
    tx: TX.ISSUE_NETWORK_TOKEN_SIDECAR,
    requiredFields: {
      title: true,
      description: true,
      payment: true,
      recipient: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      FIELD.SAFE_SELECT,
      {
        id: 'recipient',
        type: 'input',
        label: 'Recipient',
        info: 'Address to receive the tokens',
        placeholder: '0x...',
      },
      FIELD.REQUEST_NATIVE_TOKEN,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  UPDATE_GOV_SETTINGS: {
    id: 'UPDATE_GOV_SETTINGS',
    title: 'Update Governance Settings',
    subtitle: 'Governance Proposal',
    description: 'Change proposal timing or advanced governance settings.',
    tx: TX.UPDATE_GOV_SETTINGS,
    requiredFields: {
      title: true,
      description: true,
      votingPeriod: true,
      gracePeriod: true,
      quorum: true,
      minRetention: true,
      sponsorThreshold: true,
      newOffering: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'timing',
        type: 'formSegment',
        title: 'Proposal Timing',
        description: 'Update your timing for Voting and Grace periods.',
        fields: [
          {
            id: 'timingSplit',
            type: 'splitColumn',
            rows: [
              {
                rowId: 'timingRows',
                left: {
                  id: 'votingPeriod',
                  type: 'timePicker',
                  label: 'Voting Period',
                  info: SUMMON_COPY.VOTING_PERIOD,
                },
                right: {
                  id: 'gracePeriod',
                  type: 'timePicker',
                  label: 'Grace Period',
                  info: SUMMON_COPY.GRACE_PERIOD,
                },
              },
            ],
          },
        ],
      },
      {
        id: 'advanced',
        type: 'formSegment',
        title: 'Advanced Governance',
        description: 'Modify some advanced governance features.',
        fields: [
          {
            id: 'advancedSplit',
            type: 'splitColumn',
            rows: [
              {
                rowId: 'row1',
                left: {
                  id: 'quorum',
                  type: 'input',
                  expectType: 'percent',
                  label: 'Quorum %',
                  placeholder: '20',
                  info: SUMMON_COPY.QUORUM,
                },
                right: {
                  id: 'minRetention',
                  type: 'input',
                  label: 'Min Retention',
                  expectType: 'percent',
                  placeholder: '66',
                  info: SUMMON_COPY.MIN_RETENTION,
                },
              },
              {
                rowId: 'row2',
                left: {
                  id: 'sponsorThreshold',
                  type: 'toWeiInput',
                  expectType: 'number',
                  label: 'Sponsor Threshold',
                  placeholder: '1',
                  info: SUMMON_COPY.SPONSOR_THRESHOLD,
                },
                right: {
                  id: 'newOffering',
                  type: 'toWeiInput',
                  label: 'New Offering',
                  expectType: 'number',
                  placeholder: '0',
                  info: SUMMON_COPY.NEW_OFFERING,
                },
              },
            ],
          },
        ],
      },
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  TOKEN_SETTINGS: {
    id: 'TOKEN_SETTINGS',
    title: 'Update Token Settings',
    subtitle: 'Token Proposal',
    description: 'Change transferability of voting or non-voting tokens.',
    tx: TX.TOKEN_SETTINGS,
    requiredFields: {
      title: true,
      description: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'tokenSettings',
        type: 'formSegment',
        title: 'DAO Tokens',
        description: 'Update Token Transferability',
        fields: [
          {
            id: 'split',
            type: 'splitColumn',
            rows: [
              {
                rowId: 'row1',
                left: {
                  id: 'vStake',
                  type: 'switch',
                  label: 'Voting Token',
                  info: SUMMON_COPY.STAKE_TRANSFER,
                  switches: [
                    {
                      id: 'vStake',
                      fieldLabel: {
                        off: 'Transferable',
                        on: 'Not Transferable',
                      },
                    },
                  ],
                },
                right: {
                  id: 'nvStake',
                  type: 'switch',
                  label: 'Non-Voting Token',
                  info: SUMMON_COPY.NV_STAKE_TRANSFER,
                  switches: [
                    {
                      id: 'nvStake',
                      fieldLabel: {
                        off: 'Transferable',
                        on: 'Not Transferable',
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  TOKENS_FOR_SHARES: {
    id: 'TOKENS_FOR_SHARES',
    title: 'DAO Token Swap',
    description:
      'Request voting or non-voting tokens from the DAO in exchange for tokens.',
    subtitle: 'Token Proposal',
    tx: TX.TOKENS_FOR_SHARES,
    requiredFields: {
      title: true,
      description: true,
      sharesRequested: true,
      lootRequested: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        ...FIELD.TO_WEI,
        label: 'Voting Token Requested',
        id: 'sharesRequested',
      },
      {
        ...FIELD.TO_WEI,
        label: 'Non-Voting Token Requested',
        id: 'lootRequested',
      },
      FIELD.TRIBUTE,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  GUILDKICK: {
    id: 'GUILDKICK',
    title: 'Remove Member',
    subtitle: 'Token Proposal',
    description: 'Change a member’s voting tokens into non-voting tokens.',
    tx: TX.GUILDKICK,
    requiredFields: {
      title: true,
      memberAddress: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'memberAddress',
        type: 'selectApplicant',
        label: 'Member',
        daoMemberOnly: true,
      },
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  WALLETCONNECT: {
    id: 'WALLETCONNECT',
    title: 'Use WalletConnect',
    subtitle: 'WalletConnect Proposal',
    description: 'Interact with external contracts and applications.',
    tx: TX.WALLETCONNECT,
    requiredFields: {
      title: true,
      walletConnectLink: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      FIELD.WALLETCONNECT_LINKER,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  MULTICALL_BUILDER: {
    id: 'MULTICALL',
    title: 'Multicall Proposal Builder',
    subtitle: 'Multicall Proposal', // TODO:
    description: 'Use the transaction builder to propose a multicall proposal.', // TODO:
    tx: TX.MULTICALL,
    requiredFields: {
      title: true,
    },
    fields: [
      {
        id: 'details',
        type: 'formSegment',
        collapsible: true,
        defaultOpen: true,
        title: 'Proposal Overview', // TODO:
        fields: [
          FIELD.TITLE,
          FIELD.DESCRIPTION,
          FIELD.LINK,
          ...PROPOSAL_SETTINGS_FIELDS,
        ],
      },
      {
        id: 'multisendActions',
        type: 'multisendActions',
      },
    ],
  },
  MULTICALL_BUILDER_SIDECAR: {
    id: 'MULTICALL_SIDECAR',
    title: 'Multicall Proposal Builder',
    subtitle: 'Multicall Proposal', // TODO:
    description: 'Use the transaction builder to propose a multicall proposal.', // TODO:
    tx: TX.MULTICALL_SIDECAR,
    requiredFields: {
      title: true,
    },
    fields: [
      {
        id: 'details',
        type: 'formSegment',
        collapsible: true,
        defaultOpen: true,
        title: 'Proposal Overview', // TODO:
        fields: [
          FIELD.TITLE,
          FIELD.DESCRIPTION,
          FIELD.LINK,
          ...PROPOSAL_SETTINGS_FIELDS,
        ],
      },
      {
        id: 'multisendActions',
        type: 'multisendActions',
      },
    ],
  },
  ADD_SIGNER_TO_SIDECAR: {
    id: 'ADD_SIGNER_TO_SIDECAR',
    title: 'Add Signer to Safe',
    description: 'Create a proposal to tadd a signer to a DAO Safe',
    tx: TX.ADD_SIGNER_TO_SIDECAR,
    devtool: true,
    log: true,
    requiredFields: {
      title: true,
      description: true,
      signer: true,
      threshold: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      FIELD.SAFE_SELECT,
      {
        id: 'signer',
        type: 'input',
        label: 'Signer',
        info: 'Signer Address',
        expectType: 'ethAddress',
        placeholder: '0x...',
      },
      {
        id: 'threshold',
        type: 'input',
        label: 'Threshold (1 for 1/1 signers)',
        expectType: 'number',
        placeholder: '1',
      },
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  ISSUE_SHARES: {
    id: 'ISSUE_SHARES',
    title: 'DAO Token Request',
    subtitle: 'Token Proposal',
    description: 'Request voting tokens from the DAO for multiple addresses.',
    tx: TX.ISSUE_SHARES,
    log: true,
    requiredFields: {
      title: true,
      description: true,
      addressesAndAmounts: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      FIELD.ADDRESSES_AMOUNTS,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
};

export const TABULA_FORMS: Record<string, MolochFormLego> = {
  CREATE_PUBLICATION: {
    id: 'CREATE_PUBLICATION',
    title: 'Start Publication',
    subtitle: 'Publication Proposal',
    description: 'Start a new DAO publication on Tabula.gg',
    tx: TABULA_TX.CREATE_PUBLICATION,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'pubData',
        type: 'formSegment',
        title: 'Publication Data',
        description: 'Some information about your publication.',
        fields: [
          {
            id: 'pubName',
            type: 'input',
            label: 'Publication Name',
            placeholder: 'Name',
          },
          {
            id: 'tags',
            type: 'csInput',
            label: 'Publication Name',
            placeholder: 'comma, separated, tags',
            itemNoun: {
              singular: 'tag',
              plural: 'tags',
            },
          },
          {
            id: 'pubDescription',
            type: 'textarea',
            label: 'Publication Description',
            placeholder: 'Description',
          },
          {
            id: 'pubImage',
            type: 'input',
            label: 'Publication Image',
            placeholder: 'Image URL',
            expectType: 'url',
          },
        ],
      },
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  CREATE_ARTICLE: {
    id: 'CREATE_ARTICLE',
    title: 'Write an Article',
    subtitle: 'Tabula Article Proposal',
    description: 'Write an article on Tabula.gg',
    tx: TABULA_TX.CREATE_ARTICLE,
    requiredFields: {
      title: true,
      description: true,
      articleTitle: true,
      fakeMD: true,
      pub_id: true,
    },
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      {
        id: 'pubData',
        type: 'formSegment',
        title: 'Publication Data',
        description: 'Some information about your publication.',
        fields: [
          {
            id: 'articleTitle',
            type: 'input',
            label: 'Article Title',
            placeholder: "ex. 10 Signs You're a Real Champ",
          },
          FIELD.FAKE_MD,
        ],
      },
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
};

export const COMMON_FORMS: Record<string, MolochFormLego> = {
  METADATA_SETTINGS: {
    id: 'METADATA_SETTINGS',
    title: 'Update Metadata Settings',
    subtitle: 'Settings',
    requiredFields: { name: true },
    tx: TX.UPDATE_METADATA_SETTINGS,
    fields: [
      FIELD.NAME,
      FIELD.DESCRIPTION,
      {
        ...FIELD.DESCRIPTION,
        id: 'long_description',
        label: 'Long Description',
      },
      { ...FIELD.LINK, id: 'icon', label: 'Icon' },
      {
        id: 'links',
        type: 'formSegment',
        title: 'Add links to important content for your DAO',
        fields: [
          { ...FIELD.LINK, id: 'discord', label: 'Discord' },
          { ...FIELD.METADATA_LINK, id: 'github', label: 'Github' },
          { ...FIELD.METADATA_LINK, id: 'blog', label: 'Blog' },
          { ...FIELD.METADATA_LINK, id: 'telegram', label: 'Telegram' },
          { ...FIELD.METADATA_LINK, id: 'twitter', label: 'Twitter' },
          { ...FIELD.METADATA_LINK, id: 'web', label: 'Website' },
          { ...FIELD.METADATA_LINK, id: 'custom1', label: 'Custom Link 1' },
          { ...FIELD.METADATA_LINK, id: 'custom2', label: 'Custom Link 2' },
          { ...FIELD.METADATA_LINK, id: 'custom3', label: 'Custom Link 3' },
        ],
      },
      FIELD.TAGS,
    ],
  },
  UPDATE_SHAMAN: {
    id: 'UPDATE_SHAMAN',
    title: 'Update Shaman Settings',
    description: 'Reduce shaman permissions level.',
    subtitle: 'Shaman Proposal',
    requiredFields: {
      title: true,
      description: true,
      shamanAddress: true,
      shamanPermission: true,
    },
    tx: TX.ADD_SHAMAN,
    fields: [
      FIELD.TITLE,
      FIELD.DESCRIPTION,
      FIELD.LINK,
      { ...FIELD.SHAMAN_ADDRESS, disabled: true },
      FIELD.SHAMAN_DELUXE,
      ...PROPOSAL_SETTINGS_FIELDS,
    ],
  },
  MANAGE_DELEGATE: {
    id: 'MANAGE_DELEGATE',
    fields: [FIELD.DELEGATE],
    requiredFields: {
      delegatingTo: true,
    },
    submitButtonText: 'Update Delegate',
    tx: TX.MANAGE_DELEGATE,
  },
  RAGEQUIT: {
    id: 'RAGEQUIT',
    title: 'Ragequit',
    subtitle: 'Members',
    fields: [
      {
        id: 'tokenAmounts',
        type: 'formSegment',
        title: 'Step 1. Select voting and/or non-voting tokens to ragequit',
        fields: [
          {
            id: 'sharesToBurn',
            type: 'ragequitToken',
          },
          { id: 'lootToBurn', type: 'ragequitToken' },
        ],
      },
      {
        id: 'tokenAddresses',
        type: 'formSegment',
        title:
          'Step 2. Select treasury tokens you want to receive in exchange for your DAO tokens',
        fields: [{ id: 'tokens', type: 'ragequitTokenList' }],
      },
      {
        id: 'checkRender',
        type: 'checkRender',
        gateLabel: 'Ragequit to different address (optional)',
        components: [
          {
            id: 'to',
            type: 'input',
            label: 'Address to send funds',
            expectType: 'ethAddress',
            placeholder: '0x...',
          },
        ],
      },
    ],
    tx: TX.RAGEQUIT,
  },
  ADD_SAFE: {
    id: 'ADD_SAFE',
    description:
      'Create a new Gnosis Safe and attach to your DAO as a non-ragequittable vault.',
    requiredFields: {
      name: true,
    },
    tx: TX.ADD_SAFE,
    fields: [
      {
        id: 'name',
        type: 'input',
        label: 'Safe Name',
        placeholder: 'Enter name',
      },
    ],
    submitButtonText: 'Create',
  },
  // added for purposes of RobinHoodDAO
  // add physical address
  // add proof of address
  BECOME_A_MEMBER: {
    id: 'BECOME_A_MEMBER',
    title: 'Become a member',
    subtitle: 'Become a member',
    description:
      'Request membership by providing an information and minting an NFT in order to become a legally recognized member of a DAO.',
    requiredFields: {
      fullName: true,
      email: true,
      phoneNumber: true,
      gdprConsent: true,
    },
    // create transacction that will insert necessary data into supabase, and mint an NFT
    tx: TX.MINT_MEMBERSHIP,
    // add fields that are required for this operation ( full_name, email_address, phone_number, gdpr consent )
    fields: [
      FIELD.FULL_NAME,
      FIELD.E_MAIL,
      FIELD.PHONE_NUMBER,
      FIELD.GDPR_CONSENT,
      // {
      //   id: 'name',
      //   type: 'input',
      //   label: 'Safe Name',
      //   placeholder: 'Enter name',
      // },
    ],

    submitButtonText: 'Mint membership',
  },
};

export const BASIC_PROPOSAL_FORMS = {
  SIGNAL: PROPOSAL_FORMS.SIGNAL,
  ISSUE: PROPOSAL_FORMS.ISSUE,
  TOKENS_FOR_SHARES: PROPOSAL_FORMS.TOKENS_FOR_SHARES,
  TRANSFER_ERC20: PROPOSAL_FORMS.TRANSFER_ERC20,
  TRANSFER_NETWORK_TOKEN: PROPOSAL_FORMS.TRANSFER_NETWORK_TOKEN,
  // BECOME_A_MEMBER: PROPOSAL_FORMS.BECOME_A_MEMBER,
};

export const ADVANCED_PROPOSAL_FORMS = {
  WALLETCONNECT: PROPOSAL_FORMS.WALLETCONNECT,
  UPDATE_GOV_SETTINGS: PROPOSAL_FORMS.UPDATE_GOV_SETTINGS,
  TOKEN_SETTINGS: PROPOSAL_FORMS.TOKEN_SETTINGS,
  ADD_SHAMAN: PROPOSAL_FORMS.ADD_SHAMAN,
  GUILDKICK: PROPOSAL_FORMS.GUILDKICK,
  MULTICALL_BUILDER: PROPOSAL_FORMS.MULTICALL_BUILDER,
};
