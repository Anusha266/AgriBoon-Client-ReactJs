import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../slider.css";

// Custom Previous Arrow
const PrevArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        left: "10px",
        zIndex: 10,
        width: "40px",
        height: "40px",
      }}
      onClick={onClick}
    />
  );
};

// Custom Next Arrow
const NextArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        right: "10px",
        zIndex: 10,
        width: "40px",
        height: "40px",
      }}
      onClick={onClick}
    />
  );
};

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    
  };

  const images = [
    "/slider/1.jpeg",
    "/slider/2.jpeg",
    "/slider/3.jpeg",
    "/slider/4.jpeg",
    "/slider/5.jpeg",
    "/slider/6.jpeg",
    "/slider/7.jpeg",
    "/slider/8.jpeg",
    "/slider/9.jpeg",
    "/slider/10.jpeg",
    "/slider/11.jpeg",
  ];

  return (
    <div style={{ width: "95vw", margin:'0 auto', borderRadius:'2rem',padding: "10px" ,borderBlockColor:'black'}}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slide-container">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "auto", // Adjust height to maintain aspect ratio
                maxHeight: "400px", // Maximum height for larger screens
                objectFit: "cover",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
