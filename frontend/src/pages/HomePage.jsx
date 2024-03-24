import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import Cards from '../components/Cards';
import TransactionForm from '../components/TransactionForm';

import { MdLogout } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from '@apollo/client';
import { LOGOUT } from '../graphql/mutations/user.mutation.js';
import { GET_TRANSACTION_STATISTICS } from '../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query';
import { useEffect, useState } from 'react';

import { categoryZhTwMap } from '../utils/langMap.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const initChartData = {
  labels: [],
  datasets: [
    {
      label: '$',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
      borderRadius: 30,
      spacing: 10,
      cutout: 130,
    },
  ],
};

const bgColorMap = {
  saving: 'rgba(75, 192, 192)',
  expense: 'rgba(255, 99, 132)',
  investment: 'rgba(54, 162, 235)',
};

const HomePage = () => {
  const { data: txnStatsData } = useQuery(GET_TRANSACTION_STATISTICS);
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  /* https://www.apollographql.com/docs/react/data/mutations */
  /* https://www.apollographql.com/docs/react/data/refetching/#clientrefetchqueries */
  const [logout, { loading, data: logoutData, client }] = useMutation(LOGOUT); //, {refetchQueries: ['GetAuthenticatedUser']});

  const [chartData, setChartData] = useState(initChartData);

  useEffect(() => {
    if (txnStatsData?.categoryStatistics) {
      const categories = txnStatsData.categoryStatistics.map(
        (stat) => stat.category,
      );
      const totalAmounts = txnStatsData.categoryStatistics.map(
        (stat) => stat.totalAmount,
      );

      const backgroundColors = [];
      const borderColors = [];

      categories.forEach((category) => {
        backgroundColors.push(bgColorMap[category]);
        borderColors.push(bgColorMap[categories]);
      });

      setChartData((prev) => ({
        labels: categories.map((category) => categoryZhTwMap[category]),
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [txnStatsData]);

  const handleLogout = async () => {
    try {
      await logout();

      // Clear the Apollo Client cache FROM THE DOCS
      // https://www.apollographql.com/docs/react/caching/advanced-topics/#resetting-the-cache
      await client.resetStore();
    } catch (error) {
      console.error('Error logging out:', error);
      // toast.error(error.message);
    }
  };

  if (txnStatsData) console.log('txn stats data:', txnStatsData);
  if (authUserData) console.log('auth user data:', authUserData);

  if (logoutData) console.log('logout data:', logoutData);

  return (
    <>
      <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 ">
        <div className="flex items-center space-x-6">
          <p className="relative z-50 mb-4 mr-4 inline-block bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 bg-clip-text text-center text-2xl font-bold text-transparent md:text-4xl lg:text-4xl">
            記住每一筆，財富自在手！{/* Spend wisely, track wisely */}
          </p>
          <img
            src={authUserData?.authUser.profilePicture}
            className="h-11 w-11 cursor-pointer rounded-full border"
            alt="Avatar"
          />
          {!loading && (
            <div
              className="flex cursor-pointer rounded-md border border-slate-400 py-1 pl-3"
              onClick={handleLogout}
            >
              <span className="text-lg">登出</span>
              <MdLogout
                className="mx-2 h-7 w-7 cursor-pointer"
                // onClick={handleLogout}
              />
            </div>
          )}
          {/* loading spinner */}
          {loading && (
            <div className="mx-2 h-6 w-6 animate-spin rounded-full border-b-2 border-t-2"></div>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          {chartData.labels.length > 0 && (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;

/*
  const chartData = {
    // labels: ['Saving', 'Expense', 'Investment'],
    labels: ['saving', 'expense', 'investment'].map(
      (category) => categoryZhTwMap[category],
    ),
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
*/
