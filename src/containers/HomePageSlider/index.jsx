import React, { useEffect, useState } from 'react'

import gsap from 'gsap'

import { sliderButton, productImages } from '../../assets'

import './style.scss'

const HomePageSlider = () => {

    const [isFullScreen, setIsFullScreen] = useState(true);

    //Full screen slide animasyonları başlangıcı
    let changeSlideTimeline = gsap.timeline();

    const changeSlide = (event, index) => {
        //Animasyon devam ediyorsa method tekrar çalışmaz. Bitmişse eski animasyonun değerleri gitsin diye clear edilir.
        const { currentActiveSlide, offset, newActiveSlide, button } = changeActiveSlide(event, index);

        //Slide animasyonu
        changeSlideTimeline.fromTo(currentActiveSlide, { transform: "translateX(0%)" }, { transform: `${offset === 1 ? 'translateX(-80%)' : 'translateX(80%)'}`, duration: 1 });
        changeSlideTimeline.fromTo(newActiveSlide, { transform: `${offset === 1 ? 'translateX(100%)' : 'translateX(-100%)'}` }, { transform: "translateX(0%)", duration: 1.5, ease: 'power3' }, '0');
        changeSlideTimeline.set(currentActiveSlide, { transform: "translateX(100%)" }, '1.5');

        //Prev Next butonları animasyonu
        if (button) changeSlideTimeline.fromTo(button, { rotate: '0' }, { rotate: `${offset < 0 ? "-" : "+"}90deg` }, '0'); //Buton ile geldiyse bu animasyon çalışacak

        //Yazı animasyonu
        let textTimeline = gsap.timeline();
        textTimeline.fromTo(currentActiveSlide.querySelector('.slide__content p'), { transform: 'translateY(0)' }, { transform: 'translateY(-100%)', duration: .3 });
        textTimeline.fromTo(newActiveSlide.querySelector('.slide__content p'), { transform: 'translateY(150%)' }, { transform: 'translateY(0%)', duration: .5 }, '.8');

    }

    const changeActiveSlide = (event, index) => {
        if (changeSlideTimeline.isActive()) { return; }
        changeSlideTimeline.clear();

        let button = event ? event.target : null; //Thumbs ile geldiyse buton null olacak
        let offset = button ? (button.classList.contains("next") ? 1 : -1) : 1; //Thumbs ile geldiyse offset 1 olacak
        const slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
        const currentActiveSlide = slides.filter((slide) => { return slide.classList.contains("active-slide") })[0];
        let newIndex = (index !== undefined) ? index : slides.indexOf(currentActiveSlide) + offset; //Thumbs ile geldiyse index alınacak değilse offset hesabı yapılacak

        if (newIndex < 0) {
            newIndex = slides.length - 1
        }
        if (newIndex >= slides.length) {
            newIndex = 0
        }

        let newActiveSlide = slides[newIndex];
        newActiveSlide.classList.add("active-slide")
        currentActiveSlide && currentActiveSlide.classList.remove("active-slide");

        //Aktif slide degistikten sonra sayfa numarasını gunceller
        changePageNumber(offset, newIndex);
        return { currentActiveSlide, offset, newActiveSlide, newIndex, button };
    }

    const changePageNumber = (offset, newIndex) => {
        let pageTextTimeline = gsap.timeline();
        let pageNumber = document.querySelector('.slider__pagination-page');
        pageTextTimeline.fromTo(pageNumber, { display: 'inline-block', transform: 'translateY(0%)' }, { transform: `${offset === 1 ? 'translateY(-50%)' : 'translateY(50%)'}`, duration: .3 });
        pageTextTimeline.fromTo(pageNumber, { display: 'inline-block', transform: `${offset === 1 ? 'translateY(100%)' : 'translateY(-100%)'}` }, { transform: 'translateY(0%)', duration: .6 });
        // Eski sayfa numarası ekrandan gidince sayfa numarası artıyor
        setTimeout(() => {
            pageNumber.innerHTML = newIndex + 1;
        }, "500")
    }
    //Full screen slide animasyonları bitişi


    const changeScreenToPreview = () => {
        if (!isFullScreen) return;
        const slider = document.getElementById('slider');
        const thumbs = document.getElementById('thumbs');
        document.querySelector('.active-slide').style.cssText = null;
        document.querySelector('.active-slide').classList.remove('active-slide');

        //Thumbs'in onceden kalan degerleri varsa sifilamak icin
        animateTumbsAndImages(thumbs, 1, 0);

        const timeline = gsap.timeline();
        slider.style.display = 'none';
        timeline.fromTo(thumbs, { gap: '0 4vmin', }, { width: 'max-content', height: 'fit-content', display: 'flex', position: 'absolute', left: '50%', top: '50%', transform: 'translate(0%, -50%)', duration: '1' });
        timeline.to(document.getElementsByClassName('thumbs__slide'), { width: '40vmin', height: '56vmin', duration: '1' }, '0');

        document.querySelector('.slider__pagination').style.display = 'none';
        document.querySelectorAll('.slider-button').forEach(content => content.style.display = 'none')
        document.querySelectorAll('.slide__content').forEach(content => content.style.display = 'none')

        setIsFullScreen(false);
    }

    const changeScreenToFull = (event, index) => {
        if (isFullScreen) return;
        // Full screen'e donerken yeni bir aktif slide oluşturur ve sayfa numarasını buna gore gunceller
        changeActiveSlide(event, index);

        const slider = document.getElementById('slider');
        const thumbs = document.getElementById('thumbs');

        slider.style.display = 'flex';
        document.querySelector('.slider__pagination').style.display = 'flex';
        document.querySelectorAll('.slider-button').forEach(content => content.style.display = 'flex')

        //Thumbs'in onceden kalan degerleri varsa sifilamak icin
        animateTumbsAndImages(thumbs, 1, 0);
        thumbs.dataset.prevPercentage = 0
        thumbs.dataset.percentage = 0

        const timeline = gsap.timeline();

        timeline.fromTo(document.querySelector('.active-slide'), { left: '50%', top: '50%', width: '0', height: '0' }, { left: '0', top: '0', width: '100vw', height: '100vh', duration: '1' }, '0');
        timeline.fromTo(document.querySelectorAll('.slide__content'), { display: 'flex', opacity: 0 }, { opacity: 1, duration: '1.2' }, '0');

        //timeline.fromTo(thumbs, { gap: '4px' }, {  height: 'initial', position: 'absolute', duration: '1' }, '0');
        //Preview ekrani icin eklenen ek css ozellikleri silindi
        thumbs.style.cssText = null;
        document.querySelectorAll('.thumbs__slide').forEach((thumbsSlide, index) => {
            thumbsSlide.style.cssText = null
            timeline.fromTo(thumbsSlide, { transform: 'translateY(150%)' }, { transform: 'translateY(0)', duration: `${(index + 5) / 10}` }, '0.3');
        });
        document.querySelectorAll('.slide').forEach((slide) => {
            slide.style.cssText = null
        });

        setIsFullScreen(true);
    }

    //Preview Ekranında Slider Animasyonu Başlangıcı
    const thumbs = document.getElementById("thumbs");
    const mouseDown = (e) => {
        if (isFullScreen) return;
        thumbs.dataset.mouseDownAt = e.clientX;
    }

    const mouseMove = (e) => {
        //(Ekran full'se || mouse ile drag bittiyse) && wheel değilse
        if ((isFullScreen || thumbs.dataset.mouseDownAt === "0") && e._reactName !== 'onWheel') return;
        // Eğer wheel ise wheel yönüne bakılır. Wheel yönü 1 ise 20 değilse -20 set edilir. Eğer wheel değil mouse ise mouse'un ilk tıklandığı ve bırakıldığı yer arası alınır.
        const mouseDelta = e._reactName === "onWheel" ? (Math.sign(e.deltaY) === 1 ? 20 : -20) : (parseFloat(thumbs.dataset.mouseDownAt) - e.clientX);
        const maxDelta = window.innerWidth / 2;
        const percentage = (mouseDelta / maxDelta) * -50;
        const nextPercentageUnconstrained = parseFloat(thumbs.dataset.prevPercentage) + percentage;
        const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
        thumbs.dataset.percentage = nextPercentage;
        //Eğer wheel ise prevPercentage burada set ediliyor böylece wheel sonrası drag ile işlem yapılırsa thumbs kaldığı yerden devam ediyor. 
        //Aksi takdirde prevPercentage wheel animasyonunda hiç set edilmiyor ve sürekli 0 kalıyor
        e._reactName === "onWheel" && (thumbs.dataset.prevPercentage = thumbs.dataset.percentage);

        animateTumbsAndImages(thumbs, 1200, nextPercentage)
    }

    const animateTumbsAndImages = (thumbs, duration, translatePercentage) => {
        thumbs.animate({
            transform: `translate(${translatePercentage}%, -50%)`
        }, {
            duration: Number(duration),
            fill: "forwards"
        });

        for (const image of thumbs.querySelectorAll(".thumbs__slide img")) {
            image.animate({
                objectPosition: `${100 + translatePercentage}% center`
            }, {
                duration: Number(duration),
                fill: "forwards"
            });
        }
    }
    const mouseUp = () => {
        if (isFullScreen) return;
        thumbs.dataset.mouseDownAt = "0";
        thumbs.dataset.prevPercentage = thumbs.dataset.percentage;
    }
    //Preview Ekranında Slider Animasyonu Bitişi


    useEffect(() => {
        const timeline = gsap.timeline();
        timeline.fromTo(document.querySelectorAll('.slider-button'), { opacity: '0' }, { opacity: '1', duration: 2, esase: 'none' });
        timeline.fromTo(document.querySelectorAll('.slide__content'), { opacity: '0' }, { opacity: '1', duration: 2, esase: 'none' }, '0');
        timeline.fromTo(document.querySelectorAll('.slider__pagination'), { opacity: '0' }, { opacity: '1', duration: 2, esase: 'none' }, '0');
        document.querySelectorAll('.thumbs__slide').forEach((thumbsSlide, index) => {
            thumbsSlide.style.cssText = null
            timeline.fromTo(thumbsSlide, { transform: 'translateY(150%)' }, { transform: 'translateY(0)', duration: `${(index + 5) / 10}` }, '0');
        });
    }, [])


    return (
        <div id='slider-section' onWheel={isFullScreen ? changeScreenToPreview : mouseMove} onMouseUp={mouseUp} onMouseDown={mouseDown} onMouseMove={mouseMove}>
            <div id='slider' className="slider" >
                {
                    productImages.map((image, index) => (
                        <div className={`slide ${index === 0 ? 'active-slide' : ''}`} key={index}>
                            <div className="slide__content">
                                <p>The Regeneration Suit</p>
                            </div>
                            <img src={image} alt={`slide ${index}`} onMouseUp={mouseUp} onMouseDown={mouseDown} onMouseMove={mouseMove} />
                        </div>
                    ))
                }

                <img src={sliderButton} alt="prev" className='slider-button prev' onClick={(event) => changeSlide(event)} />
                <img src={sliderButton} alt="next" className='slider-button next' onClick={(event) => changeSlide(event)} />
                <div className='slider__pagination'>
                    <span className='slider__pagination-page'>1</span>
                    <span> - 8</span>
                </div>
            </div>

            <div id='thumbs' className="thumbs" data-mouse-down-at="0" data-prev-percentage="0">
                {
                    productImages.map((image, index) => (
                        <div className="thumbs__slide" key={index} onClick={isFullScreen ? () => changeSlide(null, index) : () => changeScreenToFull(null, index)}>
                            <img src={image} alt={`thumbs ${index}`} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default HomePageSlider