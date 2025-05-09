
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt manquant." });

  const PROMPT_TEMPLATE = \`Génère une séquence complète de 6 images ou plans cohérents.
Pour chaque image ou plan :
1. Description visuelle
2. Cadrage caméra
3. Prompt Positif
4. Prompt Négatif

Structure bien chaque image avec :
**Image N : Titre**
Description Visuelle: ...
Cadrage Caméra: ...
Prompt Positif: ...
Prompt Négatif: ...
\`;

  try {
    const body = {
      contents: [{ parts: [{ text: PROMPT_TEMPLATE + '\n' + prompt }] }]
    };
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur", details: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend actif sur http://localhost:${PORT}`);
});
