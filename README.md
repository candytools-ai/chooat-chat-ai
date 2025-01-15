# Chooat AI Chatbot

An Open-Source AI Chat Platform Powered by Leading AI Models

Welcome to [Chooat](https://chooat.com) AI Chat, an open-source project designed to provide a seamless and powerful AI chat experience.


## 🚀 Features
- Multi-Model Integration: Chat with the best AI models, including ChatGPT, Claude, and Gemini, all in one platform.
- Dynamic Conversations: Supports natural, responsive, and context-aware interactions.
- Customizable Architecture: Easily integrate other AI models or adjust configurations to suit your needs.
- User-Friendly Interface: Designed for accessibility and simplicity, suitable for both developers and end-users.
- Scalable Backend: Optimized for performance and scalability to handle multiple chat sessions simultaneously.


## 🎯 Why Chooat AI Chat?

Chooat AI Chat is built to help developers, researchers, and enthusiasts:
- Quickly set up an AI chat platform.
- Experiment with multi-model conversational AI.
- Customize and extend the platform for their specific use cases.


## 🛠️ Tech Stack

- Next.js
- Vercel AI SDK
- Next-Auth for user auth
- Drizzle ORM + postgres for data processing
- Cloudflare R2
- TailwindCSS
- Shadcn UI


## 🚀 Quick Start

Follow these steps to get started:

1. Clone the repository:

```
git clone https://github.com/candytools-ai/chooat-chat-ai.git  
cd chooat-ai-chat  
```

2. Install dependencies:

```
pnpm install
```

3. Set up API keys:

- Obtain API keys for your preferred AI models (e.g., OpenAI, Anthropic).
- Add your keys to the .env.local file :

```
# GOOGLE
GOOGLE_ID=
GOOGLE_SECRET=

# GITHUB
GITHUB_ID=
GITHUB_SECRET=

AUTH_SECRET=
NEXTAUTH_SECRET=

POSTGRES_URL=
AUTH_DRIZZLE_URL=

OPENROUTER_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=

R2_ACCOUNT_ID=
R2_BUCKET=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_DOMAIN_URL=
```


4. Run the app:

```
pnpm dev
```


5. Access the platform:
Open your browser and navigate to http://localhost:3000.


Deploy on Vercel (Don't forget to setup env)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/candytools-ai/chooat-chat-ai.git&project-name=chooat-chat-ai&repository-name=chooat-chat-ai)


## 🤝 Contributing

We welcome contributions to Chooat AI Chat! Here’s how you can help:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.


## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.


## 🧑‍💻 Link Me

For questions, discussions, or support, join our community forum or connect with us on Twitter.
Twitter: [https://x.com/ChooatAI](https://x.com/ChooatAI)