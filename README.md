# 📚 Library UI — Open Library Explorer

Interface web moderne pour explorer la bibliothèque **Open Library**.  
Le projet propose une recherche rapide, une recherche avancée, une page de fiche livre enrichie avec **Wikipedia**, et un affichage des **changements récents** en temps réel.

---

## 🚀 Objectifs du projet

- Construire une **interface frontend uniquement**
- Exploiter l’API publique **Open Library**
- Offrir une **UI/UX moderne, responsive et lisible**
- Mettre en place une **architecture propre**
- Implémenter des **tests automatisés**

---

## 🧱 Stack technique

- **React 19**
- **TypeScript**
- **Vite**
- **@tanstack/react-router** (routing)
- **@tanstack/react-query** (fetch & cache API)
- **Vitest + Testing Library** (tests)
- **CSS custom (design system maison)**

---

## 📂 Structure du projet

```txt
src/
├── components/        # Composants réutilisables (Layout, Pagination, Skeletons…)
├── hooks/             # Hooks React Query (Open Library, Wikipedia…)
├── pages/             # Pages principales (Home, AdvancedSearch, Work…)
├── styles/
│   ├── theme.css      # Thème global (fond, cards, boutons…)
│   ├── components/    # Styles composants
│   └── pages/         # Styles spécifiques par page
├── test/              # Setup et helpers de tests
├── routes.tsx         # Définition des routes
├── main.tsx           # Point d’entrée
└── App.tsx
```

---

## ✨ Fonctionnalités

### 🔍 Recherche rapide
- Accessible depuis la barre de navigation
- Redirige vers la recherche avancée avec le terme saisi

### 🔎 Recherche avancée
- Recherche par :
  - titre
  - auteur
  - sujet / tag
  - année de publication
- Pagination numérotée
- Affichage sous forme de **grille de cartes**
- Skeleton loader pendant le chargement

### 🏠 Page d’accueil
- Hero de présentation
- Catégories cliquables
- Affichage des **Recent Changes** Open Library
- Accès direct aux fiches livres quand possible

### 📖 Fiche livre (Work)
- Validation de l’identifiant OLID
- Affichage :
  - couverture
  - titre
  - auteur
  - date de publication
  - description
  - sujets
- Enrichissement via **Wikipedia**
- Skeleton loader pendant le chargement

### 🧪 Tests
- Tests unitaires sur :
  - HomePage
  - AdvancedSearchPage
  - WorkPage
- Environnement JSDOM
- Providers (Router + QueryClient) isolés dans des helpers

---

## 🧠 APIs utilisées

### Open Library
- Search API
- Works API
- RecentChanges API  
📎 https://openlibrary.org/developers/api

### Wikipedia
- REST Summary API  
📎 https://en.wikipedia.org/api/rest_v1/

---

## 🎨 Design & UX

- Thème global “bibliothèque / papier”
- Cards avec ombres douces
- Responsive (mobile / desktop)
- Navigation claire
- Skeleton loaders
- Boutons et badges cohérents

---

## 🛠️ Installation & lancement

### Prérequis
- Node.js ≥ 18
- npm

### Installation
```bash
npm install
```

### Lancer le projet
```bash
npm run dev
```

Accès :  
👉 http://localhost:5173

---

## 🧪 Lancer les tests

```bash
npm run test
```

---

## 🔐 Sécurité & robustesse

- Validation des paramètres d’URL (OLID)
- Gestion des erreurs API
- États de chargement explicites
- Fallbacks UI si données manquantes
- Séparation logique (pages / hooks / components)

---

## 📌 Améliorations possibles

- Favoris (localStorage)
- Dark mode
- Internationalisation (i18n)
- Animations d’apparition
- Infinite scroll
- Accessibilité (ARIA)

---

## 👨‍💻 Auteur

Projet réalisé dans le cadre d’un exercice **Frontend Web**  
Utilisation libre de l’API Open Library.

---

## 📜 Licence

Ce projet utilise uniquement des APIs publiques.  
Libre d’utilisation à des fins pédagogiques.
