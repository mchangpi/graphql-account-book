import { useState } from 'react';
import { Link } from 'react-router-dom';
import RadioButton from '../components/RadioButton';
import InputField from '../components/InputField';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../graphql/mutations/user.mutation';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    name: '',
    username: '',
    password: '',
    gender: '',
  });

  /* https://www.apollographql.com/docs/react/data/mutations */
  const [signUp, { loading, data }] = useMutation(SIGN_UP, {
    refetchQueries: ['GetAuthenticatedUser'],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp({
        variables: {
          input: signUpData,
        },
      });
    } catch (error) {
      console.error('Error', error);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setSignUpData((prevData) => ({
        ...prevData,
        gender: value,
      }));
    } else {
      setSignUpData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  if (import.meta.env.VITE_DEBUG) {
    if (data) console.log('signup data', data);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="z-50 flex overflow-hidden rounded-lg bg-gray-300">
        <div className="flex w-full min-w-80 items-center justify-center bg-gray-100 sm:min-w-96">
          <div className="w-full max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-semibold text-black">
              Sign Up
            </h1>
            <h1 className="mb-6 text-center text-sm font-semibold text-gray-500">
              Join to keep track of your expenses
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                id="name"
                name="name"
                value={signUpData.name}
                onChange={handleChange}
              />
              <InputField
                label="Username"
                id="username"
                name="username"
                value={signUpData.username}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={signUpData.password}
                onChange={handleChange}
              />
              <div className="flex gap-10">
                <RadioButton
                  id="male"
                  label="Male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  checked={signUpData.gender === 'male'}
                />
                <RadioButton
                  id="female"
                  label="Female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={signUpData.gender === 'female'}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-black p-2 text-white transition-colors duration-300 hover:bg-gray-800  focus:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Sign Up'}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-black hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
