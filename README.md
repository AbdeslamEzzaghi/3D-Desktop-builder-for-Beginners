# 💻 Simulateur 3D : Montage et Connectique PC

Un projet éducatif interactif conçu pour aider les élèves à comprendre l'architecture d'un système informatique et la logique des branchements (Entrée, Sortie, Traitement, Énergie).

## 🖥️ Fonctionnalités Actuelles

- **🎮 Scène 3D Interactive** : Environnement complet avec bureau, murs et prises murales simulés via Three.js.
- **📦 Bibliothèque de Composants** : Unité centrale, Moniteur, Clavier, Souris, Imprimante, Multiprise, Casque, Microphone, Haut-parleurs, Webcam et Scanner.
- **🧠 Atelier de Tri** : Système de classification par catégories (Entrée, Sortie, Traitement, Autres) avec retour visuel immédiat.
- **🔌 Câblage Logique** : Gestion des types de ports (HDMI, USB, Jack Audio, Prises de courant). Les câbles sont tracés dynamiquement en 3D.
- **⚡ Simulation Électrique** : Gestion des dépendances (un appareil sur multiprise ne fonctionne que si la multiprise est reliée au secteur).
- **🧪 Banc de Test** : Vérification automatisée de 7 scénarios d'usage (allumage, écriture, impression, audio) avec système de scoring.

## 🛠️ Stack Technique

- **Framework** : Next.js 15 (App Router)
- **3D** : Three.js (Vanilla integration)
- **UI** : Tailwind CSS, Shadcn/UI, Lucide Icons
- **Langage** : TypeScript

## 🎯 Objectifs Pédagogiques

1. **Identifier** les composants internes et externes d'un PC.
2. **Classifier** les périphériques selon leur rôle (E/S).
3. **Maîtriser** la connectique physique (associer le bon câble au bon port).
4. **Comprendre** la distribution de l'énergie dans un poste de travail.
