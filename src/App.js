import { useEffect, useState } from "react";

import Home from "./pages/Home"

import LoadingSlider from './containers/LoadingSlider'

import './App.scss'


function App() {

  const [isAnimationEnd, setIsAnimationEnd] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsAnimationEnd(true);
  //   }, 5001); //When loading animation end
  // }, []);

  return (
    <div className="app">
      {/* <LoadingSlider /> */}
      {isAnimationEnd && <Home />}
    </div>
  );
}

export default App;
