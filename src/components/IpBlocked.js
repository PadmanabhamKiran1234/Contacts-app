import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BLOCK_DURATION = 15 * 60 * 1000; 

const IpBlocked = () => {
  let navigate = useNavigate();


  //To check the block duration by comparing present time with block time 
  useEffect(() => {
    const blockTimestamp = localStorage.getItem("blockTimestamp");
    if (blockTimestamp && Date.now() - blockTimestamp >= BLOCK_DURATION) {
      localStorage.removeItem("failedAttempts");
      localStorage.removeItem("blockTimestamp");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="container-blocked">
      <h2>Your IP has been blocked</h2>
      <p>You have made too many failed login attempts. Please try again after 15 minutes.</p>
    </div>
  );
};

export default IpBlocked;
