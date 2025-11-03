import React from 'react';
import FAQSection from '../../component/FAQSection';
import './FAQCategory.css';

const PaymentFAQ = () => {
  const paymentQuestions = [
    { question: 'What payment methods are accepted?', answer: 'We accept all major credit cards, E-Wallet such as Shoppee Pay, and Touch N Go ewallet.' },
    { question: 'Is my payment information secure?', answer: 'Yes, we use SSL encryption to ensure that your payment information is secure.' },
    { question: 'Can I save my payment information for future purchases?', answer: 'Yes, you can save your payment details securely on your account for quicker checkouts.' },
    { question: 'Can I use multiple payment methods for a single order?', answer: 'No, only one payment method can be used per order. You can choose from the available payment options at checkout.' },
    { question: 'Will I be charged any extra fees for using certain payment methods?', answer: 'No, there are no extra fees for using any of our available payment methods, including credit cards and e-wallets.' },

    // Add more questions and answers here
  ];

  return (
    <div className="faq-category-page">
      <h2>Payment FAQ</h2>
      <FAQSection questions={paymentQuestions} />
    </div>
  );
};

export default PaymentFAQ;
