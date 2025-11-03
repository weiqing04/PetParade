import React from 'react';
import FAQSection from '../../component/FAQSection';
import './FAQCategory.css';

const ReturnsFAQ = () => {
  const returnsQuestions = [
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for most products. Please refer to our return policy for specific items.' },
    { question: 'How do I return an item?', answer: 'To return an item, go to your account, select the item, and follow the instructions provided for returning it.' },
    { question: 'Will I get a full refund?', answer: 'Refunds are issued in full, except in cases where the product is damaged or missing parts.' },
    { question: 'Can I exchange an item instead of returning it?', answer: 'Currently, we do not offer exchanges. However, you can return the item and place a new order for a different product.' },
    { question: 'How long does it take to process my return?', answer: 'Returns are typically processed within 7-10 business days after we receive the returned item. You will be notified once your return is complete.' },

    // Add more questions and answers here
  ];

  return (
    <div className="faq-category-page">
      <h2>Returns FAQ</h2>
      <FAQSection questions={returnsQuestions} />
    </div>
  );
};

export default ReturnsFAQ;
