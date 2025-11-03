import React from 'react';
import './FAQ.css'; 

const FAQ = () => {
  const categories = [
    { name: 'Order', icon: 'order_icon.png', link: '/order-faq' },
    { name: 'Payment', icon: 'payment_icon.png', link: '/payment-faq' },
    { name: 'Delivery', icon: 'delivery_icon.png', link: '/delivery-faq' },
    { name: 'Returns', icon: 'returns_icon.png', link: '/returns-faq' },
  ];

  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      {/* FAQ Categories with Icons */}
      <div className="faq-categories">
        {categories.map((category, index) => (
          <a href={category.link} key={index} className="faq-category">
            <img src={category.icon} alt={category.name} className="faq-category-icon" />
            <span>{category.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
