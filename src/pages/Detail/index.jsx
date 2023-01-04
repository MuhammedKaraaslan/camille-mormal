import React, { useEffect } from 'react'

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import Observer from 'gsap/Observer';

import './style.scss'


const Detail = ({ brand, nextPageUrl, nextPageImage, currentBrandIndex, totalBrandsIndex }) => {

  const changePage = () => {
    document.querySelector('.next-page__link').click();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.refresh();
    });
  }, [])
  

  // const createObserver = () => {
  //   Observer.create({
  //     target: window,
  //     type: 'pointer',
  //     onChangeY: (self) => {
  //       let delta = self.deltaY * -2;
  //       let scrollDistance = window.scrollY + delta;
  //       window.scrollTo(0, scrollDistance);
  //     }
  //   })
  // }

  //Image section'ın yan tarafinda olan preview goruntusu animasyonu
  const animateSidebarImage = () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.getElementById('images'),
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    timeline.to(document.querySelector('.column__wrap-move'), { yPercent: 100, ease: 'none' })
  }


  //Sayfa sonunda bulunan image'in scroll animasyonu
  const animatePageEndImage = () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.querySelector('.next-page'),
        pin: document.querySelector('.empty'),
        start: 'top top', // İlk top element 2. top ekran yani element'in en üstü ekranın en üstüne gelince başlar
        end: "+=100%", //Buradaki deger ve css'deki next-page padding'i aynı olacak
        scrub: true,
        onUpdate: () => {
          const title = document.getElementsByClassName('next-page__title-progress')[0]
          title && (title.innerHTML = Math.round(timeline.progress() * 100))
          if (timeline.progress() === 1) changePage()
        },
      },
    })


    timeline.fromTo(document.querySelector('.next-page__image'), { clipPath: 'polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)' }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', width: '100vw', height: '100vh', ease: 'none',
    });

  }


  useEffect(() => {
    // gsap.registerPlugin(Observer, ScrollTrigger);
    gsap.registerPlugin(ScrollTrigger);

    // createObserver();

    animateSidebarImage();

    animatePageEndImage();
  })


  return (
    <div className="detail-page">
      <div className="main-wrapper">

        <section className='section hero'>
          <div className="container">
            <div className="hero-content">
              <div className="hero-content__top">
                <div className="hero-info">
                  <div className="hero-info__headline">
                    <h1>{brand.headline}</h1>
                  </div>
                  <div className="hero-info__project-number">
                    <p className='current-project'>{currentBrandIndex}</p>
                    <div className="hero-project-number-line"></div>
                    <p className='total-projects'>{totalBrandsIndex}</p>
                  </div>
                </div>
                <p className="hero-sub-head">{brand.subHead}</p>
                <p className="hero-description">{brand.description}</p>
                <p className="hero-done-with">Done With <br /> {brand.doneWith}</p>
              </div>
              <p className="scroll-down">Scroll Down</p>
            </div>
          </div>

          <img className="hero__bg" src={brand.images.hero} alt="gucci hero" />

        </section>

        <section id='images' className="section images">
          <div className="container">
            <div className="column"></div>

            <div className="main-images">
              <div className="main-images__list">
                {
                  brand.images.section.map((image, index) => (
                    <div key={index} id={`mainImage${index}`} className="main-images__list__item">
                      <img src={image} alt="brand" />
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="column">
              <div className="column__images-list">
                {
                  brand.images.section.map((image, index) => (
                    <div key={index} className="column__images-list__item">
                      <a href={`#mainImage${index}`}>
                        <img src={image} alt="brand" />
                      </a>
                    </div>
                  ))
                }
              </div>
              <div className="column__wrap">
                <div className="column__wrap-move">
                  <div className="column__wrap-move-frame"></div>
                </div>
                <div className="column__wrap-image-spacer"></div>
              </div>
            </div>
          </div>
        </section>

        <section id='next-page' className='next-page'>
          <div className="container">
            <div className='next-page__title'>
              <h2>The Regeneration Suite</h2>
              <p className='next-page__title-progress'>0</p>
            </div>
            <a className='next-page__link' href={`/${nextPageUrl}`} >Next Project</a>
          </div>

          <img className='next-page__image' src={nextPageImage} alt="Next page" />
        </section>

        <div className="empty"></div>
      </div>
    </div>
  )
}

export default Detail