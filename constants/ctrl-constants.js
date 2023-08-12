export const emailStyle = `
    text-align: center;
`;

export const buttonStyle = `
    display: inline-block;
    margin: 0 auto;
    padding: 12px 45px;

    color: #ffffff;
    background-color: #348eda;
    border-radius: 4px;

    font-weight: 500;
    text-decoration: none;
    font-size: 20px;
    text-align: center;

    transition: background-color 300ms ease-in-out;

    &:hover,
    &:focus {
        background-color: #294db8;
    }
}
`;

export default {
  emailStyle,
  buttonStyle,
};
