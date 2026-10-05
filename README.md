# Diario di Bordo — installazione

App per segnare le ore di lavoro a scuola. Funziona offline, i dati restano sul telefono.


```bash
cd diario-di-bordo
git init
git add .
git commit -m "Diario di Bordo v1"
git branch -M main
git remote add origin https://github.com/<tuo-utente>/diario-di-bordo.git
git push -u origin main
```

Su GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
Dopo circa 1 minuto l'app è online su: `https://<tuo-utente>.github.io/diario-di-bordo/`

## 2. Installala sul telefono (Android)

1. Apri il link con **Chrome**
2. Menu ⋮ → **Aggiungi a schermata Home** (o "Installa app")
3. Da quel momento si apre dall'icona, a schermo intero, anche senza internet

## Come aggiornarla

1. Modifica i file
2. In `sw.js` cambia `VERSIONE` (es. `"diario-v2"`)
3. `git commit` + `git push`: il telefono scarica la nuova versione alla seconda apertura

## Nota sui dati

- Stanno nel `localStorage` del telefono: **non** finiscono su GitHub.
- Se si disinstalla l'app o si cancellano i dati di Chrome, si perdono → fare ogni tanto **Stiva → Scarica backup**.

## File

| File | A cosa serve |
|---|---|
| `index.html` | Tutta l'app (HTML + CSS + JavaScript) |
| `manifest.webmanifest` | Nome, icona, colori: rende l'app installabile |
| `sw.js` | Service worker: cache per l'uso offline |
| `icon-*.png` | Icone |
