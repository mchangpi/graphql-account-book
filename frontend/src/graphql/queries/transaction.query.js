import { gql } from '@apollo/client';

/* // transaction.typeDef.js
	type Query {
		transactions: [Transaction!]
		transaction(transactionId:ID!): Transaction
	}
*/

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      _id
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

/* transaction(transactionId:ID!): Transaction */
export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(transactionId: $id) {
      _id
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;
