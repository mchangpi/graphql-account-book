import { useQuery } from '@apollo/client';
import Card from './Card';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query';
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from '../graphql/queries/user.query';

const Cards = () => {
  const { loading, data: txnsData } = useQuery(GET_TRANSACTIONS);

  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  const { data: userAndTxnsData } = useQuery(GET_USER_AND_TRANSACTIONS, {
    variables: {
      userId: authUserData?.authUser?._id,
    },
  });

  if (txnsData) console.log('txns data:', txnsData);
  if (authUserData) console.log('auth user data:', authUserData);
  if (userAndTxnsData) console.log('user & txns data:', userAndTxnsData);

  return (
    <div className="min-h-[40vh] w-full px-10">
      <p className="my-10 text-center text-4xl font-bold">我的記帳本</p>
      <div className="mb-20 grid w-full grid-cols-1 justify-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          txnsData?.transactions.map((transaction) => (
            <Card
              key={transaction._id}
              transaction={transaction}
              authUser={authUserData?.authUser}
            />
          ))}
      </div>
      {!loading && txnsData?.transactions?.length === 0 && (
        <p className="w-full text-center text-2xl font-bold">
          No transaction history found.
        </p>
      )}
    </div>
  );
};
export default Cards;
