import { gql } from 'apollo-boost';

export const directorsQuery = gql`
  query directorsQuery {
    directors{
      name
      age
      movies{
        name
      }
    }
  }
`;