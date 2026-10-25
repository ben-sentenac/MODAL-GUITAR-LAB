# Modal Guitar Lab — Document de démarrage

**Statut :** idée retenue, développement non commencé  
**Nature :** projet personnel, musical et ludique ; remise à niveau occasionnelle en React/TypeScript  
**Priorité :** facultative. CarbonTrace reste le seul produit actif du parcours professionnel.

## 1. L'idée

Créer une petite application inspirée de Guitar Pro, mais centrée sur l'exploration des gammes et des modes pour **composer des solos à la guitare**.

L'utilisateur définit un accompagnement, par exemple **Em | C | Bm | F**, l'écoute en boucle, choisit une gamme ou un mode, puis invente un solo en utilisant à la fois **un manche interactif et une tablature synchronisée**.

L'application doit encourager l'expérimentation musicale : visualiser les couleurs harmoniques, entendre les tensions et les résolutions, et rester libre de sortir de la gamme.

## 2. Expérience souhaitée

1. Saisir une progression d'accords et choisir un tempo.
2. Écouter un accompagnement simple : accords, basses ou bourdon selon le mode choisi.
3. Choisir une tonalité, une gamme ou un mode, sans être obligé de conserver le même sur toute la progression.
4. Voir les notes correspondantes sur un manche de guitare.
5. Cliquer sur une note du manche pour l'insérer à la position courante du solo.
6. Voir immédiatement cette note dans la tablature.
7. Sélectionner une note de tablature pour retrouver sa corde et sa case sur le manche.
8. Écouter le solo et l'accompagnement ensemble, en boucle.

La progression **Em | C | Bm | F** est un exemple de travail, pas une progression imposée. Elle permet notamment d'explorer des changements de couleur qui ne se résument pas nécessairement à une seule gamme diatonique.

## 3. Interface envisagée

```text
┌─────────────────────────────────────────────────────┐
│ MODAL GUITAR LAB                         ▶  100 BPM  │
├─────────────────────────────────────────────────────┤
│ ACCOMPAGNEMENT                                      │
│ [ Em ] [ C ] [ Bm ] [ F ]        [Boucle]            │
│ Mode : [Accords / Bourdon / Basse]                   │
├─────────────────────────────────────────────────────┤
│ EXPLORATION                                         │
│ Tonique : [E]  Gamme/mode : [Mineur naturel]         │
│ Manche interactif : cordes, cases, notes surlignées │
│ [Notes de gamme] [Toniques] [Notes de l'accord]      │
├─────────────────────────────────────────────────────┤
│ SOLO                                                │
│ Tablature 6 cordes synchronisée avec le manche      │
│ Curseur / durée de note / insertion / suppression   │
├─────────────────────────────────────────────────────┤
│ TRANSPORT                                           │
│ [▶] [■] [Boucler]         Position : mesure / temps  │
└─────────────────────────────────────────────────────┘
```

**Règle centrale :** manche et tablature représentent le **même solo**, stocké dans un modèle de données partagé. Pas de copies indépendantes susceptibles de diverger.

## 4. Première version jouable (V0)

Conserver un périmètre réduit :

- Accordage standard E–A–D–G–B–E et manche limité à un nombre raisonnable de cases.
- Une progression courte, modifiable, en 4/4.
- Un accompagnement sonore simple, sans recherche de réalisme instrumental.
- Une sélection de gamme ou mode avec affichage des notes sur le manche.
- Un solo **monophonique** de quelques mesures, éditable par notes et durées simples.
- Synchronisation manche ↔ tablature et lecture audio de base.

Le choix précis entre accords, bourdon et basse comme **premier** type d'accompagnement reste ouvert ; les autres pourront être ajoutés uniquement si l'envie est là.

## 5. Pistes pour plus tard — aucune obligation

Accordages alternatifs, choix des positions, mise en évidence des intervalles, changement de mode par mesure, arpèges, articulations (bend, slide, hammer-on), amélioration des sons, sauvegarde locale, export MIDI vers REAPER.

Ce ne sont **pas** des engagements, ni une roadmap professionnelle.

## 6. Choix techniques de départ

- **React + TypeScript strict** : retrouver les automatismes sur un usage plaisant.
- **Vite** : démarrage simple.
- **SVG ou composants DOM** pour le manche et la tablature, selon les essais.
- **Web Audio API** pour le premier son, ou une bibliothèque si le besoin le justifie.
- **Aucun backend** ni authentification par défaut.
- Quelques tests ciblés sur la logique musicale et la synchronisation si cela devient utile.

Concept TypeScript à préciser lors du codage : une note de solo comporte au minimum sa **corde, sa case, sa position dans le temps et sa durée**. Sa hauteur peut être calculée à partir de l'accordage et de la case.

## 7. Règles du projet

- Activité **facultative** et sans calendrier fixe.
- Privilégier le plaisir, l'exploration musicale et les résultats audibles.
- Avancer par petits essais fonctionnels, sans surarchitecture.
- Ne pas créer un autre produit à maintenir ; aucune obligation de déploiement ni de publication.
- Ne pas modifier le programme ou la priorité de **CarbonTrace**.
- En reprise, relire ce document et noter seulement les changements réellement décidés.

## 8. Première séance (quand l'envie viendra)

**Objectif :** afficher un manche de guitare en accordage standard et permettre de sélectionner une note (corde + case), puis afficher son nom et sa hauteur.

**Critère de réussite :** une sélection sur le manche renvoie une note correcte, y compris pour les cordes à vide. Pas d'audio ni de tablature complète exigés à ce stade.

**Première décision à prendre pendant cette séance :** reprendre une ancienne base React existante ou initialiser un petit projet Vite, après inspection de ce qui est déjà disponible.
