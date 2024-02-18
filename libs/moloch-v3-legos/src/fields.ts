import { MolochFieldLego } from '@daohaus/moloch-v3-fields';

export const FIELD: Record<string, MolochFieldLego> = {
  TITLE: {
    id: 'title',
    type: 'input',
    label: 'Proposal Title',
    placeholder: 'Enter title',
  },
  DESCRIPTION: {
    id: 'description',
    type: 'markdownField',
    label: 'Description',
    placeholder: 'Enter description',
  },
  LINK: {
    id: 'link',
    type: 'input',
    label: 'Link',
    placeholder: 'http://',
    expectType: 'url',
  },
  METADATA_LINK: {
    id: 'metadataLink',
    type: 'metadataLink',
    label: 'Link',
    placeholder: 'http://',
    expectType: 'url',
  },
  SHAMAN_ADDRESS: {
    id: 'shamanAddress',
    type: 'input',
    label: 'Shaman Address',
    placeholder: '0x1234...5678',
  },
  SHAMAN_PERMISSION: {
    id: 'shamanPermission',
    type: 'shamanPermissions',
    label: 'Shaman Permission',
  },
  SHAMAN_DELUXE: {
    id: 'shamanPermission',
    type: 'shamanPermissionDeluxe',
    label: 'Shaman Permission',
  },
  TRIBUTE: {
    id: 'tribute',
    type: 'tributeInput',
    label: 'Tribute',
  },
  REQUEST_TOKEN: {
    id: 'payment',
    type: 'requestERC20',
    label: 'Requested ERC20',
  },
  REQUEST_NATIVE_TOKEN: {
    id: 'paymentAmount',
    type: 'requestNativeToken',
  },
  RAGEQUIT_TOKEN: {
    id: 'sharesToBurn',
    type: 'ragequitToken',
  },
  TO_WEI: {
    id: 'shouldOverwrite',
    type: 'toWeiInput',
    label: 'Should Overwrite',
  },
  NAME: {
    id: 'name',
    type: 'input',
    label: 'DAO Name',
    placeholder: 'DAO Name',
  },
  TAGS: {
    id: 'tags',
    type: 'tagsInput',
    label: 'Tags (separated by commas)',
    placeholder: 'DAO Name',
  },
  DELEGATE: {
    id: 'delegatingTo',
    type: 'delegateInput',
    label: 'Delegate to',
    placeholder: '0x0...',
  },
  PROPOSAL_EXPIRY: {
    id: 'checkRender',
    type: 'checkRender',
    gateLabel: 'Add Expiration Date',
    components: [
      {
        id: 'proposalExpiry',
        type: 'proposalExpiry',
        defaultValue: '0',
        label: 'Expiration',
      },
    ],
  },

  APPLICANT: {
    id: 'applicantAddress',
    type: 'selectApplicant',
    label: 'Applicant',
    daoMemberOnly: false,
  },
  PROP_OFFERING: {
    id: 'proposalOffering',
    type: 'proposalOffering',
  },
  WALLETCONNECT_LINKER: {
    id: 'walletConnectLink',
    type: 'walletConnectLink',
    label: 'WalletConnect Link',
    info: 'After connecting WalletConnect to another dApp, copy the link and paste it to this input field',
    placeholder: 'wc:',
  },
  SAFE_SELECT: {
    id: 'safeAddress',
    type: 'safeSelect',
    label: 'Safe Name',
    placeholder: 'Select',
  },
  ADDRESSES_AMOUNTS: {
    id: 'addressesAndAmounts',
    type: 'addressesAndAmounts',
    label: 'Addresses & Amounts',
  },
  // added for purposes of RobinHoodDAO
  FULL_NAME: {
    id:'fullName', 
    type: 'input',
    label: 'Name and Surname',
    placeholder: 'Enter name and surname',
  },
  // added for purposes of RobinHoodDAO
  E_MAIL:{
    id:'email', 
    type: 'input',
    label: 'Email address',
    placeholder: 'Enter email address',
  },
  // added for purposes of RobinHoodDAO
  PHONE_NUMBER:{
    id:'phoneNumber', 
    type: 'input',
    label: 'Phone number',
    placeholder: 'Enter phone number',
  },
  // added for purposes of RobinHoodDAO
  // technical debt - checkRender components are adding unnecessary spacing
  GDPR_CONSENT: {
    id: 'gdprConsent',
    type: 'checkRender',
    label: 'GDPR consent',
    gateLabel: 'I consent to the processing of my personal data as required for compliance with legal obligations.',
    components: [
      // {
      //   id: 'proposalExpiry',
      //   type: 'proposalExpiry',
      //   defaultValue: '0',
      //   label: 'Expiration',
      // },
    ],
  },
};
