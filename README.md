# MoodFlow 🌊
### AI-Powered Personal Mood Companion

MoodFlow is a sophisticated emotional intelligence platform designed to help users track, understand, and regulate their moods in real-time. By leveraging the power of Gemini AI, MoodFlow provides personalized interventions, deep emotional analytics, and a structured discipline engine to help you maintain your "Flow."

---

## 🚀 Features

- **Multimodal Mood Detection**: Express yourself via text or voice. Our AI classifies your state across 12 distinct emotional categories.
- **AI-Powered Interventions**: Receive personalized jokes, quotes, tasks, or Hindi song recommendations (YouTube integrated) based on your current vibe.
- **Self-Control Mode**: A specialized 20-second psychological challenge to manage intense urges (Anger, Procrastination, etc.) with streak tracking.
- **Daily Discipline Engine**: A built-in habit tracker for essential routines like meditation and cold showers.
- **Bento Analytics Dashboard**: Visualize your emotional trends, productivity scores, and discipline indices with beautiful charts.
- **AI Insights Engine**: Long-term pattern detection that identifies your emotional cycles and provides actionable life advice.
- **Privacy-First Logging**: Local-first logging with auto-cleanup rules and data management.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **AI Engine**: Google Gemini 3 Flash (via `@google/genai`)
- **Styling**: Tailwind CSS (Modern utility-first approach)
- **Animations**: Motion (formerly Framer Motion)
- **Charts**: Recharts (D3-based React charts)
- **Icons**: Lucide React
- **Voice**: Web Speech API

---

## 📐 High-Level Architecture

MoodFlow is built with a modular service-oriented architecture:

- **Classification Layer**: Processes raw text/voice into emotional labels.
- **Intervention Layer**: Generates contextual content using generative AI.
- **Persistence Layer**: Manages local state and historical logs.
- **Analytics Layer**: Aggregates data for trend visualization and insight generation.

### 🔄 Mood Detection to Intervention Flow

```mermaid
graph TD
    A[User Input: Text/Voice] --> B{AI Classification}
    B -->|Confidence > 60%| C[Identify Mood]
    B -->|Confidence < 60%| D[Ask for Clarification]
    C --> E{Intervention Engine}
    E --> F[Joke/Quote/Song/Task]
    E -->|Urge Detected| G[Self-Control Mode]
    G --> H[20s Challenge]
    F --> I[Log Entry]
    H --> I
```

### 🧘 Daily Discipline & Habit Logic

```mermaid
graph LR
    A[Daily Discipline] --> B[Morning Meditation]
    A --> C[Cold Shower]
    A --> D[No Junk Food]
    B --> E[Toggle Completion]
    E --> F[Update Analytics]
    F --> G[AI Insight Generation]
```

### 🛡️ Self-Control Decision Flow

```mermaid
graph TD
    A[Mood: Horny/Angry/Procrastinating] --> B[Trigger Self-Control]
    B --> C[Psychological Dialogue]
    C --> D[Alternative Suggestions]
    D --> E[Start 20s Timer]
    E -->|Success| F[Increment Streak]
    E -->|Fail| G[Reset/Retry]
```

---

## 📅 Development Flow (10 Phases)

1.  **Phase 1**: Project Definition & Environment Setup.
2.  **Phase 2**: Mood Classification Engine (Gemini Integration).
3.  **Phase 3**: Voice-to-Mood Integration (Web Speech API).
4.  **Phase 4**: Content Generation Module (Personalized Interventions).
5.  **Phase 5**: Self-Control Mode (Psychological 20s Challenge).
6.  **Phase 6**: Hindi Song Integration (YouTube Search Mapping).
7.  **Phase 7**: Mood Analytics Dashboard (Recharts Visualization).
8.  **Phase 8**: Logging & Behavior Tracking System.
9.  **Phase 9**: Daily Discipline Engine & Habit Tracking.
10. **Phase 10**: Final App Integration & Professional Refactoring.

---

## 📂 Folder Structure

```text
/src
  /components
    /home         # HabitTracker, MoodInput, InterventionView
    /stats        # AnalyticsDashboard
    /settings     # SettingsView
    /layout       # Navigation
  /services       # geminiService, analyticsService
  /lib            # Shared utilities (cn helper)
  /types.ts       # Global interfaces
  /constants.tsx  # Mood/Habit configurations
  /App.tsx        # Main Orchestrator
  /main.tsx       # Entry Point
```

---

## ⚙️ Setup & Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/moodflow.git
    cd moodflow
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root and add your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

## 📖 Usage Guide

1.  **Morning Routine**: Start your day by checking off your "Daily Discipline" habits.
2.  **Mood Logging**: When you feel a shift in your "Flow," select a mood icon or click the microphone to speak your thoughts.
3.  **Intervention**: Follow the AI's suggestion. If it's a song, click the action button to open it on YouTube.
4.  **Self-Control**: If you're struggling with an urge, enter the 20s challenge and focus on the alternative actions provided.
5.  **Review**: Head to the Stats tab weekly to generate "AI Insights" and see how your discipline is affecting your productivity.

---


## 📄 License

MIT License - Feel free to use and adapt this for your own emotional intelligence projects.
