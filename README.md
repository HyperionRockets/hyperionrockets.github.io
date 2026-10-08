# Web de Hyperion Rockets

Web estàtica (HTML, CSS i una mica de JavaScript). No cal instal·lar res per editar-la.
Adreça: https://hyperionrockets.upc.edu (també funciona https://hyperionrockets.github.io, que hi redirigeix)

## Fitxers

| Fitxer | Què és |
|---|---|
| `index.html` | Portada: nom, logo, accessos i patrocinadors |
| `qui-som.html` | Què és Hyperion i què volem fer. Més endavant, l'equip |
| `coets.html` | Els nostres coets (Helios, Alpha...) |
| `collabora.html` | Patrocini, com unir-se i dossier |
| `contacte.html` | Correu, Instagram i on som |
| `es/` | Les mateixes pàgines en castellà (`index`, `quienes-somos`, `cohetes`, `colabora`, `contacto`) |
| `en/` | Les mateixes pàgines en anglès (`index`, `about`, `rockets`, `get-involved`, `contact`) |
| `404.html` | Pàgina d'adreça no trobada |
| `styles.css` | Tot el disseny. Colors i mides a dalt de tot |
| `site.js` | Animacions, enllaços del formulari i del dossier, botó de copiar |
| `logo.webp`, `upc.webp`, `eetac.webp` | Logos |
| `og-image.png`, `og-image-es.png`, `og-image-en.png` | Imatge que surt quan es comparteix l'enllaç, per idioma |
| `dossier.pdf`, `dossier-es.pdf`, `dossier-en.pdf` | Dossier de patrocini en cada idioma |

Els fitxers tenen comentaris curts en anglès que indiquen cada part.

## Canviar un text

1. Obre la pàgina a GitHub i clica el llapis.
2. Busca la frase amb Ctrl+F i canvia-la. Toca només el text entre etiquetes, per exemple entre `<p>` i `</p>`.
3. Fes el mateix canvi a les versions en castellà (`es/`) i anglès (`en/`) si cal.
4. **Commit changes**. En un o dos minuts la web està actualitzada.

## Afegir un coet

A `coets.html` (i `es/cohetes.html`, `en/rockets.html`) cada coet és un bloc `<article class="rocket-entry ...">`. Copia'n un i canvia el nom, el text i el dibuix. El dibuix és un SVG en mil·límetres des de la punta de l'ogiva: el CG i el CP es mouen canviant els valors `x`/`cx` del bloc `CG and CP`. Per a un dibuix nou, demaneu-lo a partir del fitxer d'OpenRocket.

## Formulari i dossier

A dalt de tot de `site.js`:

```
var ENLLACOS = {
  formulari: "",
  dossier: "dossier.pdf",
  dossier_es: "dossier-es.pdf",
  dossier_en: "dossier-en.pdf"
};
```

- **formulari:** enllaç del Google Form. Buit = el botó porta a contacte.
- **dossier:** puja `dossier.pdf` i escriu `dossier: "dossier.pdf"`. Buit = "Disponible aviat".

Cada idioma agafa el seu dossier. Si `dossier_es` o `dossier_en` és buit, s'usa el català.

## Afegir un patrocinador

1. Puja el logo a una carpeta `patrocinadors/` (PNG o SVG amb fons transparent).
2. A `index.html`, `es/index.html` i `en/index.html`, al bloc `sponsors`, hi ha un comentari amb una línia d'exemple. Copia-la a sobre del requadre discontinu i canvia l'enllaç, la imatge i el nom. A `es/` i `en/` la imatge va amb `../` davant.

## Afegir l'equip

A `qui-som.html` (i `es/quienes-somos.html`, `en/about.html`) hi ha un comentari `Team` al final on aniran les fotos.

## Comptador de visites

GoatCounter, gratuït. Crea el compte a https://www.goatcounter.com amb el codi `hyperionrockets` i les visites es veuen a https://hyperionrockets.goatcounter.com. Si el codi és un altre, canvia'l a totes les pàgines.

## Domini

La web s'allotja a GitHub Pages i es mostra a `hyperionrockets.upc.edu` gràcies a un registre CNAME de la UPC. El fitxer `CNAME` del repositori guarda aquest domini: no l'esborreu.

Si mai canvia l'adreça, substituïu `https://hyperionrockets.upc.edu` per la nova a totes les pàgines (vista prèvia i enllaços d'idioma).
