import React, { useEffect } from 'react'

import gsap from 'gsap';

import './style.scss'

const LoaderColumn = ({ columnList, mainImage, innerClassName, loaderClassName }) => {

  const startLoadingAnimation = () => {
    const t1 = gsap.timeline();

    const innerColumns = Array.prototype.slice.call(document.getElementsByClassName('loader-column__inner'));
    innerColumns.forEach(column => {
      t1.fromTo(column, { height: '350%' }, { height: '100%', duration: 2.5 }, '0');
    });

    const edgeColumns = Array.prototype.slice.call(document.getElementsByClassName('edge-column'));
    edgeColumns.forEach(column => {
      t1.fromTo(column, { transform: `translateY(70%)` }, { transform: `translateY(0%)`, duration: 2.5, ease: 'Circ.easeInOut' }, '0');
    });

    const reverseColumns = Array.prototype.slice.call(document.getElementsByClassName('reverse-column'));
    reverseColumns.forEach(column => {
      t1.fromTo(column, { transform: `translateY(-70%)` }, { transform: `translateY(2%)`, duration: 2.5, ease: 'Circ.easeInOut' }, '0');
    });

    const centerColumn = document.getElementsByClassName('center-column')[0];
    t1.fromTo(centerColumn, { transform: `translateY(40%)` }, { transform: `translateY(0%)`, duration: 2.5, ease: 'Circ.easeInOut' }, '0');

    const mainImage = document.getElementsByClassName('main-image')[0];
    t1.fromTo(mainImage, { scale: '1.5' }, { scale: '1', duration: 2, ease: 'Power1.easeOut' }, '2');

    const loaderFlex = document.getElementsByClassName('loader__flex')[0];
    t1.fromTo(loaderFlex, { scale: '0.23' }, { scale: '1', duration: 2 }, '2');

  }

  useEffect(() => {
    startLoadingAnimation();
  }, [])


  return (
    <div className={`loader-column ${loaderClassName}`}>
      <div className={`loader-column__inner ${innerClassName}`}>
        {columnList.map((item, index) => (
          <div className="loader-img-wrap" key={index}>
            <img className={`loader_img ${(mainImage && index === 2) && 'main-image'}`} src={item} alt="slider brand" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoaderColumn