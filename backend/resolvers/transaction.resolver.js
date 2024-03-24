import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          // throw new Error('Unauthorized');
          return [];
        }
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
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error('Unauthorized');

      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      // const transactions = [
      // 	{ category: "expense", amount: 50 },
      // ];

      const categoryMap = {};
      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });
      // categoryMap = { expense: 125, investment: 100, saving: 50 }

      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
      // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
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
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error('Error getting user:', err);
        throw new Error('Error getting user');
      }
    },
  },
};

export default transactionResolver;
