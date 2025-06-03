# SignSafe - Plateforme pédagogique de signature électronique

## Description

SignSafe est une application web pédagogique développée avec Node.js et Express. Elle permet de :
- Signer électroniquement un fichier (PDF ou TXT) avec un hachage et une signature HMAC simulée.
- Vérifier l’intégrité d’un document signé.
- Comprendre les concepts fondamentaux de la signature électronique.

## Technologies utilisées

- Node.js + Express.js
- EJS (moteur de template)
- Multer (gestion des fichiers uploadés)
- Crypto (module natif Node.js pour hachage)
- LowDB (stockage simple en fichier JSON)

## Fonctionnalités

- Interface professionnelle, claire et responsive (Bootstrap)
- Signature électronique simulée via hash SHA256 + HMAC
- Vérification de l’intégrité d’un fichier signé
- Historique des signatures
- Explications pédagogiques affichées dans l’interface

## Concepts pédagogiques

- Signature électronique = intégrité + identité + horodatage
- Hash (empreinte numérique) d’un fichier : garantit qu’il n’a pas été modifié
- HMAC (signature) : garantit que la signature vient bien d’un utilisateur identifié
- Simulation de "clé privée" côté serveur

## Déploiement Render

1. Crée un nouveau Web Service sur https://render.com
2. Utilise le repo Git contenant ce code
3. Configure :
   - Node version: 18+
   - Start command: `node app.js`
4. Fichier `uploads/` est pour l’instant local