import React, { useEffect } from 'react'

import LoaderColumn from '../../components/LoaderColumn'

import { firstColumn, secondColumn, thirdColumn, fourthColumn, fifthColumn } from '../../assets/index'

import './style.scss'
import gsap from 'gsap'

const LoadingSlider = () => {

  const startLoadingAnimation = () => {
    const t1 = gsap.timeline();

    const innerColumns = Array.prototype.slice.call(document.getElementsByClassName('loader-column__inner'));
    innerColumns.forEach(column => {
      t1.fromTo(column, { height: '350%' }, { height: '100%', duration: 3 }, '0');
    });

    const edgeColumns = Array.prototype.slice.call(document.getElementsByClassName('edge-column'));
    edgeColumns.forEach(column => {
      t1.fromTo(column, { transform: `translateY(70%)` }, { transform: `translateY(0%)`, duration: 3, ease: 'Circ.easeInOut' }, '0');
    });

    const reverseColumns = Array.prototype.slice.call(document.getElementsByClassName('reverse-column'));
    reverseColumns.forEach(column => {
      t1.fromTo(column, { transform: `translateY(-70%)` }, { transform: `translateY(2%)`, duration: 3, ease: 'Circ.easeInOut' }, '0');
    });

    const centerColumn = document.getElementsByClassName('center-column')[0];
    t1.fromTo(centerColumn, { transform: `translateY(40%)` }, { transform: `translateY(0%)`, duration: 3, ease: 'Circ.easeInOut' }, '0');

    const mainImage = document.getElementsByClassName('main-image')[0];
    t1.fromTo(mainImage, { scale: '1.5' }, { scale: '1', duration: 2.5, ease: 'Power1.easeOut' }, '2.5');

    const loaderFlex = document.getElementsByClassName('loader__flex')[0];
    t1.fromTo(loaderFlex, { scale: '0.23' }, { scale: '1', duration: 2.5 }, '2.5');


    t1.to('.loader', { display: 'none', zIndex: -1 });
  }

  useEffect(() => {
    startLoadingAnimation();
  }, [])


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