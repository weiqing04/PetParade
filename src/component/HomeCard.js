import React from "react";
import './HomeCard.css';

const HomeCard = ({ image, name, cost }) => {
    return (
        <div className="home-card">
            <img src={image} alt={name} className="top-product-image" />
            <h3 className="top-product-name">{name}</h3>
            <p className="top-price">{cost}</p>
        </div>
    );
};

export default HomeCard;