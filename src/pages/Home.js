import React from "react";
import './Home.css';
import HomeImageCarousel from '../component/homeImageCarousel';
import HomeCard from '../component/HomeCard';

const Home = () => {
  const promoteImages = [
    { src: "/promoted-cover.png", alt: "Scroll Down For More Information" },
    { src: "/promoted-food.png", alt: "2024 Pet Food Best Seller" },
    { src: "/promoted-acces.png", alt: "Hot Deals Pet Accessories" },
    { src: "/promoted-delivery.png", alt: "Delivery Information" },
  ];
  
  <HomeImageCarousel images={promoteImages} />

  const topSellerProducts = [
    {
      image: "/product1.jpg",
      name: "Wet Cat Food",
      cost: "RM 3.99"
    },
    {
      image: "/product3.jpeg",
      name: "Fluffy Cat Bed",
      cost: "RM 12.00"
    },
    {
      image: "/product2.jpg",
      name: "Cat Toy",
      cost: "RM 5.99"
    },
    {
      image: "/product4.jpg",
      name: "Cat health care product",
      cost: "RM 20.00"
    },
  ];

  const topSellerProducts2 = [
    {
      image: "/dog1.jpeg",
      name: "Pedigree Adult Dog Food",
      cost: "RM 3.99"
    },
    {
      image: "/dog2.jpg",
      name: "Fluffy dog Bed",
      cost: "RM 12.00"
    },
    {
      image: "/dog3.jpg",
      name: "Dog Toy",
      cost: "RM 9.99"
    },
    {
      image: "/dog4.jpg",
      name: "Dog health care product",
      cost: "RM 19.99"
    },
  ];

  const topSellerProducts3 = [
    {
      image: "/smallpet1.jpg",
      name: "Fish food",
      cost: "RM 3.99"
    },
    {
      image: "/smallpet2.jpeg",
      name: "Hamster Food",
      cost: "RM 3.99"
    },
    {
      image: "/smallpet3.jpg",
      name: "Bird Food",
      cost: "RM 4.99"
    },
    {
      image: "/smallpet4.jpeg",
      name: "Dog's clothes",
      cost: "RM 20.00"
    },
  ];

  return (
    <div className="home-page">
      {/* Welcome Title Section */}
      <div className="title-container">
        <span className="line"></span>
        <span className="symbol">◊</span>
        <h1 className="title">Welcome To Pet Parade!</h1>
        <span className="symbol">◊</span>
        <span className="line"></span>
      </div>

      {/* Banner with Image Carousel */}
      <div className="banner-section">
        <div className="banner-content">
          <HomeImageCarousel images={promoteImages} />
        </div>
      </div>

      {/* Top Seller Products Section for Cat */}
      <div className="title-container">
        <span className="line"></span>
        <span className="symbol">◊</span>
        <h1 className="title">Top Seller Products</h1>
        <span className="symbol">◊</span>
        <span className="line"></span>
      </div>

      <div className="home-subtitle">
        <h2>Cat</h2>
      </div>

      <div className="top-seller-section">
        {topSellerProducts.map((product, index) => (
          <HomeCard
            key={index}
            image={product.image}
            name={product.name}
            cost={product.cost}
          />
        ))}
      </div>

      <a href="/Product">
        <button className="top-seller-button">View More</button>
      </a>

      {/* Top Seller Products Section for Dog */}
      <div className="home-subtitle">
        <h2>Dog</h2>
      </div>

      <div className="top-seller-section">
        {topSellerProducts2.map((product, index) => (
          <HomeCard
            key={index}
            image={product.image}
            name={product.name}
            cost={product.cost}
          />
        ))}
      </div>

      <a href="/Product">
        <button className="top-seller-button">View More</button>
      </a>

      {/* Top Seller Products Section for Small Pet */}
      <div className="home-subtitle">
        <h2>Small Pet</h2>
      </div>

      <div className="top-seller-section">
        {topSellerProducts3.map((product, index) => (
          <HomeCard
            key={index}
            image={product.image}
            name={product.name}
            cost={product.cost}
          />
        ))}
      </div>

      <a href="/Product">
        <button className="top-seller-button">View More</button>
      </a>
    </div>
  );
};

export default Home;
