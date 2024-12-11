import React from "react";
import "./Home.scss";

const Home = () => {
  return (
    <div style={{ marginTop: "10vh" }} className="inline-container">
      <h1 id="slogan">#Bee<span id="subtext">Strong</span></h1>
      <img id="motivational-photo" src="/images/strongbee.avif" />
    </div>
  );
};

export default Home;
