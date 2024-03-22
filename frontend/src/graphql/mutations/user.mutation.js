import { gql } from '@apollo/client';

/* // user.typeDef.js
type Mutation {
	signUp(input: SignUpInput!): User
	login(input: LoginInput!): User
	logout: LogoutResponse
} 
*/

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      _id
      name
      username
      gender
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      username
      gender
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
