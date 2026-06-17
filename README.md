# Kortizol Reset — web

Prémiový jednostránkový web (landing page) pro 28denní program **Kortizol Reset**
s expertkou **Hanou Mašínovou**. Postaveno jako čisté HTML + CSS + JavaScript —
**bez build nástrojů, frameworků a závislostí**. Stačí otevřít v prohlížeči.

> Sdělení vychází ze zadání (kortizol → energie, spánek, váha, rovnováha),
> ale **texty jsou originální** — nejde o kopii cizího webu, takže je to bezpečné
> z hlediska autorských práv a zároveň je to celé „tvoje".

---

## 📁 Struktura

```
kortizolreset.cz/
├── index.html          – hlavní prodejní stránka (čeština, výchozí)
├── tracker.html        – tisknutelná A4 tabulka úspěchů (28 dní)
├── en/
│   ├── index.html      – anglická verze (/en/)
│   └── tracker.html    – anglická A4 tabulka
├── assets/
│   ├── css/styles.css   – kompletní design (sdílený oběma jazyky)
│   └── js/main.js       – menu, odpočet, modal, animace (texty modalu dvojjazyčně)
└── README.md
```

## 🌍 Jazykové verze (CZ + EN)

Web je dvojjazyčný, postavený podle SEO/GEO best practice — **každý jazyk má vlastní indexovatelnou URL**, ne JS přepínač:
- **Čeština** = výchozí, na rootu `/`
- **Angličtina** = `/en/`
- Stránky jsou propojené `hreflang` (`cs`, `en`, `x-default`) a přepínačem **CZ / EN** v hlavičce.
- Sdílí jeden `styles.css` a `main.js`; texty objednávkového modalu se v JS přepínají podle `lang` v `<html>`.

> ⚠️ **Při úpravách textů mysli na obě verze** — když změníš nabídku/cenu/texty v `index.html`, uprav i `en/index.html` (a naopak), ať se obsah nerozejde.

## ▶️ Jak web spustit

- **Nejrychleji:** dvojklik na `index.html` → otevře se v prohlížeči.
- **Lokální server** (kvůli správnému chování odkazů):
  ```bash
  cd kortizolreset.cz
  python3 -m http.server 4321
  # → http://localhost:4321
  ```

## 🌐 Jak web nasadit (zveřejnit)

Je to statický web, takže funguje zdarma téměř kdekoli — nahraj obsah složky:
- **Vercel / Netlify** – přetáhni složku do okna prohlížeče, hotovo.
- **Webhosting (FTP)** – nahraj soubory do `www`/`public_html`.
- Pak nasměruj doménu na hosting.

> ℹ️ **Doména:** web cílí na **kortizolreset.cz** (odkazy `canonical`, `og:url`
> i e-mail už na ni míří). Lokální složka se zatím jmenuje `konrtizolreset.cz` —
> to je jen kosmetika, na fungování webu to nemá vliv; klidně ji přejmenuj.
> Pokud doménu někdy změníš, uprav v `index.html` `canonical`, `og:url` a e-mail.

---

## ✏️ Co si snadno uprav (nejčastější)

| Co | Kde |
|---|---|
| **Cena** (1 290 Kč / 1 990 Kč / splátky) | `index.html` – sekce `#cena` + `.mobile-cta` + JSON-LD `"price"` |
| **Texty, nadpisy, FAQ** | `index.html` |
| **Bonusy a jejich hodnoty** | `index.html` – sekce `#bonusy` |
| **E-mail / kontakt** | patička v `index.html` (`info@kortizolreset.cz`) |
| **Barvy a fonty** | `assets/css/styles.css` – blok `:root` nahoře |
| **Obrázky** | atribut `src="https://images.unsplash.com/..."` v `index.html` |

### 📷 Tvoje fotka (sekce „Kdo tě provede")
Teď je tam monogram **HM**. Nahraď ho svou fotkou:
1. Ulož fotku do `assets/img/hana.jpg`.
2. V `index.html` v sekci `#o-mne` nahraď
   `<div class="avatar-fallback">HM</div>` za
   `<img src="assets/img/hana.jpg" alt="Hana Mašínová" style="width:100%;height:100%;object-fit:cover">`.

### ⭐ Reference
Reference v sekci „Co se změnilo po 28 dnech" jsou **ukázkové** — nahraď je
skutečnými ohlasy klientek (jméno, věk, město, text).

---

## 💳 Napojení objednávky / platby (důležité)

Tlačítka „Chci svoje místo" otevřou jednoduchý formulář (jméno + e-mail).
Teď jen zobrazí poděkování — **je potřeba ho napojit na reálnou platbu.**

V `assets/js/main.js` najdi komentář
`=== Sem napoj odeslání na svůj backend / platební bránu ===`
a vlož napojení podle nástroje, který používáš:

- **FAPI / SimpleShop / Shoptet** – nejčastější v ČR pro prodej e-booků a kurzů.
  Většinou stačí, aby tlačítko vedlo přímo na jejich objednávkový odkaz —
  pak můžeš formulář klidně vynechat a v `index.html` u tlačítek nahradit
  `id="orderBtn"` za `href="https://tvuj-odkaz-na-platbu"`.
- **Stripe Payment Link / GoPay** – obdobně, vlož odkaz na platbu.
- **Sběr e-mailů (Ecomail, Mailchimp)** – pošli data z formuláře přes jejich API/formulář.

Odpočet 24 h je „evergreen" — každému návštěvníkovi běží vlastní 24h okno
(uložené v prohlížeči). Délku změníš v `main.js` (`WINDOW_MS`).

---

## 🔎 SEO / GEO soubory

- `robots.txt` – povoluje běžné i AI crawlery (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) + odkaz na sitemapu
- `sitemap.xml` – obě jazykové verze s `hreflang`
- `manifest.webmanifest` + `assets/img/logo.svg` – PWA (ikona, barvy, „přidat na plochu")
- `llms.txt` – shrnutí webu pro AI/LLM (GEO – ať tě AI enginy správně pochopí a citují)
- `404.html` – branded chybová stránka
- Strukturovaná data: `Course`, `FAQPage`, **`Organization` + `Person`** (E-E-A-T – autorita Hany Mašínové)
- **Render/výkon:** obsah je viditelný i bez JavaScriptu (animace se spouští jen když JS běží) → lepší LCP a spolehlivá indexace pro vyhledávače i AI

### OG sdílecí obrázek
Připravená brandovaná šablona `assets/img/og-cover.svg` (1200×630). Pro náhledy při sdílení na sítích ji vyexportuj do PNG/JPG (jakýkoli online konvertor) jako `assets/img/og-cover.jpg` a v `index.html` i `en/index.html` přepiš `og:image` na `https://kortizolreset.cz/assets/img/og-cover.jpg`. (Teď `og:image` ukazuje na funkční fotku z Unsplash, takže sdílení funguje i bez exportu.)

## ✅ Co web umí (přehled)

- Plně **responzivní** (mobil, tablet, desktop) + mobilní menu a spodní lišta s CTA
- **Motivační kalendář** (ukázka) a **tisknutelná A4 tabulka úspěchů** (`tracker.html`)
- **Odpočet 24 h** pro bonusy, **objednávkový modal**, **FAQ** rozbalování
- Jemné **animace** při scrollování
- **SEO**: titulek, popis, Open Graph, strukturovaná data (Course + FAQ)
- **Přístupnost**: ovládání klávesnicí, popisky, kontrast

---

## 🖨️ Tabulka úspěchů k tisku
`tracker.html` je navržená na **A4 na jeden list**. Otevři ji, klikni
„Vytisknout tabulku", zvol formát A4 a zapni „tisk barev na pozadí".
```
