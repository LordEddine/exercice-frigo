/* =====================================================================
   LE FRIGO DE LA COLOC — js/frigo.js — CORRIGÉ
   Le frigo : une LISTE d'objets, rangée en JSON.

   Le cycle à retenir, pour toute donnée qui doit survivre au F5 :
       1. LIRE      au chargement     notes = lireListe(...)
       2. MODIFIER  le tableau        push, splice, postits[i].epingle = …
       3. RANGER    tout de suite     ecrireListe(...)
       4. AFFICHER  depuis le tableau afficher()
   La page ne garde rien : c'est le tableau qui fait foi, et il est
   rangé après chaque changement.
   ===================================================================== */

"use strict";

const formulaire = document.getElementById("formulaire-postit");
const champTexte = document.getElementById("texte-postit");
const compteur = document.getElementById("compteur-caracteres");
const conteneur = document.getElementById("postits");
const frigoVide = document.getElementById("frigo-vide");
const boutonVider = document.getElementById("btn-vider");

const CLE_BROUILLON = "frigo-brouillon";      // bonus, en sessionStorage

// 1. LIRE — une seule fois, au chargement.
let postits = lireListe(CLES.postits);


/* ---------------------------------------------------------------------
   ÉTAPE 6a — Ranger le tableau (un seul endroit dans tout le fichier)
   --------------------------------------------------------------------- */
function sauvegarder() {
    ecrireListe(CLES.postits, postits);
}


/* ---------------------------------------------------------------------
   ÉTAPE 6b — Afficher : reconstruire le frigo depuis le tableau

   Deux boucles : d'abord les post-its épinglés, puis les autres.
   On garde l'indice i du TABLEAU dans data-index : c'est lui qui dira
   quel post-it supprimer ou épingler, même si l'ordre affiché diffère.
   --------------------------------------------------------------------- */
function afficher() {
    conteneur.innerHTML = "";          // chaîne vide : aucun risque d'injection

    for (let i = 0; i < postits.length; i++) {
        if (postits[i].epingle) {
            conteneur.appendChild(creerPostit(postits[i], i));
        }
    }
    for (let i = 0; i < postits.length; i++) {
        if (!postits[i].epingle) {
            conteneur.appendChild(creerPostit(postits[i], i));
        }
    }

    if (postits.length === 0) {
        frigoVide.classList.remove("d-none");
    } else {
        frigoVide.classList.add("d-none");
    }
}


/* ---------------------------------------------------------------------
   ÉTAPE 6c — Fabriquer UN post-it

   ⚠ Le texte vient de l'utilisateur ET du localStorage, que n'importe
   qui peut modifier dans F12. Raison de plus : textContent, jamais
   innerHTML.

   Les deux boutons naissent ici : ils reçoivent leur écouteur tout de
   suite (séance 13, étape 7).
   --------------------------------------------------------------------- */
function creerPostit(postit, index) {
    const carte = document.createElement("article");
    carte.classList.add("postit", "postit-" + postit.couleur);
    if (postit.epingle) {
        carte.classList.add("epingle");
    }

    const texte = document.createElement("p");
    texte.className = "postit-texte";
    texte.textContent = postit.texte;

    const actions = document.createElement("div");
    actions.className = "postit-actions";

    const boutonEpingle = document.createElement("button");
    boutonEpingle.type = "button";
    boutonEpingle.className = "btn-postit";
    if (postit.epingle) {
        boutonEpingle.textContent = "📌 Désépingler";
    } else {
        boutonEpingle.textContent = "📌 Épingler";
    }
    boutonEpingle.dataset.index = index;
    boutonEpingle.addEventListener("click", basculerEpingle);

    const boutonRetirer = document.createElement("button");
    boutonRetirer.type = "button";
    boutonRetirer.className = "btn-postit";
    boutonRetirer.textContent = "✕ Retirer";
    boutonRetirer.setAttribute("aria-label", "Retirer ce post-it");
    boutonRetirer.dataset.index = index;
    boutonRetirer.addEventListener("click", retirer);

    actions.appendChild(boutonEpingle);
    actions.appendChild(boutonRetirer);
    carte.appendChild(texte);
    carte.appendChild(actions);
    return carte;
}


/* ---------------------------------------------------------------------
   ÉTAPE 7 — Ajouter un post-it
   --------------------------------------------------------------------- */
formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();

    const texte = champTexte.value.trim();
    if (texte === "") {
        champTexte.classList.add("is-invalid");
        return;
    }
    champTexte.classList.remove("is-invalid");

    const couleur = document.querySelector('input[name="couleur"]:checked').value;

    // 2. MODIFIER le tableau…
    postits.push({ texte: texte, couleur: couleur, epingle: false });
    // 3. RANGER tout de suite…
    sauvegarder();
    // 4. AFFICHER.
    afficher();

    champTexte.value = "";
    compteur.textContent = "0 / 120";
    sessionStorage.removeItem(CLE_BROUILLON);
    champTexte.focus();
});


/* ---------------------------------------------------------------------
   ÉTAPE 8a — Épingler / désépingler
   dataset rend du texte : Number() pour obtenir un indice de tableau.
   --------------------------------------------------------------------- */
function basculerEpingle(evenement) {
    const i = Number(evenement.currentTarget.dataset.index);
    postits[i].epingle = !postits[i].epingle;
    sauvegarder();
    afficher();
}


/* ---------------------------------------------------------------------
   ÉTAPE 8b — Retirer
   splice(i, 1) : « à partir de l'indice i, enlève 1 élément ».
   --------------------------------------------------------------------- */
function retirer(evenement) {
    const i = Number(evenement.currentTarget.dataset.index);
    postits.splice(i, 1);
    sauvegarder();
    afficher();
}


/* ---------------------------------------------------------------------
   ÉTAPE 8c — Vider le frigo
   removeItem sur NOTRE clé, pas clear() : les réglages restent.
   --------------------------------------------------------------------- */
boutonVider.addEventListener("click", function () {
    if (postits.length === 0) {
        return;
    }
    if (!confirm("Retirer les " + postits.length + " post-its du frigo ?")) {
        return;
    }
    postits = [];
    localStorage.removeItem(CLES.postits);
    afficher();
});


/* ---------------------------------------------------------------------
   ÉTAPE 9 — La couleur par défaut, choisie dans les réglages
   On coche la pastille dont l'id correspond : "couleur-" + "rose"…
   --------------------------------------------------------------------- */
const couleurDefaut = localStorage.getItem(CLES.couleur);
if (couleurDefaut !== null) {
    const pastille = document.getElementById("couleur-" + couleurDefaut);
    if (pastille !== null) {
        pastille.checked = true;
    }
}


/* ---------------------------------------------------------------------
   BONUS — Compteur de caractères et brouillon en sessionStorage

   sessionStorage a les mêmes 4 gestes que localStorage, mais il est
   effacé quand on FERME L'ONGLET. Parfait pour un brouillon : il
   survit à un F5 accidentel, mais pas au-delà.
   L'événement "input" se déclenche à chaque caractère tapé.
   --------------------------------------------------------------------- */
champTexte.addEventListener("input", function () {
    compteur.textContent = champTexte.value.length + " / 120";
    sessionStorage.setItem(CLE_BROUILLON, champTexte.value);
});

const brouillon = sessionStorage.getItem(CLE_BROUILLON);
if (brouillon !== null) {
    champTexte.value = brouillon;
    compteur.textContent = brouillon.length + " / 120";
}


afficher();
