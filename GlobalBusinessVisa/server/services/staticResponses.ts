/**
 * Static responses for the chat service when OpenAI API is not available
 * This provides basic responses to common questions without requiring the OpenAI API
 */

type ResponseRule = {
  keywords: string[];
  response: string;
};

// Define response rules based on keywords
const responseRules: ResponseRule[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'howdy'],
    response: 'Hello! Welcome to Global Business Pay Visa Cards portal. How can I assist you with our premium cryptocurrency-powered Visa card services today?'
  },
  {
    keywords: ['card', 'cards', 'visa', 'what cards', 'types of cards', 'offer'],
    response: 'Global Business Pay offers 6 premium Visa cards:\n\n1. Basic Premium Visa - Our entry-level card with essential features\n2. Gold Visa - Enhanced benefits for frequent travelers\n3. Platinum Visa - Premium benefits with higher spending limits\n4. World Visa - Exclusive global privileges for business executives\n5. World Elite Visa - Our most prestigious card with unlimited concierge service\n6. Business Visa - Tailored specifically for business expenses and management\n\nEach card has unique benefits tailored to different needs. You can view all options on our Cards page.'
  },
  {
    keywords: ['basic premium', 'basic card'],
    response: 'The Basic Premium Visa is our entry-level card that combines essential features with affordability. It includes:\n• Global acceptance at millions of locations\n• Basic travel insurance coverage\n• Fraud protection and 24/7 support\n• Competitive exchange rates for international purchases\n• Online account management\n\nIt\'s perfect for those beginning their business journey or who need a reliable secondary card.'
  },
  {
    keywords: ['gold', 'gold card', 'gold visa'],
    response: 'The Gold Visa provides enhanced benefits for frequent travelers and business professionals. Features include:\n• 2% cashback on all business purchases\n• Comprehensive travel insurance\n• Car rental collision coverage\n• Airport lounge access (4 visits per year)\n• No foreign transaction fees\n• Extended warranty on purchases\n\nThe Gold card is ideal for professionals who travel regularly for business.'
  },
  {
    keywords: ['platinum', 'platinum card', 'platinum visa'],
    response: 'The Platinum Visa offers premium benefits with higher spending limits for established business professionals. Benefits include:\n• 3% cashback on travel and dining\n• Premium travel insurance with trip cancellation\n• Unlimited airport lounge access\n• Hotel elite status and upgrades\n• Dedicated customer service line\n• Higher spending limits\n• Emergency card replacement worldwide\n\nPerfect for executives who require premium travel benefits and higher spending capacity.'
  },
  {
    keywords: ['world', 'world card', 'world visa'],
    response: 'The World Visa provides exclusive global privileges for business executives and frequent international travelers. It offers:\n• 4% cashback on international purchases\n• Comprehensive global medical and evacuation insurance\n• VIP airport services and expedited security\n• Luxury hotel collection benefits and room upgrades\n• Fine dining reservations assistance\n• Personal travel and lifestyle consultant\n• No preset spending limit\n\nIdeal for global executives managing international business operations.'
  },
  {
    keywords: ['world elite', 'elite', 'elite card', 'world elite visa'],
    response: 'The World Elite Visa is our most prestigious offering with unparalleled benefits:\n• 5% cashback on all purchases\n• Ultimate travel protection and insurance\n• Private jet booking assistance\n• Global event access and VIP experiences\n• Unlimited concierge service\n• No preset spending limit\n• Invitation-only exclusive events\n• Luxury gifts and experiences\n\nThis invitation-only card represents the pinnacle of our premium card offerings.'
  },
  {
    keywords: ['business', 'business card', 'business visa'],
    response: 'The Business Visa is specifically designed for company expenses and management:\n• Separate cards for employees with individual limits\n• Detailed expense reporting and categorization\n• Integration with accounting software\n• 3% cashback on office supplies and business services\n• Receipt management tools\n• Purchase controls and real-time notifications\n• Dedicated business support team\n\nPerfect for businesses looking to streamline expense management while earning rewards.'
  },
  {
    keywords: ['price', 'pricing', 'cost', 'fee', 'fees', 'charges', 'how much'],
    response: 'Our card pricing varies based on the tier you select:\n\n• Basic Premium: 0.05 BNB (approximately $30 USD)\n• Gold: 0.15 BNB (approximately $90 USD)\n• Platinum: 0.35 BNB (approximately $210 USD)\n• World: 0.75 BNB (approximately $450 USD)\n• World Elite: 1.5 BNB (approximately $900 USD)\n• Business: 0.45 BNB (approximately $270 USD)\n\nAll prices are shown in both BNB and USD on our Cards page with real-time conversion rates.'
  },
  {
    keywords: ['bnb', 'binance', 'crypto', 'cryptocurrency', 'payment', 'pay', 'buy with'],
    response: 'We accept multiple cryptocurrencies as payment methods including BNB (Binance Coin), BTC (Bitcoin), ETH (Ethereum), and TRX (Tron). Our platform displays real-time exchange rates from CoinGecko for each cryptocurrency against USD. Your card price is calculated in real-time based on current market rates when viewing the order page. Your payment is securely processed through our blockchain-based system, ensuring transparent and immutable transaction records. If you need assistance with crypto purchasing or transfers, our support team can guide you through the process.'
  },
  {
    keywords: ['real-time', 'rates', 'price updates', 'current price', 'exchange rates'],
    response: 'Our platform fetches real-time cryptocurrency prices from CoinGecko every 5 minutes. This ensures you always see the most current conversion rates when ordering your Global Business Pay Visa card. We support multiple cryptocurrencies including BTC, ETH, BNB, and TRX, with prices displayed in USD. The exact cryptocurrency amount required for your card purchase is calculated dynamically based on these current rates.'
  },
  {
    keywords: ['btc', 'bitcoin', 'eth', 'ethereum', 'trx', 'tron'],
    response: 'Global Business Pay accepts multiple cryptocurrencies including:\n• BTC (Bitcoin)\n• ETH (Ethereum)\n• BNB (Binance Coin)\n• TRX (Tron)\n\nYou can pay with your preferred cryptocurrency when ordering your Visa card. Our platform converts the card price from USD to your chosen cryptocurrency using real-time exchange rates from CoinGecko. This ensures you always pay the correct amount based on current market values.'
  },
  {
    keywords: ['benefit', 'benefits', 'perks', 'features', 'what do i get'],
    response: 'Global Business Pay Visa cards offer numerous benefits depending on tier level:\n\n• Worldwide Acceptance: Use your card at millions of locations globally\n• Cashback Rewards: Earn from 1-5% depending on card tier\n• Travel Benefits: From basic insurance to comprehensive coverage\n• Lounge Access: Available on Gold tier and above\n• Concierge Services: Available on Platinum tier and above\n• Purchase Protection: Coverage for damages or theft of purchases\n• Extended Warranty: Additional coverage beyond manufacturer warranty\n• Fraud Protection: 24/7 monitoring and zero liability\n\nVisit our Benefits page for complete details on each card\'s specific offerings.'
  },
  {
    keywords: ['order', 'buy', 'purchase', 'get', 'how to get', 'apply'],
    response: 'To order a Global Business Pay Visa card:\n\n1. Browse our Cards page to compare options\n2. Select your preferred card and click "View Details"\n3. Click the "Get This Card" button\n4. Complete the application form with your personal information\n5. Select your preferred cryptocurrency for payment (BTC, ETH, BNB, or TRX)\n6. Upload your payment receipt\n7. Submit your order\n8. Receive order confirmation via email\n\nThe exact amount of cryptocurrency needed is calculated in real-time based on current exchange rates from CoinGecko. Your card will be processed and shipped once your application and payment are verified. Note that the GlobalBusinessPay ID field is optional during the order process.'
  },
  {
    keywords: ['gbp id', 'globalbusinesspay id', 'id requirement'],
    response: 'The GlobalBusinessPay ID field on our order form is now optional. You can complete your card application without providing this information. We\'ve streamlined our application process to make it easier and faster for customers to complete their orders while maintaining our high security standards.'
  },
  {
    keywords: ['coingecko', 'price api', 'price updates', 'api'],
    response: 'Our platform now uses the CoinGecko API to fetch real-time cryptocurrency prices. This integration ensures you always see the most accurate and up-to-date conversion rates when ordering your Global Business Pay Visa card. The system updates prices every 5 minutes to maintain accuracy while optimizing performance. This reliable price data helps you make informed decisions about your cryptocurrency payments.'
  },
  {
    keywords: ['status', 'order status', 'track', 'tracking', 'where is my card'],
    response: 'After placing an order, you\'ll receive a confirmation email with your order details and tracking information. Your order will progress through these stages:\n\n1. Application Review (1-2 business days)\n2. Payment Verification (1 business day)\n3. Card Production (3-5 business days)\n4. Shipping (2-5 business days depending on location)\n\nYou can check your order status by contacting our support team with your order number at support@globalbusinesspay.com.'
  },
  {
    keywords: ['support', 'help', 'contact', 'assistance', 'chat', 'talk to someone'],
    response: 'Our support team is available 24/7 through multiple channels:\n\n• Live Chat: Available right here on our website\n• Email: support@globalbusinesspay.com\n• Phone: +1-800-BNB-VISA\n• Social Media: Direct message on our official channels\n\nFor urgent card-related issues like loss or theft, please call our dedicated emergency line at +1-888-BNB-HELP for immediate assistance.'
  },
  {
    keywords: ['time', 'delivery', 'receive', 'shipping', 'when will i get', 'how long'],
    response: 'Standard card delivery timeframes:\n\n• North America: 5-7 business days\n• Europe: 7-10 business days\n• Asia: 10-14 business days\n• Rest of World: 14-21 business days\n\nExpress delivery options (additional fee):\n• North America: 2-3 business days\n• Europe: 3-5 business days\n• Asia: 5-7 business days\n• Rest of World: 7-10 business days\n\nDelivery begins after order confirmation and payment verification. All cards require signature upon delivery.'
  },
  {
    keywords: ['cancel', 'cancellation', 'refund', 'money back'],
    response: 'For order cancellations or refund requests:\n\n• Pre-production: Full refund available within 24 hours of placing your order\n• Production stage: 75% refund available if cancelled before shipping\n• Shipped: No refund available once card has been shipped\n\nTo request a cancellation or refund, contact our support team immediately at support@globalbusinesspay.com with your order number and reason for cancellation.'
  },
  {
    keywords: ['activate', 'activation', 'start using'],
    response: 'Once you receive your Global Business Pay Visa card, you must activate it before use:\n\n1. Visit our secure activation portal at activate.globalbusinesspay.com\n2. Enter your card number and the security code provided in your welcome packet\n3. Verify your identity using the authentication method you selected during application\n4. Create your PIN\n5. Accept the terms and conditions\n\nAlternatively, call the activation number on the card sticker. For security purposes, the card will only work after proper activation.'
  },
  {
    keywords: ['limit', 'limits', 'spending', 'maximum', 'how much can i spend'],
    response: 'Spending limits by card tier (monthly):\n\n• Basic Premium: Up to $10,000 USD\n• Gold: Up to $25,000 USD\n• Platinum: Up to $50,000 USD\n• World: Up to $100,000 USD\n• World Elite: Customized limits based on usage\n• Business: Configurable limits per card and employee\n\nLimits can be adjusted based on account history and business verification. Temporary limit increases are available for special purchases by contacting our support team.'
  },
  {
    keywords: ['security', 'secure', 'safe', 'protection', 'fraud', 'theft', 'stolen'],
    response: 'Global Business Pay Visa cards feature comprehensive security measures:\n\n• EMV Chip Technology: Advanced encryption for in-person transactions\n• Tokenization: Secure online purchases without revealing card details\n• Real-time Fraud Monitoring: 24/7 transaction surveillance\n• Instant Alerts: Real-time notifications for all transactions\n• Zero Liability: Protection against unauthorized charges\n• Biometric Authentication: Fingerprint and facial recognition for mobile app access\n• Temporary Card Lock: Instantly freeze your card if misplaced\n\nIf you suspect fraud, contact our security team immediately at +1-800-BNB-SAFE.'
  },
  {
    keywords: ['reward', 'rewards', 'points', 'cashback', 'earn'],
    response: 'Our Global Business Pay reward program offers:\n\n• Basic Premium: 1% cashback on all purchases\n• Gold: 2% cashback, plus bonus points on travel\n• Platinum: 3% cashback, plus hotel and airline benefits\n• World: 4% cashback, plus exclusive event access\n• World Elite: 5% cashback, plus concierge-arranged experiences\n• Business: Customizable rewards focused on business categories\n\nRewards are automatically credited to your account monthly and can be redeemed for statement credits, travel, gift cards, or merchandise through our rewards portal.'
  },
  {
    keywords: ['require', 'requirements', 'qualify', 'eligibility', 'who can get'],
    response: 'Eligibility requirements for Global Business Pay Visa cards:\n\n• Basic Premium: Valid ID, 18+ years old, basic credit check\n• Gold: Good credit history, minimum 1 year in business\n• Platinum: Excellent credit, minimum $100K annual business revenue\n• World: Exceptional credit, minimum $500K annual business revenue\n• World Elite: Invitation only, based on platinum card usage and business profile\n• Business: Business registration documents, good company credit standing\n\nAll applications require identity verification and business documentation where applicable.'
  },
  {
    keywords: ['travel', 'abroad', 'foreign', 'international', 'countries'],
    response: 'Global Business Pay Visa cards offer exceptional international benefits:\n\n• Global Acceptance: Use your card in over 200 countries and territories\n• No Foreign Transaction Fees: On Gold tier and above\n• International ATM Access: Withdraw local currency worldwide\n• Travel Insurance: Coverage increases with card tier\n• Emergency Assistance: 24/7 help in multiple languages\n• Card Replacement: Emergency card replacement when traveling\n• Visa Global Customer Assistance: Phone support from anywhere\n\nHigher tier cards include additional benefits like airport lounge access, concierge services, and hotel upgrades.'
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
    response: 'You\'re welcome! I\'m happy to assist with information about our Global Business Pay Visa cards. If you have any other questions about our cards, benefits, or application process, feel free to ask. We\'re committed to providing you with the best possible service and finding the perfect card solution for your needs.'
  },
  {
    keywords: ['website', 'navigation', 'find', 'where is', 'locate', 'site', 'page'],
    response: 'Our website is designed for easy navigation:\n\n• Home: Overview of our services and featured cards\n• Cards: Browse and compare all card options\n• Benefits: Detailed information on card perks and features\n• Order: Application and purchase flow\n• Support: FAQs and contact information\n\nYou can access these pages through the navigation menu at the top of any page. If you\'re looking for something specific, you can use the search feature in the top right corner.'
  },
  {
    keywords: ['interest', 'rate', 'apr', 'annual percentage', 'charges'],
    response: 'Global Business Pay Visa cards operate on a charge card model rather than a credit card model. This means:\n\n• No revolving credit or interest charges\n• Full balance payment required each billing cycle\n• No interest rate or APR to worry about\n• Late payment fees apply if payment deadline is missed\n\nThis structure helps cardholders avoid debt accumulation while maintaining spending discipline. For specific fee schedules, please refer to the terms and conditions for each card.'
  },
  {
    keywords: ['admin', 'administration', 'backend'],
    response: 'I\'m sorry, but I don\'t have information about administrative functions or backend systems. I\'m here to help with customer-facing features of Global Business Pay Visa cards. For any customer service needs, I\'d be happy to assist or direct you to the appropriate support channel.'
  }
];

// Default fallback response when no keywords match
const DEFAULT_RESPONSE = "Thank you for your message. I'm here to help with information about Global Business Pay Visa cards. You can ask about our different card types, pricing, benefits, application process, or anything else related to our services. For specific questions about your account or application, please contact our customer support team at support@globalbusinesspay.com or call us at +1-800-BNB-VISA.";

/**
 * Get a response based on the user's message
 * @param userMessage The user's message text
 * @returns An appropriate response
 */
export function getStaticResponse(userMessage: string): string {
  const lowercaseMessage = userMessage.toLowerCase();
  
  console.log("Static Response - Processing message:", userMessage);
  
  // General questions about the site or service
  if (lowercaseMessage.includes('about this site') || 
      lowercaseMessage.includes('what is this') || 
      lowercaseMessage.includes('what is global business') || 
      lowercaseMessage.includes('what do you do') || 
      lowercaseMessage.includes('tell me more') || 
      lowercaseMessage.includes('what is your service') ||
      lowercaseMessage.includes('what services')) {
    return 'Global Business Pay is a premium financial services platform specializing in Visa cards for international business professionals. We offer six different card tiers, each designed with specific benefits to meet various business needs. Our cards are accepted worldwide and include features like cashback rewards, travel benefits, and enhanced security. All transactions are processed using BNB (Binance Coin) for secure and efficient payments with competitive exchange rates.';
  }

  // Add special handling for questions about the website/site
  if (lowercaseMessage.includes('website') || 
      (lowercaseMessage.includes('site') && !lowercaseMessage.includes('visit'))) {
    return 'Our website is designed for easy navigation:\n\n• Home: Overview of our services and featured cards\n• Cards: Browse and compare all card options\n• Benefits: Detailed information on card perks and features\n• Order: Application and purchase flow\n• Support: FAQs and contact information\n\nYou can access these pages through the navigation menu at the top of any page.';
  }
  
  // Add special handling for card-related queries
  if (lowercaseMessage.includes('what cards') || 
      lowercaseMessage.includes('which cards') || 
      lowercaseMessage.includes('card types') || 
      lowercaseMessage.includes('card options') ||
      (lowercaseMessage.includes('offer') && lowercaseMessage.includes('card')) ||
      lowercaseMessage === 'cards' ||
      lowercaseMessage.includes('types of card') ||
      lowercaseMessage.includes('kinds of card')) {
    return 'Global Business Pay offers 6 premium Visa cards:\n\n1. Basic Premium Visa - Our entry-level card with essential features\n2. Gold Visa - Enhanced benefits for frequent travelers\n3. Platinum Visa - Premium benefits with higher spending limits\n4. World Visa - Exclusive global privileges for business executives\n5. World Elite Visa - Our most prestigious card with unlimited concierge service\n6. Business Visa - Tailored specifically for business expenses and management\n\nEach card has unique benefits tailored to different needs. You can view all options on our Cards page.';
  }
  
  // Add special handling for specific card information
  if (lowercaseMessage.includes('world elite')) {
    return 'The World Elite Visa is our most prestigious offering with unparalleled benefits:\n• 5% cashback on all purchases\n• Ultimate travel protection and insurance\n• Private jet booking assistance\n• Global event access and VIP experiences\n• Unlimited concierge service\n• No preset spending limit\n• Invitation-only exclusive events\n• Luxury gifts and experiences\n\nThis invitation-only card represents the pinnacle of our premium card offerings.';
  }
  
  if (lowercaseMessage.includes('basic premium')) {
    return 'The Basic Premium Visa is our entry-level card that combines essential features with affordability. It includes:\n• Global acceptance at millions of locations\n• Basic travel insurance coverage\n• Fraud protection and 24/7 support\n• Competitive exchange rates for international purchases\n• Online account management\n\nIt\'s perfect for those beginning their business journey or who need a reliable secondary card.';
  }
  
  // Handle admin-related questions by directing to customer support
  if (lowercaseMessage.includes('admin') || 
      lowercaseMessage.includes('administrator') || 
      lowercaseMessage.includes('backend') || 
      lowercaseMessage.includes('login') || 
      lowercaseMessage.includes('dashboard') ||
      lowercaseMessage.includes('management') ||
      lowercaseMessage.includes('manage orders') ||
      lowercaseMessage.includes('change price') ||
      lowercaseMessage.includes('control panel')) {
    return 'I\'m sorry, but I don\'t have information about administrative functions or backend systems. I\'m here to help with customer-facing features of Global Business Pay Visa cards. For any administrative assistance, please contact our support team at support@globalbusinesspay.com.';
  }
  
  // Check each rule for keyword matches with more specific matching
  // Sort rules by keyword length (descending) to prioritize more specific matches first
  const sortedRules = [...responseRules].sort((a, b) => {
    const maxLengthA = Math.max(...a.keywords.map(k => k.length));
    const maxLengthB = Math.max(...b.keywords.map(k => k.length));
    return maxLengthB - maxLengthA;
  });
  
  for (const rule of sortedRules) {
    // More specific matching to avoid false positives
    // The keyword must either be a standalone word or part of a longer word
    if (rule.keywords.some(keyword => {
      // Create a regex pattern that looks for the keyword as a whole word
      const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
      return pattern.test(lowercaseMessage);
    })) {
      console.log("Static Response - Found matching rule with keywords:", rule.keywords);
      return rule.response;
    }
  }
  
  // If no rules match, return the default response
  console.log("Static Response - No matching rules found, using default response");
  return DEFAULT_RESPONSE;
}