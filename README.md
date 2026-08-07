# Diva — Your Socratic Coding Companion

A VS Code / Cursor extension featuring **Diva**, a cute anime-style little girl who lives in your editor, watches you code, and helps you think — but **never gives you the answer**. She only asks Socratic questions, the way rubber-duck debugging works: you find the bug by explaining it.

---

## 1. The Concept

- Diva lives in her own animated panel (her "room") with her own icon in the activity bar.
- She **watches you work** through the editor's APIs and speaks up proactively with short, curious questions.
- She has **expressions and moods** — idle, thinking, curious, skeptical, celebrating — shown as sprite changes.
- Golden rule: **Diva never gives solutions.** Only questions. ("But... what does that variable *actually* have inside it?")

### What she does

| Behavior | Trigger | Example |
|---|---|---|
| Debugging help | You chat with her in her panel | "What did you expect that function to return?" |
| Error reaction | New error appears in your code | "Ooh, a red squiggle! What changed just before it appeared?" |
| Stuck detection | You edit the same lines back and forth | "You've changed that line 4 times... what do you *know* about the bug so far?" |
| Break reminder | 90 min of continuous coding | "What happens to your code quality when you're tired?" |
| Prompt feedback (Cursor only) | You submit a prompt to Cursor's AI chat | "That prompt is pretty vague... what would *you* need to know to answer it?" |

---

## 2. What You Need (Requirements)

### Tools
- **Node.js** (v20+) and **npm**
- **Cursor** (or VS Code) — you already have it
- **Git**

### Accounts / Keys
- **Hugging Face account** (free) → create an **Access Token** at huggingface.co/settings/tokens
  - Used for the LLM (Diva's brain) via the Inference API free tier

### Skills you'll learn along the way (no need to know upfront)
- TypeScript basics
- VS Code Extension API (activation, commands, events)
- Webview API (HTML/CSS/JS panel inside the editor)
- Prompt engineering (persona + guardrails)
- Cursor hooks (intercepting prompt submissions)

---

## 3. Architecture

```
┌──────────────────────────────────────────────┐
│  Diva Extension (TypeScript)                 │
│                                              │
│  extension.ts        → activation, commands  │
│  DivaPanel           → webview: her room,    │
│                        sprites, chat box     │
│  Watcher             → editor events:        │
│                        edits, errors, timers │
│  DivaBrain           → system prompt +       │
│                        guardrails + memory   │
│  StatusBar           → mood indicator (◕‿◕)  │
└──────────────┬───────────────────────────────┘
               │
               ▼
     Hugging Face Inference API
     (chat model, e.g. Llama-3.1-8B-Instruct)

  + Cursor hook (separate script) → reads your
    AI prompts before submission, tells Diva
```

### Where Diva lives
- **Her own activity bar icon** → full-height sidebar panel (her room, where she moves and emotes).
- **Status bar** → always-visible mood indicator.
- **Notifications** → how she "speaks" when her panel is hidden.
- (You can drag her panel to the bottom bar or right sidebar anytime — VS Code allows it.)

### Diva's sprites
6 expressions to start: `idle`, `thinking`, `curious`, `confused`, `skeptical`, `celebrating`.
Generate them with an AI image model (keep the character consistent!) or use placeholders first.

---

## 4. Project Structure

```
diva/
├── src/
│   ├── extension.ts       # entry point
│   ├── divaPanel.ts       # webview provider
│   ├── watcher.ts         # editor activity tracking
│   ├── divaBrain.ts       # LLM calls, prompts, guardrails
│   └── statusBar.ts       # mood indicator
├── media/
│   ├── sprites/           # diva-idle.png, diva-thinking.png, ...
│   └── panel/             # panel.html, panel.css, panel.js
├── hooks/
│   └── prompt-check.js    # Cursor hook script
├── package.json           # extension manifest
└── tsconfig.json
```

---

## 5. Build Plan (step by step, each step is a learning unit)

### Phase 1 — Hello Diva (get the skeleton running)
1. Scaffold the extension: `npx --package yo --package generator-code -- yo code` (pick "New Extension (TypeScript)").
2. Run it with F5 (opens an Extension Development Host window).
3. Add an activity bar icon + webview panel showing a static Diva image.
   - *Learn: extension manifest (`package.json` contributes), webview basics.*

### Phase 2 — Diva talks (the brain)
4. Add a chat box in the panel. Messages go extension ↔ webview via `postMessage`.
5. Connect to Hugging Face Inference API with your token (store it with VS Code's SecretStorage).
6. Write Diva's system prompt: cute kid persona + Socratic-only rule.
7. **Guardrail challenge:** try to trick her into giving answers. Patch the prompt. Add a validation pass that regenerates responses that contain solutions.
   - *Learn: message passing, API calls, prompt engineering.*

### Phase 3 — Diva watches (the ambient part)
8. Track editor events: `onDidChangeTextDocument`, diagnostics (`languages.onDidChangeDiagnostics`), active time.
9. Add triggers: new error → curious question; long session → break question; repeated edits to same lines → stuck question.
10. Add the status bar mood + notifications for when her panel is closed.
    - *Learn: event-driven extension design, rate-limiting (she must not be annoying — max ~1 nudge per 10 min).*

### Phase 4 — Diva feels (expressions)
11. Generate/add the 6 sprites. Swap them based on state (thinking while LLM call is in flight, skeptical after your 3rd "but it should work", celebrating on eureka).
12. Small CSS animations: bounce, blink, float.
    - *Learn: webview UI polish, state machines.*

### Phase 5 — Diva reads your prompts (Cursor hook, stretch)
13. Create a Cursor hook that runs before prompt submission, scores your prompt's clarity via the LLM, and notifies Diva.
    - *Learn: Cursor hooks. Ask Cursor's AI: "help me create a beforeSubmitPrompt hook".*

### Stretch ideas (later weekends)
- Voice input (Whisper) / cute TTS voice output
- Eureka detection + trophy shelf of solved bugs
- Diva gets sleepy at night, energetic in the morning

---

## 6. Rules for Diva's Brain (the system prompt, first draft)

```
You are Diva, a curious and sweet little anime girl who helps programmers
think. You are 8 years old and love asking questions.

STRICT RULES:
1. NEVER give solutions, fixes, or code. Not even hints disguised as questions.
2. ONLY ask short Socratic questions (1-2 sentences) that help the programmer
   reason for themselves.
3. Stay in character: innocent, curious, encouraging, a little dramatic.
4. If asked directly for the answer, playfully refuse and ask a question instead.
5. One question at a time.
```

Expect this to fail in fun ways — fixing it is Phase 2's main lesson.

---

## 7. Tips for Building with Cursor AI

- Work **one phase at a time**; ask Cursor to explain code it writes, not just write it.
- Commit after every working phase (`git commit`), so you can always roll back.
- Test constantly with F5 — the Extension Development Host reloads fast.
- When stuck, ask Cursor "why" questions before "fix it" questions. (Diva would approve.)

## 8. Useful References

- VS Code Extension API: https://code.visualstudio.com/api
- Webview guide: https://code.visualstudio.com/api/extension-guides/webview
- Hugging Face Inference: https://huggingface.co/docs/inference-providers
- vscode-pets (proof the "pet in a panel" pattern works): https://github.com/tonybaloney/vscode-pets
- Cursor hooks: https://cursor.com/docs/agent/hooks
