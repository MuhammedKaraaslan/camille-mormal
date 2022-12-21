import React from 'react'

import './style.scss'

const LoaderColumn = ({ columnList, mainImage, innerClassName, loaderClassName }) => {

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