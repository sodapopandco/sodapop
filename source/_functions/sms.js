exports.handler = async () => {
  const phoneNumber = process.env.PHONE_NUMBER;
  const smsLink = `sms:${phoneNumber}`;

  return {
    statusCode: 200,
    body: smsLink,
  };
};
