import React, { useState } from "react";
import "./App.css";
import Main from "./containers/main/Main";
import Header from "./containers/header/Header";
import Footer from "./containers/footer/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [content, setContent] = useState("Game");

  return (
    <div>
      <Header
        isLoggedIn={isLoggedIn}
        content={content}
        changeContent={setContent}
      />
      <Main content={content} isLoggedIn={isLoggedIn} onLogin={setIsLoggedIn}/>
      {isLoggedIn && <Footer onLogin={setIsLoggedIn} />}
    </div>
  );
}

export default App;
