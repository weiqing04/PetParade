import React from 'react';
import FAQSection from '../../component/FAQSection';
import './FAQCategory.css';

const OrderFAQ = () => {
  const orderQuestions = [
    { question: 'How do I place an order?', answer: 'To place an order, select the items you want, add them to the cart, and proceed to checkout.' },
    { question: 'Can I modify my order?', answer: 'Once the order is placed and checkout, it cannot be modified. However, you can cancel your order within 30 minutes and place a new one.' },
    { question: 'Can I track my order?', answer: 'Yes, after placing the order, you will receive a tracking number via email.' },
    { question: 'Can I cancel my order after 30 minutes?', answer: 'Unfortunately, you cannot cancel your order after 30 minutes. However, you can return the item once it arrives, following our return policy.' },
    { question: 'What should I do if I receive a damaged or incorrect item?', answer: 'If you receive a damaged or incorrect item, please contact customer support immediately. We will assist you with returning the item and sending a replacement or issuing a refund.' },

    // Add more questions and answers here
  ];

  return (
    <div className="faq-category-page">
      <h2>Order FAQ</h2>
      <FAQSection questions={orderQuestions} />
    </div>
  );
};

export default OrderFAQ;
