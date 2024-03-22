import { gql } from '@apollo/client';

/* // user.typeDef.js
type Query {
	authUser: User
	user(userId:ID!): User
}
*/

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authUser {
      _id
      username
      name
      profilePicture
    }
  }
`;
