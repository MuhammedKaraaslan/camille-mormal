import { Route, Routes } from 'react-router';

import { BrowserRouter } from "react-router-dom";

import Home from "./pages/Home"

import Detail from './pages/Detail';

import Error404 from './pages/Error404';

import { brands } from './assets';

import './App.scss'


function App() {

  let detailPages = [];
  for (let i = 0; i < brands.length; i++) {
    let nextPageUrl = i === brands.length - 1 ? brands[0].link : brands[i + 1].link
    let nextPageImage = i === brands.length - 1 ? brands[0].images.home : brands[i + 1].images.home
    detailPages = [...detailPages, <Route key={brands[i].id} path={brands[i].link}
      element={<Detail brand={brands[i]} nextPageUrl={nextPageUrl} nextPageImage={nextPageImage} totalBrandsIndex={brands.length} currentBrandIndex={i+1} />}
    />]
  }



  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          {detailPages}
          <Route path='*' element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
