import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const { SENDGRID_API_KEY, UKR_NET_EMAIL } = process.env;

const sendEmail = async data => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const response = await sgMail.send({
    ...data,
    from: UKR_NET_EMAIL,
  });

  return response;
};

export default sendEmail;
