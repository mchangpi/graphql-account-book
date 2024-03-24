import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GET_TRANSACTION } from '../graphql/queries/transaction.query';
import { UPDATE_TRANSACTION } from '../graphql/mutations/transcation.mutation';
import toast from 'react-hot-toast';
import TransactionFormSkeleton from '../components/skeletons/TransactionFormSkeleton';

import { categoryZhTwMap, paymentZhTwMap } from '../utils/langMap';

const TransactionPage = () => {
  const { id } = useParams();
  // console.log('txn id', id);

  const { loading, data } = useQuery(GET_TRANSACTION, {
    variables: { id: id },
  });

  const [updateTransaction, { loading: updateLoading, data: updateData }] =
    useMutation(UPDATE_TRANSACTION, {
      refetchQueries: ['GetTransactionStatistics'],
      // refetchQueries: ['GetTransactions', 'GetTransactionStatistics'],
    });

  const [formData, setFormData] = useState({
    description: data?.transaction?.description || '',
    paymentType: data?.transaction?.paymentType || '',
    category: data?.transaction?.category || '',
    amount: data?.transaction?.amount || '',
    location: data?.transaction?.location || '',
    date: data?.transaction?.date || '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        description: data?.transaction?.description,
        paymentType: data?.transaction?.paymentType,
        category: data?.transaction?.category,
        amount: data?.transaction?.amount,
        location: data?.transaction?.location,
        date: new Date(Number(data.transaction.date))
          .toISOString()
          .substr(0, 10),
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('formData', formData);
    try {
      await updateTransaction({
        variables: {
          input: {
            ...formData,
            amount: parseFloat(formData.amount),
            transactionId: id,
          },
        },
      });
      toast.success('Transaction updated sucsessfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  if (data) console.log('txn data:', data);
  if (updateData) console.log('update txn data:', updateData);

  if (loading) return <TransactionFormSkeleton />;

  return (
    <div className="mx-auto flex h-screen max-w-5xl flex-col items-center">
      <p className="relative z-50 mb-4 mr-4 inline-block bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl lg:text-4xl">
        更新此帳目
      </p>
      <form
        className="flex w-full max-w-xl flex-col gap-5 px-3 "
        onSubmit={handleSubmit}
      >
        {/* TRANSACTION */}
        <div className="flex flex-wrap">
          <div className="w-full">
            <label
              className="mb-2 block text-base font-bold uppercase tracking-wide text-white"
              htmlFor="description"
            >
              項目
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="description"
              name="description"
              type="text"
              placeholder="Rent, Groceries, Salary, etc."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* PAYMENT TYPE */}
        <div className="flex flex-wrap gap-3">
          <div className="mb-6 w-full flex-1 md:mb-0">
            <label
              className="mb-2 block text-base font-bold uppercase tracking-wide text-white"
              htmlFor="paymentType"
            >
              支付方式
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="paymentType"
                name="paymentType"
                onChange={handleInputChange}
                defaultValue={formData.paymentType}
              >
                <option value={'cash'}>{paymentZhTwMap['cash']}</option>
                <option value={'card'}>{paymentZhTwMap['card']}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-6 w-full flex-1 md:mb-0">
            <label
              className="mb-2 block text-base font-bold uppercase tracking-wide text-white"
              htmlFor="category"
            >
              類別
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="category"
                name="category"
                onChange={handleInputChange}
                defaultValue={categoryZhTwMap[formData.category]}
              >
                <option value={'expense'}>{categoryZhTwMap['expense']}</option>
                <option value={'saving'}>{categoryZhTwMap['saving']}</option>
                <option value={'investment'}>
                  {categoryZhTwMap['investment']}
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="mb-6 w-full flex-1 md:mb-0">
            <label
              className="mb-2 block text-base font-bold uppercase text-white"
              htmlFor="amount"
            >
              金額(新台幣)
            </label>
            <input
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="amount"
              name="amount"
              type="number"
              placeholder="150"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex flex-wrap gap-3">
          <div className="mb-6 w-full flex-1 md:mb-0">
            <label
              className="mb-2 block text-base font-bold uppercase tracking-wide text-white"
              htmlFor="location"
            >
              位置
            </label>
            <input
              className="mb-3 block w-full appearance-none rounded border  bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
              id="location"
              name="location"
              type="text"
              placeholder="台北"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          {/* DATE */}
          <div className="w-full flex-1">
            <label
              className="mb-2 block text-base font-bold uppercase tracking-wide text-white"
              htmlFor="date"
            >
              日期
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="mb-3 block w-full appearance-none rounded border  bg-gray-200 px-4 py-[11px] leading-tight text-gray-700 focus:bg-white
						 focus:outline-none"
              placeholder="Select date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <div className="flex space-x-2">
          <Link to="/" className="w-full">
            <button
              className="w-full rounded bg-gradient-to-br from-violet-500 to-violet-500 px-4 py-2
          font-bold text-white hover:from-violet-600 hover:to-violet-600"
              type="button"
            >
              回主頁
            </button>
          </Link>
          <button
            className="w-full rounded bg-gradient-to-br from-pink-500 to-pink-500 px-4 py-2
          font-bold text-white hover:from-pink-600 hover:to-pink-600"
            type="submit"
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : '更新帳目'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default TransactionPage;
