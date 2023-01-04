import React, { useEffect, useRef } from 'react'

import HomePageSlider from '../../containers/HomePageSlider'
import LoadingSlider from '../../containers/LoadingSlider';

import './style.scss'

const Home = () => {

  const home = useRef();
  const load = useRef();
  useEffect(() => {
    setTimeout(() => {
      home.current.style.opacity = 1
      load.current.style.opacity = 0
    }, 5001); //When loading animation end
    home.current.style.opacity = 0
    load.current.style.opacity = 1
  });

  return (
    <div id='home' >
      <div className="load-slider" ref={load}>
        <LoadingSlider />
      </div>
      <div className="home-slider" ref={home}>
        <HomePageSlider className="slider" />
      </div>
    </div>
  )
}

export default Home