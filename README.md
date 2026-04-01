# Vi-Notes

Vi-Notes is a paste-detection web app that monitors when text is pasted into an editor instead of typed manually. It records each paste event and stores metadata such as character count, word count, and line count, then shows the results in a report view.

---
## Features

- Start a writing session
- Detect paste events inside the editor
- Record pasted:
  - characters
  - words
  - lines
  - timestamp
  - optional cursor position
- Save current session text
- Persist session data in MongoDB
- View paste-event history on a report page
- Download the report as PDF using the browser print dialog

---
## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---
## Project Structure

```bash
VI-NOTES/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── WritingSession.js
│   │   └── routes/
│   │       └── sessionRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── EditorPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   └── ReportPage.tsx
│   │   ├── services/
│   │   │   └── sessionApi.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── eslint.config.js
│
└── README.md
```
---
## How It Works
1. **Session Start:** A user opens the editor to begin a writing session.
2. **Detection:** If the user pastes text, the app intercepts the event.
3. **Recording:** The app records metadata including:
    * Paste timestamp
    * Character, word, and line counts
    * Cursor selection positions (if available)
4. **Storage:** Data is persisted in **MongoDB** under the active session.
5. **Reporting:** The report page aggregates and displays all paste events for that session.

---
## Data Schema

### Session Data
Each session object contains:
* `userId`
* `startedAt`
* `currentText`
* `pasteEvents` (Array)
* `totalPastedChars`

### Paste Event Data
Each event within a session contains:
* `timestamp`
* `charCount`
* `wordCount`
* `lineCount`
* `cursorStart` / `cursorEnd`

---

## API Endpoints

| Action | Method | Endpoint |
| :--- | :--- | :--- |
| **Start Session** | `POST` | `/api/sessions/start` |
| **Get Session** | `GET` | `/api/sessions/:sessionId` |
| **Update Text** | `POST` | `/api/sessions/:sessionId/text` |
| **Record Paste** | `POST` | `/api/sessions/:sessionId/paste-event` |

### Example Paste Event Payload:
```json
{
  "timestamp": 1712345678901,
  "charCount": 120,
  "wordCount": 22,
  "lineCount": 3,
  "cursorStart": 15,
  "cursorEnd": 15
}
```
---
## Local Setup
1. Clone the repository
```Bash
git clone <your-repo-url>
cd VI-NOTES
```
2. Setup Backend
```Bash
cd backend
npm install
```
Create a .env file in backend/:

```Code snippet
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Run the server:

```Bash
npm run dev # or npm start
```
3. Setup Frontend
Open a new terminal:

```Bash
cd frontend
npm install
npm run dev
```
* Frontend: http://localhost:5173

* Backend: http://localhost:5000

### Usage
1. Open the app and navigate to the editor.

2. Paste text into the textarea.

3. Navigate to the Report page to review event timestamps, character counts, and totals.

4. Download PDF: Click the "Download PDF" button to trigger the browser's print flow (Save as PDF).

---
## Scope & Future Roadmap
### Current Scope
✅ Real-time paste detection

✅ Session persistence

✅ Report generation

✅ PDF export (via browser print)

### Not Included
❌ Typing behavior/keystroke dynamics

❌ AI-generated text detection

❌ ML-based authorship classification

### Future Improvements
* Suspicious segment highlighting

* Direct server-side PDF generation

* User Authentication & session history

* Dashboard analytics and charts

* CSV report exports
---
## Author

Pratyush Tiwari  

Internship ID: WIN251017

Cohort: Euclideans
