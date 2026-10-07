/* =====================================================================
   LE FRIGO DE LA COLOC — js/accueil.js — CORRIGÉ
   L'accueil LIT ce que les deux autres pages ont rangé : c'est la
   preuve que localStorage traverse les pages.
   ===================================================================== */

"use strict";

const titre = document.getElementById("bienvenue");
const astucePrenom = document.getElementById("astuce-prenom");
const affichageVisites = document.getElementById("nb-visites");
const affichagePostits = document.getElementById("nb-postits");
const affichageEpingles = document.getElementById("nb-epingles");


/* ---------------------------------------------------------------------
   ÉTAPE 4a — Le compteur de visites

   getItem rend du TEXTE ("4") ou null la toute première fois.
   Number(null) vaut 0 : pratique, la première visite donnera 1.
   Sans Number(), "4" + 1 donnerait "41".
   --------------------------------------------------------------------- */
let visites = Number(localStorage.getItem(CLES.visites));
visites = visites + 1;
localStorage.setItem(CLES.visites, visites);
affichageVisites.textContent = visites;


/* ---------------------------------------------------------------------
   ÉTAPE 4b — Dire bonjour par son prénom
   textContent : le prénom a été tapé par l'utilisateur (séance 12).
   --------------------------------------------------------------------- */
const prenom = localStorage.getItem(CLES.prenom);
if (prenom === null) {
    titre.textContent = "Bonjour !";
    astucePrenom.classList.remove("d-none");
} else {
    titre.textContent = "Bonjour " + prenom + " !";
    astucePrenom.classList.add("d-none");
}


/* ---------------------------------------------------------------------
   ÉTAPE 10 — Le nombre de post-its, lu depuis une AUTRE page
   --------------------------------------------------------------------- */
const postits = lireListe(CLES.postits);
let epingles = 0;
for (const postit of postits) {
    if (postit.epingle) {
        epingles = epingles + 1;
    }
}
affichagePostits.textContent = postits.length;
affichageEpingles.textContent = epingles;
