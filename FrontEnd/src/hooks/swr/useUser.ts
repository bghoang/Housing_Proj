import useSWR from 'swr';
import {
  getCurUser,
  login as loginAPI,
  updateUser as updateUserAPI,
  logout as logoutAPI,
  createUser as createUserAPI,
} from '@apis';
import { User } from '@models';

/**
 * SWR hook to access user data. Also provides helpful functions to login,
 * logout, update user, etc. Note: check if user is logged in by doing
 * `data.isLoggedIn` and check if it's loading by using `isLoading`
 * (do NOT do `if (!data) { ... }` with useUser)
 */
const useUser = () => {
  const { data, error, isValidating, mutate } = useSWR('/api/user', getCurUser);

  // user is only logged in if there is NO ERROR and we have the appropriate user information.
  // explicitly check that `data.name` exists since `data` might exist with `data.message` for
  // the error message
  const isLoggedIn = !error && data && 'name' in data;

  // Use discriminated typing for easy type check
  const userData = { ...data, isLoggedIn } as
    | ({ isLoggedIn: true } & User)
    | { isLoggedIn: false };

  // login wrapper which will also mutate the user with their info
  const login = async (googleLoginToken: string) => {
    const data = await loginAPI(googleLoginToken);

    if (data.unsupportedDomain) {
      // TODO unhandled, here is where the popup should occur...
      //throw Error();
    }

    if (data && !data.unsupportedDomain && !data.isNewUser) mutate(data);
    return data;
  };

  // user update wrapper which will also mutate the user with their info
  const updateUser = async (updates: Partial<User>) => {
    if (!userData.isLoggedIn) return;

    await updateUserAPI(updates);

    const newUserData = { ...userData, ...updates };
    mutate(newUserData);
  };

  // create user wrapper which will also mutate the user with their info
  const createUser = async (user: User) => {
    const data = await createUserAPI(user);

    if (data) mutate(data);
    return data;
  };

  // logout wrapper which will also mutate the user
  const logout = async () => {
    await logoutAPI();

    // hard set user as undefined. Don't mutate() by re-fetching data as it'll result in a race condition (...we think)
    mutate(undefined);
  };

  return {
    data: userData,
    isLoading: !data && !error, // TODO redesign this in the future to be more consistent with other SWR hooks (i.e. so you can do if (!data) rather than if (isLoading))
    login,
    updateUser,
    createUser,
    logout,
    isValidating,
    error,
    mutate,
  };
};

export default useUser;
