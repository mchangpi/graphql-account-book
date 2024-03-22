import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import Cards from '../components/Cards';
import TransactionForm from '../components/TransactionForm';

import { MdLogout } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { LOGOUT } from '../graphql/mutations/user.mutation.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const chartData = {
    labels: ['Saving', 'Expense', 'Investment'],
    datasets: [
      {
        label: '%',
        data: [13, 8, 3],
        backgroundColor: [
          'rgba(75, 192, 192)',
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
        ],
        borderColor: [
          'rgba(75, 192, 192)',
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  };

  /* https://www.apollographql.com/docs/react/data/mutations */
  /* https://www.apollographql.com/docs/react/data/refetching/#clientrefetchqueries */
  const [logout, { loading, data }] = useMutation(LOGOUT, {
    refetchQueries: [
      'GetAuthenticatedUser',
    ] /* get null authUser after logging out */,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(error.message);
    }
  };

  if (data) console.log('logout data', data);

  return (
    <>
      <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-center justify-center gap-6">
        <div className="flex items-center">
          <p className="relative z-50 mb-4 mr-4 inline-block bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 bg-clip-text text-center text-2xl font-bold text-transparent md:text-4xl lg:text-4xl">
            Spend wisely, track wisely
          </p>
          <img
            src={'https://tecdn.b-cdn.net/img/new/avatars/2.webp'}
            className="h-11 w-11 cursor-pointer rounded-full border"
            alt="Avatar"
          />
          {!loading && (
            <MdLogout
              className="mx-2 h-5 w-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && (
            <div className="mx-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2"></div>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
            <Doughnut data={chartData} />
          </div>

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;
