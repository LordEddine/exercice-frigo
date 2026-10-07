/* =====================================================================
   LE FRIGO DE LA COLOC — js/reglages.js — CORRIGÉ
   La page des réglages : des valeurs SIMPLES (du texte, un booléen).
   ===================================================================== */

"use strict";

const formulaire = document.getElementById("formulaire-reglages");
const champPrenom = document.getElementById("prenom");
const caseSombre = document.getElementById("mode-sombre");
const listeCouleur = document.getElementById("couleur-defaut");
const message = document.getElementById("message-reglages");
const boutonReinitialiser = document.getElementById("btn-reinitialiser");


/* ---------------------------------------------------------------------
   ÉTAPE 1 — Au chargement : remplir le formulaire avec ce qui est rangé

   getItem rend null si rien n'est encore rangé. On prévoit donc une
   valeur par défaut avec || : « ce qui est rangé, OU à défaut ceci ».
   --------------------------------------------------------------------- */
function remplirFormulaire() {
    champPrenom.value = localStorage.getItem(CLES.prenom) || "";
    caseSombre.checked = localStorage.getItem(CLES.sombre) === "true";
    listeCouleur.value = localStorage.getItem(CLES.couleur) || "jaune";
}

remplirFormulaire();


/* ---------------------------------------------------------------------
   ÉTAPE 2 — Enregistrer
   --------------------------------------------------------------------- */
formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();

    // Le prénom : s'il est vide, on retire la clé plutôt que de ranger "".
    const prenom = champPrenom.value.trim();
    if (prenom === "") {
        localStorage.removeItem(CLES.prenom);
    } else {
        localStorage.setItem(CLES.prenom, prenom);
    }

    // .checked vaut true ou false… mais setItem le range en TEXTE :
    // "true" ou "false". On s'en souviendra en le relisant (étape 3).
    localStorage.setItem(CLES.sombre, caseSombre.checked);

    localStorage.setItem(CLES.couleur, listeCouleur.value);

    appliquerTheme();                  // le thème change tout de suite
    message.textContent = "✓ Réglages enregistrés.";
});


/* ---------------------------------------------------------------------
   ÉTAPE 11 — Tout réinitialiser… mais seulement CE site

   Pourquoi pas localStorage.clear() ? Parce qu'en file:///, tous les
   exercices partagent le même localStorage : clear() effacerait aussi
   le juke-box, le compagnon… On retire nos clés, une par une.
   for…in parcourt les NOMS des propriétés de l'objet CLES (séance 10).
   --------------------------------------------------------------------- */
boutonReinitialiser.addEventListener("click", function () {
    if (!confirm("Effacer les réglages, le compteur de visites et tous les post-its ?")) {
        return;
    }
    for (const nom in CLES) {
        localStorage.removeItem(CLES[nom]);
    }
    remplirFormulaire();
    appliquerTheme();
    message.textContent = "✓ Tout a été réinitialisé.";
});
