import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Login: React.FC<any> = () => {
  const navigate = useNavigate();
  const onLogin = () => {
    navigate("/");
  };
  const [account, setAccount] = useState("");
  const handleLogin = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      const accounts = await window.ethereum.enable();
      setAccount(accounts[0]);
      const otpResponse = await axios.post(
        "http://localhost:4003/auth",
        {
          publicKey: accounts[0],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const otpResponseData = otpResponse.data;
      const { publicKey, otp } = otpResponseData || {};
      const signature = await web3.eth.personal.sign(otp, accounts[0], "");
      const verifyResponse = await axios.patch(
        "http://localhost:4003/auth",
        {
          publicKey,
          otp,
          signature: signature.startsWith("0x") ? signature : `0x${signature}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const verifyResponseData = verifyResponse.data;
      console.log(verifyResponseData.success);
      if (verifyResponseData.success === true) {
        const { data } = verifyResponseData || {};
        const { token } = data || {};
        localStorage.setItem("token", token);
        onLogin();
      } else {
        console.error("Invalid Signature");
      }
      console.log(verifyResponseData);
      alert("SuccessFully loggedIn");
    } else {
      console.error("Metamask not found");
    }
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Logged in with Metamask account:</p>
          <p>{account}</p>
        </div>
      ) : (
        <div>
          <p>Connect to Metamask to log in</p>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
