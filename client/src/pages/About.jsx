import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div className="wrapper">
      <div className="about-section">
        <div className="qna">
          <div className="box">
            <h2>Who are you?</h2>
          </div>
          <div className="box">
            <h5 className="answer-text" id="author-names">
              We are <span id="author-name">Abdül Ahundzade</span>, <span id="author-name">Ahmet Berkay Yıldız</span>, and <span id="author-name">Eren</span>. <br/> Three ambitious engineers from İstanbul Teknik Üniversitesi, <br/>ready to take on the database world.
            </h5>
          </div>
        </div>
        
        <div className="qna">
          <div className="box">
            <h2>You mean this:</h2>
            <img src="/wronglogo.png" />
          </div>
          <div className="box">
            <img src="/gifs/ezel.gif" alt="" />
            <h5 className="answer-text">
              We are from 🐝 İstanbul Teknik Üniversitesi 🐝, so be careful. Vız
              vız.
            </h5>
          </div>
        </div>
        <img src="/gifs/loading.gif" alt="" />
      </div>
    </div>
  );
};

export default About;
