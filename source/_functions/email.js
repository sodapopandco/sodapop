exports.handler = async () => {
  const emailAddress = process.env.EMAIL_ADDRESS;
  const mailtoLink = `mailto:${emailAddress}`;

  return {
    statusCode: 200,
    body: mailtoLink,
  };
};
