import React from 'react'

import HomePageSlider from '../../containers/HomePageSlider'

import './style.scss'

const Home = () => {
  return (
    <div id='home'>       
        <HomePageSlider className="slider" />
    </div>
  )
}

export default Home