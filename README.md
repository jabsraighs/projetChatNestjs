# 📦 Projet Chat - NestJS

Projet réalisé par **BOUAKI SANI JEAN ARTHUR**.

Ce projet est une application de chat en temps réel, divisée en deux parties :

- **Client** (frontend)
- **Server** (backend avec NestJS)

---

## 📁 Structure du projet

 projetChatNestjs/
├── client/ # Interface utilisateur (Frontend)
├── server/ # API NestJS + WebSocket + Auth (Backend)
├── docker-compose.yml
└── README.md*

---

## 🚀 Prérequis

Avant de commencer, assure-toi d’avoir installé sur ta machine :

- [Node.js](https://nodejs.org/) (version 16 ou plus recommandée)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
---

## ⚙️ Installation et lancement

### 1. 📦 Installer les dépendances

#### 🔹 Côté **client**

```bash
cd client
npm install
npm run dev

### 1. 📦 Installer les dépendances

#### 🔹 Côté **server**


```bash
cd server 

 ### env.local exemple
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=postgres
    JWT_SECRET=votre_clé_secrète_très_longue_et_aléatoire

npm install
docker compose up -d 


