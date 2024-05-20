import md5 from 'md5';

export const getGravatarUrl = (email) => {
  const processedEmail = email.trim().toLowerCase();
  const hash = md5(processedEmail);
  return `https://www.gravatar.com/avatar/${hash}`;
};