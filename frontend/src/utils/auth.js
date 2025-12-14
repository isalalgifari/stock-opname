export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getRole = () => {
  const user = getUser();
  return user?.role;
};

export const logout = () => {
  localStorage.removeItem('user');
};
