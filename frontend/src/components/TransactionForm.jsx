import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../graphql/mutations/transcation.mutation';
import toast from 'react-hot-toast';

const TransactionForm = () => {
  const [createTransaction, { loading, data }] = useMutation(
    CREATE_TRANSACTION,
    { refetchQueries: ['GetTransactions'] },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const transactionData = {
      description: formData.get('description'),
      paymentType: formData.get('paymentType'),
      category: formData.get('category'),
      amount: parseFloat(formData.get('amount')),
      location: formData.get('location'),
      date: formData.get('date'),
    };
    // console.log('transactionData', transactionData);
    try {
      await createTransaction({ variables: { input: transactionData } });
      form.reset();
      toast.success('Transaction created successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (data) console.log('create txn data:', data);

  return (
    <form
      className="flex w-full max-w-lg flex-col gap-5 px-3"
      onSubmit={handleSubmit}
    >
      {/* TRANSACTION */}
      <div className="flex flex-wrap">
        <div className="w-full">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-white"
            htmlFor="description"
          >
            Transaction
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="description"
            name="description"
            type="text"
            required
            placeholder="Rent, Groceries, Salary, etc."
          />
        </div>
      </div>
      {/* PAYMENT TYPE */}
      <div className="flex flex-wrap gap-3">
        <div className="mb-6 w-full flex-1 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-white"
            htmlFor="paymentType"
          >
            Payment Type
          </label>
          <div className="relative">
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="paymentType"
              name="paymentType"
            >
              <option value={'card'}>Card</option>
              <option value={'cash'}>Cash</option>
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
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-white"
            htmlFor="category"
          >
            Category
          </label>
          <div className="relative">
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="category"
              name="category"
            >
              <option value={'saving'}>Saving</option>
              <option value={'expense'}>Expense</option>
              <option value={'investment'}>Investment</option>
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
            className="mb-2 block text-xs font-bold uppercase text-white"
            htmlFor="amount"
          >
            Amount($)
          </label>
          <input
            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="amount"
            name="amount"
            type="number"
            placeholder="150"
          />
        </div>
      </div>

      {/* LOCATION */}
      <div className="flex flex-wrap gap-3">
        <div className="mb-6 w-full flex-1 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-white"
            htmlFor="location"
          >
            Location
          </label>
          <input
            className="mb-3 block w-full appearance-none rounded border  bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
            id="location"
            name="location"
            type="text"
            placeholder="New York"
          />
        </div>

        {/* DATE */}
        <div className="w-full flex-1">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-white"
            htmlFor="date"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="mb-3 block w-full appearance-none rounded border  bg-gray-200 px-4 py-[11px] leading-tight text-gray-700 focus:bg-white
						 focus:outline-none"
            placeholder="Select date"
          />
        </div>
      </div>
      {/* SUBMIT BUTTON */}
      <button
        className="w-full rounded bg-gradient-to-br from-pink-500 to-pink-500 px-4 py-2
          font-bold text-white hover:from-pink-600 hover:to-pink-600
						disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
