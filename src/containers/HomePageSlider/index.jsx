import React, { useEffect, useRef, useState } from 'react'

import gsap from 'gsap'

import { sliderButton, productImages } from '../../assets'

import './style.scss'

const HomePageSlider = () => {

    const mainSlider = useRef();
    const prevSlider = useRef();
    const sliderButtons = useRef([]);

    const [isFullScreen, setIsFullScreen] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(0); //Baslangicta 0 daha sonra hangi butona tiklandigina gore 1 veya -1 oluyor
    const [previewActiveSlide, setPreviewActiveSlide] = useState();

    const [isMainSliderAnimationActive, setIsMainSliderAnimationActive] = useState(false);
    const [isChangeScreenToPreviewActive, setIsChangeScreenToPreviewActive] = useState(false);

    useEffect(() => {
        changeSlide();
    }, [activeIndex])

    //Full screen slide animasyonları başlangıcı
    const changeSlide = () => {
        if (isMainSliderAnimationActive) { return; }
        changeMainSlide();
        changePreviewSlide();
    }

    const changeMainSlide = () => {
        const { currentActiveSlide, newActiveSlide } = changeActiveSlide(mainSlider, 'main-active-slide');
        const changeSlideTimeline = gsap.timeline();

        // Slide bitmeden tekrar çalıştırılamaması için
        setIsMainSliderAnimationActive(true);

        setTimeout(() => {
            setIsMainSliderAnimationActive(false);
        }, "1500")

        //Slide animasyonu
        changeSlideTimeline.fromTo(currentActiveSlide, { transform: "translateX(0%)", zIndex: '0' }, { transform: `${slideDirection === 1 ? 'translateX(-80%)' : 'translateX(80%)'}`, duration: slideDirection === 0 ? 0.01 : 1 });
        changeSlideTimeline.fromTo(newActiveSlide, { transform: `${slideDirection === 1 ? 'translateX(100%)' : 'translateX(-100%)'}`, zIndex: '2' }, { transform: "translateX(0%)", duration: slideDirection === 0 ? 0.01 : 1.5, ease: 'power3' }, '0');
        if (slideDirection !== 0) changeSlideTimeline.set(currentActiveSlide, { transform: "translateX(100%)" }, '1.5') // Eger daha once slide calismamissa direction 0

        //Prev Next butonları animasyonu
        changeSlideTimeline.fromTo(sliderButtons.current, { rotate: '0deg' }, { rotate: `${slideDirection < 0 ? "-" : "+"}90deg` }, '0'); //Buton ile geldiyse bu animasyon çalışacak

        //Yazı animasyonu
        let textTimeline = gsap.timeline();
        textTimeline.fromTo(currentActiveSlide.querySelector('.slider-title'), { transform: 'translateY(0)' }, { transform: 'translateY(-100%)', duration: .3 });
        textTimeline.fromTo(newActiveSlide.querySelector('.slider-title'), { transform: 'translateY(150%)' }, { transform: 'translateY(0%)', duration: .5 }, '1');

        //Sayfa numarası animasyonu
        let timeline = gsap.timeline();
        let pageNumber = document.querySelector('.pagination__active');
        timeline.fromTo(pageNumber, { display: 'inline-block', transform: 'translateY(0%)' }, { transform: `${slideDirection === 1 ? 'translateY(-50%)' : 'translateY(50%)'}`, duration: .3 });
        timeline.fromTo(pageNumber, { display: 'inline-block', transform: `${slideDirection === 1 ? 'translateY(100%)' : 'translateY(-100%)'}` }, { transform: 'translateY(0%)', duration: .3 });
        // Eski sayfa numarası ekrandan gidince sayfa numarası artıyor
        setTimeout(() => {
            pageNumber.innerHTML = activeIndex + 1;
        }, "300")

    }

    const changePreviewSlide = () => {
        setPreviewActiveSlide(changeActiveSlide(prevSlider, 'preview-active-slide').newActiveSlide);
        const imageWidth = document.querySelector('.preview-slider-image').offsetWidth;
        let offset = (imageWidth * activeIndex) + (imageWidth / 2) + (40 * activeIndex)
        onMouseMove(null, offset);
    }

    const changeActiveSlide = (slider, className) => {
        const slides = Array.prototype.slice.call(slider.current.children);

        const currentActiveSlide = slides.filter((slide) => { return slide.classList.contains(className) })[0];
        currentActiveSlide.classList.remove(className);

        let newActiveSlide = slides[activeIndex];
        newActiveSlide.classList.add(className)

        return { currentActiveSlide, newActiveSlide };
    }
    //Full screen slide animasyonları bitişi

    //PREVIEW SLIDER ANIMASYONU BASLANGICI
    //Eger fullscreen de bir degisiklik yapilmissa e degeri null donecek. Eger preview ekraninda mouse drag veya mouse wheel yapilmissa offset null donecek.
    const onMouseMove = (e, offset) => {
        let mouseDelta;
        if (offset != null) {
            mouseDelta = offset
        } else {
            if (prevSlider.current.dataset.mouseDownAt === "0" && e._reactName !== 'onWheel') return;
            mouseDelta = e._reactName === "onWheel" ? (Math.sign(e.deltaY) === 1 ? 50 : -50) : parseFloat(prevSlider.current.dataset.mouseDownAt) - e.clientX;  // Mouse'un ilk tıklandığı yer - mouse sürüklendikçe gittiği konum
        }
        const maxDelta = window.innerWidth; //Maximum gidebileceği yer ekranın yarısı kadar

        const percentage = (mouseDelta / maxDelta) * -100;

        let nextPercentageUnconstrained = parseFloat(prevSlider.current.dataset.prevPercentage) + percentage;

        if (offset != null) nextPercentageUnconstrained = percentage;

        let nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -150);

        prevSlider.current.dataset.percentage = nextPercentage;
        //Eğer wheel ise prevPercentage burada set ediliyor böylece wheel sonrası drag ile işlem yapılırsa prevSlider.current kaldığı yerden devam ediyor. 
        //Aksi takdirde prevPercentage wheel animasyonunda hiç set edilmiyor ve sürekli 0 kalıyor
        e && e._reactName === "onWheel" && (prevSlider.current.dataset.prevPercentage = prevSlider.current.dataset.percentage);
        offset && (prevSlider.current.dataset.prevPercentage = prevSlider.current.dataset.percentage)

        const mouseMoveTimeline = gsap.timeline();

        mouseMoveTimeline.to(prevSlider.current, { transform: `translate(${50 + nextPercentage}%, 0%)`, duration: 1 })
        mouseMoveTimeline.to(document.querySelectorAll('.preview-slider-image'), { objectPosition: `${50 + nextPercentage / 3}% center`, duration: 1 }, '0')

    }

    const onMouseDown = (e) => {
        prevSlider.current.dataset.mouseDownAt = e.clientX
    }

    const onMouseUp = () => {
        prevSlider.current.dataset.mouseDownAt = "0";
        prevSlider.current.dataset.prevPercentage = prevSlider.current.dataset.percentage;
    }
    //PREVIEW SLIDER ANIMASYONU BASLANGICI

    const changeScreenToPreview = () => {
        if (!isFullScreen) return;
        // Preview ekranina gecis bitmeden full ekrana donus olmaması için
        setIsChangeScreenToPreviewActive(true);

        setTimeout(() => {
            setIsChangeScreenToPreviewActive(false);
        }, "1500")
        setIsFullScreen(false);

        const prevWith = document.querySelector('.preview-slider-image').getBoundingClientRect().width
        const prevHeight = document.querySelector('.preview-slider-image').getBoundingClientRect().height
        const prevPosition = document.querySelector('.preview-slider-image').style.objectPosition


        const timeline = gsap.timeline();
        timeline
            .fromTo(document.querySelector('.main-active-slide .slider-title'), { transform: 'translateY(0)' }, { transform: 'translateY(-100%)', duration: .3 })
            .fromTo(document.querySelectorAll('.main-slider__item img'), { objectPosition: prevPosition, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
                { width: `${prevWith}px`, height: `${prevHeight}px`, duration: .5 }, '0')
            .set(previewActiveSlide, { opacity: 1 })
            .set(mainSlider.current, { display: 'none' })
            .to(document.querySelectorAll('.preview-slider__item'), { opacity: 1, duration: 1.5, ease: 'none' })


        document.querySelectorAll('.thumbs-slider__item').forEach((thumbsSlide, index) => {
            thumbsSlide.style.cssText = null
            gsap.timeline().to(thumbsSlide, { transform: 'translateY(200%)', opacity: '0', duration: `${(index) / 5}`, ease: 'power2' }, '0.1');
        })


        gsap.timeline().to([document.querySelector('.slider-buttons'), document.querySelector('.pagination')], { display: 'none' });

    }

    const changeScreenToFull = (index) => {
        if (isFullScreen || isChangeScreenToPreviewActive) return;
        setIsFullScreen(true)
        setActiveIndex(index);
        changeActiveSlide(mainSlider, 'main-active-slide');

        gsap.timeline().fromTo(document.querySelectorAll('.preview-slider__item'), { opacity: 1 }, { opacity: 0, duration: 0.1 })

        document.querySelectorAll('.thumbs-slider__item').forEach((thumbsSlide, index) => {
            thumbsSlide.style.cssText = null
            gsap.timeline().to(thumbsSlide, { transform: 'translateY(0)', opacity: '1', duration: `${(index) / 5}`, ease: 'power2' }, '0.1');
        })

        gsap.timeline().to([document.querySelector('.slider-buttons'), document.querySelector('.pagination')], { display: 'flex' });


        gsap.set(document.querySelectorAll('.main-slider__item'), { width: '100vw', height: '100vh' })

        mainSlider.current.style.cssText = null
        const timeline = gsap.timeline();
        timeline
            .fromTo(document.querySelectorAll('.main-slider__item img'), { objectPosition: 'center center', top: '50%', left: '50%', right: '50%', bottom: '50%', transform: 'translate(0)' },
                { top: '0', left: '0', right: '0', bottom: '0', width: '100%', height: '100%', duration: .5 })
            .fromTo(document.querySelector('.main-active-slide .slider-title'), { transform: 'translateY(100%)' }, { transform: 'translateY(0%)', duration: .3 })

    }


    const handleSlideButtonClick = (buttonTitle) => {
        if (isMainSliderAnimationActive) { return; }
        if (buttonTitle === 'prev') {
            setActiveIndex(activeIndex === 0 ? mainSlider.current.childNodes.length - 1 : activeIndex - 1);
            setSlideDirection(-1);
        }
        else {
            setActiveIndex(activeIndex === mainSlider.current.childNodes.length - 1 ? 0 : activeIndex + 1);
            setSlideDirection(1);
        }
    }

    const handleThumbsSlideClick = (index) => {
        if (isMainSliderAnimationActive) { return; }
        activeIndex > index ? setSlideDirection(-1) : setSlideDirection(1); setActiveIndex(index)
    }


    return (
        <div id='slider-section'
            onWheel={isFullScreen ? changeScreenToPreview : onMouseMove} onMouseMove={isFullScreen ? undefined : onMouseMove}
            onMouseDown={isFullScreen ? undefined : onMouseDown} onMouseUp={isFullScreen ? undefined : onMouseUp}>
            <div id="slider" className="slider">

                {/* SLIDER BUTTONS */}
                <div className="slider-buttons">
                    <img className='slider-button prev' ref={(element) => { sliderButtons.current[0] = element }} src={sliderButton} alt="prev" onClick={() => { handleSlideButtonClick('prev') }} />
                    <img className='slider-button next' ref={(element) => { sliderButtons.current[1] = element }} src={sliderButton} alt="next" onClick={() => { handleSlideButtonClick('next') }} />
                </div>

                {/* MAIN SLIDER */}
                <div id="main-slider" className="main-slider" ref={mainSlider}>
                    {
                        productImages.map((image, index) => (
                            <div className={`main-slider__item ${index === 0 && 'main-active-slide'}`} key={index}>
                                <img className='slider-image' src={image} alt="brand bg" />
                                <div className="slider-content">
                                    <div className="slider-title-wrapper">
                                        <p className="slider-title">The Regeneration Suite</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* MENU */}
                <div className="menu">
                    <a href="/localhost:3000">Work</a>
                    <a href="/localhost:3000">About</a>
                </div>

                {/* PREVIEW SLIDER */}
                <div id='preview-slider' className="preview-slider" ref={prevSlider} data-mouse-down-at="0" data-percentage="0" data-prev-percentage="0" >
                    {
                        productImages.map((image, index) => (
                            <div className={`preview-slider__item ${index === 0 && 'preview-active-slide'}`}
                                key={index}
                                onClick={() => changeScreenToFull(index)}>
                                <img className='preview-slider-image' src={image} alt="preview brand" />
                            </div>
                        ))
                    }
                </div>

                {/* BOTTOM */}
                <div className="bottom">
                    <span className='bottom-column'></span>
                    <div className='pagination'>
                        <span className="pagination__active">1</span>
                        <div className="pagination__line"></div>
                        <span className='pagination__total'>8</span>
                    </div>
                    <div className="thumbs-slider bottom-column">
                        {
                            productImages.map((image, index) => (
                                <div className="thumbs-slider__item" key={index} onClick={() => { handleThumbsSlideClick(index) }}>
                                    <img src={image} alt="thumbs brand" />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePageSlider