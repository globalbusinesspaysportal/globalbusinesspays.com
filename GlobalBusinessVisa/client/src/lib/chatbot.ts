// Chatbot for providing assistance with card purchases
const TRIGGER_WORDS = {
  PURCHASE: ['buy', 'purchase', 'order', 'get card', 'card', 'visa', 'payment', 'pay', 'cost', 'price'],
  BNB: ['bnb', 'binance', 'crypto', 'cryptocurrency', 'payment method', 'pay with', 'wallet'],
  HELP: ['help', 'support', 'assistance', 'guide', 'how to', 'steps', 'process'],
  RECEIPT: ['receipt', 'confirm', 'transaction', 'upload', 'proof', 'payment confirmation'],
  CONTACT: ['contact', 'email', 'phone', 'reach', 'support'],
  TIMING: ['time', 'long', 'activate', 'activation', 'wait', 'hours', 'days'],
};

// Helper to check if message includes any of the trigger words
const messageContains = (message: string, triggerArray: string[]): boolean => {
  const lowerCaseMessage = message.toLowerCase();
  return triggerArray.some(word => lowerCaseMessage.includes(word));
};

// Chatbot responses based on message content
const getBotResponse = (message: string): string => {
  const lowerCaseMessage = message.toLowerCase();
  
  // Welcome/greeting response
  if (
    lowerCaseMessage.includes('hello') ||
    lowerCaseMessage.includes('hi') ||
    lowerCaseMessage.includes('hey')
  ) {
    return "Hello! Welcome to GlobalBusinessPay support. I'm here to help you with your Visa card purchase. How can I assist you today?";
  }
  
  // Purchase process explanation
  if (messageContains(message, TRIGGER_WORDS.PURCHASE)) {
    return "To purchase a GlobalBusinessPay Visa card, follow these steps:\n\n1. Browse our card selection and choose the card type that suits your needs\n2. Click on your preferred card to view details\n3. Click 'Get This Card' to proceed to the order page\n4. Send the required BNB amount to the payment address\n5. Fill in your details and upload your transaction receipt\n\nYour card will be activated within 10 hours of confirmed payment. Would you like more information about any specific step?";
  }
  
  // BNB payment instructions
  if (messageContains(message, TRIGGER_WORDS.BNB)) {
    return "We accept payments in BNB (Binance Coin) on the BNB Smart Chain. When you select a card, you'll see the exact BNB amount required and a QR code to scan with your wallet app. The payment address is: 0x14a7e07171915B51564674c1d8025C5bBB38889f. Make sure to send the exact amount shown for your selected card.";
  }
  
  // Receipt upload help
  if (messageContains(message, TRIGGER_WORDS.RECEIPT)) {
    return "After sending your BNB payment, you'll need to upload your transaction receipt. On the order form page, you can upload a screenshot or PDF of your transaction confirmation from your wallet or exchange. This helps us verify your payment and process your card activation faster.";
  }
  
  // Timing/activation information
  if (messageContains(message, TRIGGER_WORDS.TIMING)) {
    return "Once your payment is confirmed and your order is submitted with a valid receipt, your GlobalBusinessPay Visa card will be activated within 10 hours. You'll receive confirmation to the email address you provided during the order process.";
  }
  
  // Contact information
  if (messageContains(message, TRIGGER_WORDS.CONTACT)) {
    return "For additional support, you can reach our customer service team at support@globalbusinesspays.com. Our support hours are 24/7, and we're always happy to assist with any questions about your card order or account.";
  }
  
  // General help response
  if (messageContains(message, TRIGGER_WORDS.HELP)) {
    return "I'd be happy to help! Here are some topics I can assist with:\n\n- Card purchase process\n- BNB payment instructions\n- Receipt upload requirements\n- Card activation timing\n- Contact information\n\nPlease let me know what you'd like to learn more about.";
  }
  
  // Default response for unrecognized queries
  return "Thank you for your message. I can help with information about our Visa cards, the purchase process, payment methods, and activation timing. Please let me know what specific information you're looking for about GlobalBusinessPay cards.";
};

export { getBotResponse };