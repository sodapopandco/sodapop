exports.handler = async () => {
  const phoneNumber = process.env.PHONE_NUMBER;
  const smsLink = `sms:+1${phoneNumber}`;

  return {
    statusCode: 200,
    body: smsLink,
  };
};
