import styled from 'styled-components';
import { Card, widthQuery } from '@daohaus/ui';

export const MemberContainer = styled(Card)`
  padding: 3rem;
  border: none;
  margin-bottom: 3rem;
  min-height: 20rem;
  width: 100%;
  overflow-x: auto;
  th {
    min-width: 10rem;
  }
  .hide-sm {
    button {
      padding-left: 0.5rem;
    }
  }
  @media ${widthQuery.lg} {
    max-width: 100%;
    min-width: 0;
  }
  @media ${widthQuery.md} {
    .hide-sm {
      display: none;
    }
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AlertContainer = styled(Card)`
  display: flex;
  gap: 3rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2.3rem 2.5rem;
  border: none;
  min-height: 23.8rem;

  @media ${widthQuery.sm} {
    gap: 2rem;
    height: auto;
    margin-bottom: 2rem;
  }
`;
