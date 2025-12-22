import React, { useState, useEffect, useCallback } from 'react';
import './homeImageCarousel.css';

const HomeImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle the previous image click
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // 1. Wrap nextImage in useCallback so it stays stable across renders
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]); // Only recreates if the number of images changes

  // Handle clicking on a specific image (dots)
  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage(); 
    }, 3000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
    
    // 2. Added nextImage to dependency array to satisfy ESLint
    // I also kept currentIndex here so the timer resets if the user manually changes the slide
  }, [nextImage, currentIndex]); 

  return (
    <div className="carousel-container">
      {/* Image */}
      <div className="slider-wrapper">
        <button className="slider-button slider-button-left" onClick={prevImage}>
          <span className="material-icons">arrow_back_ios</span>
        </button>

        {/* Image Slider */}
        <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="slide">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>

        <button className="slider-button slider-button-right" onClick={nextImage}>
          <span className="material-icons">arrow_forward_ios</span>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="slider-nav">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active-dot' : ''}`}
            onClick={() => goToImage(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HomeImageCarousel;