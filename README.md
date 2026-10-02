# Web de Hyperion Rockets

Web estàtica (HTML, CSS i una mica de JavaScript). No cal instal·lar res per editar-la.
Adreça prevista: https://hyperionrockets.github.io

## Fitxers

| Fitxer | Què és |
|---|---|
| `index.html` | Portada: nom, logo, accessos i patrocinadors |
| `coets.html` | Els nostres coets (Helios, Alpha...) |
| `collabora.html` | Patrocini, com unir-se i dossier |
| `contacte.html` | Correu, Instagram i on som |
| `en/` | Les mateixes pàgines en anglès (`index`, `rockets`, `get-involved`, `contact`) |
| `404.html` | Pàgina d'adreça no trobada |
| `styles.css` | Tot el disseny. Colors i mides a dalt de tot |
| `site.js` | Animacions, enllaços del formulari i del dossier, botó de copiar |
| `logo.webp`, `upc.webp`, `eetac.webp` | Logos |
| `og-image.png` | Imatge que surt quan es comparteix l'enllaç |

Els fitxers tenen comentaris curts en anglès que indiquen cada part.

## Canviar un text

1. Obre la pàgina a GitHub i clica el llapis.
2. Busca la frase amb Ctrl+F i canvia-la. Toca només el text entre etiquetes, per exemple entre `<p>` i `</p>`.
3. Fes el mateix canvi a la versió anglesa (carpeta `en/`) si cal.
4. **Commit changes**. En un o dos minuts la web està actualitzada.

## Afegir un coet

A `coets.html` (i `en/rockets.html`) cada coet és un bloc `<article class="rocket-entry ...">`. Copia'n un i canvia el nom, el text i el dibuix. El dibuix és un SVG en mil·límetres des de la punta de l'ogiva: el CG i el CP es mouen canviant els valors `x`/`cx` del bloc `CG and CP`. Per a un dibuix nou, demaneu-lo a partir del fitxer d'OpenRocket.

## Formulari i dossier

A dalt de tot de `site.js`:

```
var ENLLACOS = {
  formulari: "",
  dossier: ""
};
```

- **formulari:** enllaç del Google Form. Buit = el botó porta a contacte.
- **dossier:** puja `dossier.pdf` i escriu `dossier: "dossier.pdf"`. Buit = "Disponible aviat".

Serveix per als dos idiomes.

## Afegir un patrocinador

1. Puja el logo a una carpeta `patrocinadors/` (PNG o SVG amb fons transparent).
2. A `index.html` i `en/index.html`, al bloc `sponsors`, hi ha un comentari amb una línia d'exemple. Copia-la a sobre del requadre discontinu i canvia l'enllaç, la imatge i el nom. A `en/index.html` la imatge va amb `../` davant.

## Comptador de visites

GoatCounter, gratuït. Crea el compte a https://www.goatcounter.com amb el codi `hyperionrockets` i les visites es veuen a https://hyperionrockets.goatcounter.com. Si el codi és un altre, canvia'l a totes les pàgines.

## Si canvia l'adreça de la web

Substitueix `https://hyperionrockets.github.io` per la nova adreça a totes les pàgines (vista prèvia i enllaços d'idioma).
