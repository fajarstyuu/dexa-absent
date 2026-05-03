export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateName = (name: string) => {
  return /^[a-zA-Z ]+$/.test(name);
};