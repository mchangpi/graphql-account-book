import { Link } from 'react-router-dom';
import { useState } from 'react';
import InputField from '../components/InputField';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations/user.mutation';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  /* https://www.apollographql.com/docs/react/data/mutations */
  const [login, { loading, data }] = useMutation(LOGIN, {
    refetchQueries: ['GetAuthenticatedUser'],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      return toast.error('Please fill in all fields');
    }
    try {
      await login({
        variables: {
          input: loginData,
        },
      });
    } catch (error) {
      console.error('Error', error);
      toast.error(error.message);
    }
  };

  if (import.meta.env.VITE_DEBUG) {
    if (data) console.log('login data', data);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="z-50 flex overflow-hidden rounded-lg bg-gray-300">
        <div className="flex w-full min-w-80 items-center justify-center bg-gray-100 sm:min-w-96">
          <div className="w-full max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-semibold text-black">
              {/* Login */}
              登入
            </h1>
            <h1 className="mb-6 text-center text-base font-semibold text-gray-500">
              {/* Welcome back! Log in to your account */}
              歡迎回來，請以您的帳號登入
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                // label="Username"
                label="帳號"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleChange}
              />

              <InputField
                // label="Password"
                label="密碼"
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
              />
              <div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-black p-2 text-white transition-colors duration-300 hover:bg-gray-800  focus:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {/* {loading ? 'Loading...' : 'Login'} */}
                  {loading ? 'Loading...' : '登入'}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-base text-gray-600">
              <p>
                {/* {"Don't"} have an account?{' '} */}
                還沒有帳號?{' '}
                <Link to="/signup" className="text-blue-500 hover:underline">
                  {/* Sign Up */}
                  註冊
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
