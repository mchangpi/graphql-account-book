import Transaction from '../models/transaction.model.js';

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error('Unauthorized');
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error('Error getting transactions:', err);
        throw new Error('Error getting transactions');
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        // console.log('backend query txn:', transaction);
        return transaction;
      } catch (err) {
        console.error('Error getting transaction:', err);
        throw new Error('Error getting transaction');
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error('Error creating transaction:', err);
        throw new Error('Error creating transaction');
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTxn = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTxn;
      } catch (err) {
        console.error('Error updating transaction:', err);
        throw new Error('Error updatingtransaction');
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTxn = await Transaction.findByIdAndDelete(transactionId);
        return deletedTxn;
      } catch (err) {
        console.error('Error deleting transaction:', err);
        throw new Error('Error deleting transaction');
      }
    },
  },
};

export default transactionResolver;
