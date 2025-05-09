const API_URL = 'https://syncframe-backend-1.onrender.com/api/generate';

// Variables globales UNIQUEMENT ici
const form = document.getElementById('promptForm');
const briefInput = document.getElementById('brief');
const errorMsg = document.getElementById('errorMsg');
const resultDiv = document.getElementById('result');
const generateBtn = document.getElementById('generateBtn');

const PROMPT_TEMPLATE = `Génère une séquence complète de 6 images ou plans cohérents.

Pour chaque image ou plan, tu dois OBLIGATOIREMENT fournir :
1. Une description visuelle très claire (ambiance, éléments, lumière, émotion, couleurs, etc.)
2. Le cadrage caméra (face, 3/4, dos, plongée, large, macro, etc.)
3. Un prompt positif (Prompt Positif) pour BodySync ou LipSync (selon le plan) — ce prompt doit TOUJOURS être présent et pertinent
4. Un prompt négatif (Prompt Négatif) — ce prompt doit TOUJOURS être présent et pertinent

Structure la réponse en sections bien séparées pour chaque image ou plan, avec les titres EXACTS suivants pour chaque champ (en français) :

**Image N : Titre**
Description Visuelle: ...
Cadrage Caméra: ...
Prompt Positif: ...
Prompt Négatif: ...

NE JAMAIS oublier le Prompt Positif ni le Prompt Négatif.
`;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userPrompt = briefInput.value.trim();
  if (!userPrompt) {
    errorMsg.innerText = "Champ vide.";
    return;
  }

  errorMsg.innerText = "";
  resultDiv.innerHTML = "⏳ Génération en cours...";
  generateBtn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt })
    });

    if (!response.ok) throw new Error("Échec API");

    const data = await response.json();
    if (!data?.scenes?.length) throw new Error("Pas de scènes générées.");

    resultDiv.innerHTML = data.scenes.map((scene, idx) => `
      <div class="scene-card">
        <h3>🎬 ${scene.title}</h3>
        <p><strong>Description:</strong> ${scene.description}</p>
        <p><strong>Cadrage:</strong> ${scene.cadrage}</p>
        <p><strong>Prompt Positif:</strong> <span id="prompt${idx}">${scene.promptPlus}</span> <button onclick="copyToClipboard('prompt${idx}')">Copier</button></p>
        <p><strong>Prompt Négatif:</strong> ${scene.promptMinus}</p>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    errorMsg.innerText = "Erreur lors de la génération : Failed to fetch";
    resultDiv.innerHTML = "";
  }

  generateBtn.disabled = false;
});

function copyToClipboard(textId) {
  const text = document.getElementById(textId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copié !");
  });
}