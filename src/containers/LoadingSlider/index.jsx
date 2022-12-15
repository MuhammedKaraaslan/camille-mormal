import React from 'react'

import LoaderColumn from '../../components/LoaderColumn'

import { firstColumn, secondColumn, thirdColumn, fourthColumn, fifthColumn } from '../../assets/index'

import './style.scss'

const LoadingSlider = () => {

  return (
    <div className='loader'>
      <div className="loader__flex">
        <LoaderColumn columnList={firstColumn} innerClassName='edge-column' />
        <LoaderColumn columnList={secondColumn} innerClassName='reverse-column' loaderClassName="inner-bottom" />
        <LoaderColumn columnList={thirdColumn} innerClassName='center-column' mainImage={true} />
        <LoaderColumn columnList={fourthColumn} innerClassName='reverse-column' loaderClassName="inner-bottom" />
        <LoaderColumn columnList={fifthColumn} innerClassName='edge-column' />
      </div>
    </div>
  )
}

export default LoadingSlider