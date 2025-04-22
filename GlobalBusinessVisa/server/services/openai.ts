import OpenAI from "openai";

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generate a chat response using OpenAI's GPT model
 * @param userMessage The user's message
 * @param context Optional context to provide to the model
 * @returns The generated response text
 */
export async function generateChatResponse(userMessage: string, context?: string): Promise<string> {
  try {
    // Create system message with context about the application
    const systemMessage = `You are a friendly and helpful AI assistant for the Global Business Pay Visa Card platform. 
Your purpose is to help users with questions about cryptocurrency cards, BNB payment processes, and general account support.
${context ? `\nAdditional context: ${context}` : ''}
Be concise, helpful, and conversational.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Return the response text
    return response.choices[0].message.content || "Sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("Error generating OpenAI response:", error);
    
    // More specific error messages based on the error type
    if (error.code === 'insufficient_quota') {
      return "I apologize, but our AI service is currently experiencing high demand. Please try again in a few moments or contact our customer support for immediate assistance with your card-related questions.";
    } else if (error.status === 429) {
      return "I apologize, but our AI service is temporarily unavailable due to high traffic. Our team has been notified and is working to resolve this. Please try again shortly.";
    } else {
      return "I apologize, but I'm having trouble connecting to my AI service. Please try again later or contact our customer support team for assistance.";
    }
  }
}

/**
 * Generate specific card recommendations based on user needs
 * @param userNeeds Description of user's needs and preferences
 * @returns Recommended card and explanation
 */
export async function generateCardRecommendation(userNeeds: string): Promise<{
  recommendedCard: string;
  explanation: string;
}> {
  try {
    const prompt = `Based on the following customer needs, recommend the most suitable Global Business Pay Visa card from our offerings:
    - Basic Premium Visa: Entry-level card with essential features
    - Gold Visa: Advanced features with premium benefits
    - Platinum Visa: High-tier card with extensive perks
    - World Visa: Global acceptance with exclusive benefits
    - World Elite Visa: Top-tier card with comprehensive coverage
    - Business Visa: Designed for business professionals

    Customer needs: ${userNeeds}

    Respond in JSON format with these fields:
    - recommendedCard: The name of the recommended card
    - explanation: A brief explanation of why this card is recommended (max 100 words)`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a financial advisor specializing in cryptocurrency Visa cards." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const responseContent = response.choices[0].message.content || "{}";
    const parsedResponse = JSON.parse(responseContent);
    
    return {
      recommendedCard: parsedResponse.recommendedCard || "Basic Premium Visa",
      explanation: parsedResponse.explanation || "Based on the available information, this card best meets your needs."
    };
  } catch (error: any) {
    console.error("Error generating card recommendation:", error);
    
    // Provide more specific fallback responses based on error type
    if (error.code === 'insufficient_quota' || error.status === 429) {
      // Handle rate limiting and quota issues
      return {
        recommendedCard: "Basic Premium Visa",
        explanation: "Our AI recommendation system is currently experiencing high demand. Based on typical customer profiles, our Basic Premium Visa is a great starting option with essential features that work well for many customers."
      };
    } else {
      // Default error fallback
      return {
        recommendedCard: "Basic Premium Visa",
        explanation: "I couldn't analyze your specific needs at the moment, but our Basic Premium Visa is a great starting option with essential features that might suit your requirements."
      };
    }
  }
}