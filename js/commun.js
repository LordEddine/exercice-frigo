/* =====================================================================
   LE FRIGO DE LA COLOC — js/commun.js — CORRIGÉ
   420-931-MA · Programmation Web (Front-End) · Séance 15

   Ce fichier est chargé sur LES TROIS PAGES, avant le script propre à
   chaque page. Il contient ce qu'elles partagent :
       - les noms des clés du localStorage ;
       - deux fonctions pour lire et écrire une liste en JSON ;
       - le thème (clair ou sombre), appliqué partout.
   ===================================================================== */

"use strict";


/* ---------------------------------------------------------------------
   LES CLÉS — toutes préfixées par « frigo- »

   Pourquoi un préfixe ? Quand on ouvre une page par double-clic
   (adresse en file:///), Chrome donne LE MÊME localStorage à TOUS les
   fichiers de l'ordinateur : le juke-box, le compagnon, ce frigo…
   Une clé « notes » toute nue pourrait écraser celle d'un autre
   exercice. « frigo-postits » ne risque rien.

   Et on écrit chaque nom UNE fois, ici : une faute de frappe dans un
   nom de clé ne fait aucune erreur, elle crée juste une autre clé.
   --------------------------------------------------------------------- */
const CLES = {
    prenom: "frigo-prenom",
    sombre: "frigo-sombre",
    couleur: "frigo-couleur",
    visites: "frigo-visites",
    postits: "frigo-postits",
};


/* ---------------------------------------------------------------------
   ÉTAPE 5 — Lire une liste rangée en JSON

   Trois cas à prévoir :
     1. la clé n'existe pas encore (première visite) → getItem rend null
     2. la clé contient du JSON valide → JSON.parse rend le tableau
     3. la clé contient n'importe quoi (quelqu'un l'a modifiée dans
        F12 › Application) → JSON.parse PLANTE. try/catch rattrape
        l'erreur, et on repart d'une liste vide au lieu de casser la page.
   --------------------------------------------------------------------- */
function lireListe(cle) {
    const texte = localStorage.getItem(cle);

    if (texte === null) {
        return [];                          // cas 1 : rien n'est encore rangé
    }

    try {
        const valeur = JSON.parse(texte);   // cas 2 : on retransforme en tableau
        if (Array.isArray(valeur)) {
            return valeur;
        }
        return [];                          // du JSON, mais pas un tableau
    } catch (erreur) {
        console.warn("Données illisibles dans « " + cle + " » : on repart à zéro.");
        return [];                          // cas 3 : données abîmées
    }
}


/* ---------------------------------------------------------------------
   ÉTAPE 5 (suite) — Écrire une liste en JSON

   localStorage ne range QUE du texte. JSON.stringify transforme le
   tableau d'objets en un texte qu'on pourra retransformer plus tard.
   --------------------------------------------------------------------- */
function ecrireListe(cle, liste) {
    localStorage.setItem(cle, JSON.stringify(liste));
}


/* ---------------------------------------------------------------------
   ÉTAPE 3 — Appliquer le thème, sur chaque page

   ⚠ LE PIÈGE DE LA SÉANCE. Le réglage est rangé sous forme de TEXTE :
   "true" ou "false". Or le texte "false" n'est pas vide, donc il est
   VRAI dans un if :
       if (localStorage.getItem(CLES.sombre)) { ... }   // toujours sombre !
   Il faut comparer au texte exact : === "true".
   --------------------------------------------------------------------- */
function appliquerTheme() {
    if (localStorage.getItem(CLES.sombre) === "true") {
        document.body.classList.add("theme-sombre");
    } else {
        document.body.classList.remove("theme-sombre");
    }
}

appliquerTheme();
