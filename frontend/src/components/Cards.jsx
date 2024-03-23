import { useQuery } from '@apollo/client';
import Card from './Card';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query';

const Cards = () => {
  const { loading, data } = useQuery(GET_TRANSACTIONS);

  if (data) console.log('query txn data:', data);
  return (
    <div className="min-h-[40vh] w-full px-10">
      <p className="my-10 text-center text-5xl font-bold">History</p>
      <div className="mb-20 grid w-full grid-cols-1 justify-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          data?.transactions.map((transaction) => (
            <Card key={transaction._id} transaction={transaction} />
          ))}
      </div>
      {!loading && data?.transactions?.length === 0 && (
        <p className="w-full text-center text-2xl font-bold">
          No transaction history found.
        </p>
      )}
    </div>
  );
};
export default Cards;
