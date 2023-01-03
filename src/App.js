import { useEffect, useState } from "react";

import { Route, Routes } from 'react-router';

import { BrowserRouter } from "react-router-dom";

import Home from "./pages/Home"

import Detail from './pages/Detail';

import Error404 from './pages/Error404';

import LoadingSlider from './containers/LoadingSlider'

import { activiaImages, gucciImages, mocoImages, ritualsImages, saecoImages, samsungImages, sennheiserImages, swarovskiImages } from './assets';

import './App.scss'


function App() {

  const [isAnimationEnd, setIsAnimationEnd] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimationEnd(true);
    }, 5001); //When loading animation end
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isAnimationEnd ? <Home /> : <LoadingSlider />} />
          <Route path='/gucci' element={<Detail pageImages={gucciImages} nextPageUrl='samsung' />} />
          <Route path='/samsung' element={<Detail pageImages={samsungImages} nextPageUrl='rituals' />} />
          <Route path='/rituals' element={<Detail pageImages={ritualsImages} nextPageUrl='moco' />} />
          <Route path='/moco' element={<Detail pageImages={mocoImages} nextPageUrl='sennheiser' />} />
          <Route path='/sennheiser' element={<Detail pageImages={sennheiserImages} nextPageUrl='swarovski' />} />
          <Route path='/swarovski' element={<Detail pageImages={swarovskiImages} nextPageUrl='activia' />} />
          <Route path='/activia' element={<Detail pageImages={activiaImages} nextPageUrl='saeco' />} />
          <Route path='/saeco' element={<Detail pageImages={saecoImages} nextPageUrl='gucci' />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
