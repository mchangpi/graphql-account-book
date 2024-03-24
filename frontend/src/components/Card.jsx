import { FaLocationDot } from 'react-icons/fa6';
import { BsCardText } from 'react-icons/bs';
import { MdOutlinePayments } from 'react-icons/md';
import { FaSackDollar } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { DELETE_TRANSACTION } from '../graphql/mutations/transcation.mutation';

import { categoryZhTwMap, paymentZhTwMap } from '../utils/langMap';

const categoryColorMap = {
  saving: 'from-green-700 to-green-400',
  expense: 'from-pink-800 to-pink-600',
  investment: 'from-blue-700 to-blue-400',
  // Add more categories and corresponding color classes as needed
};

const Card = ({ transaction, authUser }) => {
  let { category, amount, location, date, paymentType, description } =
    transaction;

  const cardClass = categoryColorMap[transaction.category];
  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetTransactionStatistics'],
  });

  // Capitalize the first letter of the description
  description = description[0]?.toUpperCase() + description.slice(1);
  // category = category[0]?.toUpperCase() + category.slice(1);
  // paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);

  const formattedDate = formatDate(date);

  const handleDelete = async () => {
    try {
      await deleteTransaction({
        variables: { transactionId: transaction._id },
      });
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className={`rounded-md bg-gradient-to-br p-4 ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {categoryZhTwMap[transaction.category]}
          </h2>
          <div className="flex items-center gap-4">
            {!loading && (
              <FaTrash className={'cursor-pointer'} onClick={handleDelete} />
            )}
            {loading && (
              <div className="h-6 w-6 animate-spin rounded-full  border-b-2 border-t-2"></div>
            )}
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="flex items-center gap-1 text-white">
          <BsCardText />
          項目: {description}
        </p>
        <p className="flex items-center gap-1 text-white">
          <MdOutlinePayments />
          支付方式: {paymentZhTwMap[transaction.paymentType]}
        </p>
        <p className="flex items-center gap-1 text-white">
          <FaSackDollar />
          金額(新台幣): ${amount}
        </p>
        <p className="flex items-center gap-1 text-white">
          <FaLocationDot />
          位置: {location || 'N/A'}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-black">{formattedDate}</p>
          <div className="flex items-center space-x-2">
            <img
              src={authUser?.profilePicture}
              className="h-8 w-8 rounded-full border"
              alt=""
            />
            <span className="text-lg">{authUser?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
