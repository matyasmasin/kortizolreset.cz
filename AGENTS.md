# AGENTS.md — kontext projektu pro AI agenty

> Tento soubor si kódovací agenti (Codex, Claude…) načítají automaticky. Popisuje, **co projekt je, jak je postavený, jak se nasazuje a jaká pravidla platí.** Drž se ho.

---

## 1. Co to je

**kortizolreset.cz** — prémiová prodejní landing page + blog + kvíz pro **28denní online program „Kortizol Reset"** autorky **Hany Mašínové** (certifikovaná poradkyně pro výživu). Program pomáhá ženám přirozeně snížit kortizol (stresový hormon) a vrátit si energii, spánek a hormonální rovnováhu — bez drastických diet.

- **Cílovka:** ženy, dlouhodobě unavené, řeší spánek/stres/chutě/zaseknuté hubnutí.
- **Tón:** ženský, klidný, důvěryhodný, odborný ale srozumitelný. **Žádné strašení, žádné zdravotní sliby.**

Doplňkové zdroje v repu: `README.md` (uživatelský návod), `llms.txt` (shrnutí pro AI/GEO).

---

## 2. Tech stack

- **Čisté HTML + CSS + JS. ŽÁDNÝ framework, ŽÁDNÝ build krok, ŽÁDNÉ závislosti.** Soubory se editují přímo a rovnou fungují.
- Jeden sdílený `assets/css/styles.css` a `assets/js/main.js` (menu, 24h odpočet, modal, animace) + `assets/js/forms.js` (sběr e-mailů).
- Fonty: Google Fonts (Fraunces = display serif, Plus Jakarta Sans = body). Obrázky: Unsplash přes URL.

---

## 3. Nasazení (NEJDŮLEŽITĚJŠÍ)

- Web běží na **GitHub Pages** z repa **`matyasmasin/kortizolreset.cz`**, branch **`main`**, kořen `/`.
- **NASAZENÍ = commit + push do `main`.** Pages se samy rebuildnou a do ~1–2 min je změna živá na **https://kortizolreset.cz** (doménu drží soubor `CNAME`, HTTPS řeší GitHub, http→https se přesměrovává). **Žádný FTP.**
- Codex běží v cloud sandboxu a většinou **otevře Pull Request** → nasazení spustí až **merge do `main`**. Když ti prostředí dovolí commitovat rovnou do `main`, udělej to.
- DNS je vedené u WEDOSu, ale míří na GitHub Pages (`A → 185.199.108–111.153`, `www` CNAME → `matyasmasin.github.io`). WEDOS hosting se nepoužívá.
- **Nesahej na:** `CNAME` (drží doménu — smazání shodí web), `.htaccess` a `.github/workflows/deploy.yml` (nepoužité zbytky po WEDOSu).

---

## 4. Struktura repa

```
index.html                    ← hlavní prodejní stránka (ČEŠTINA, výchozí)
o-mne.html                    ← O mně (Hana Mašínová)
kviz.html                     ← 2min „kortizol test" (lead magnet)
tracker.html                  ← tisknutelná A4 tabulka úspěchů
obchodni-podminky.html
ochrana-osobnich-udaju.html
404.html
blog/
  index.html                  ← rozcestník blogu
  jak-snizit-kortizol-prirozene.html, priznaky-vysokeho-kortizolu.html,
  kortizol-a-bricho.html, kortizol-a-spanek.html, kortizol-v-menopauze.html,
  potraviny-snizujici-kortizol.html, adrenalni-unava.html, kortizolovy-koktejl.html
en/                           ← ANGLICKÁ verze (zrcadlí CZ)
  index.html, about.html, quiz.html, tracker.html, privacy.html, terms.html
  blog/ … (8 článků = protějšky CZ)
assets/css/styles.css         ← celý design, sdílený všemi stránkami
assets/js/main.js             ← menu, odpočet, modal, animace
assets/js/forms.js            ← sběr e-mailů (viz §8)
assets/img/                   ← logo.svg, logo-full.svg, og-cover.svg
sitemap.xml (28 URL) · robots.txt · llms.txt · manifest.webmanifest
```

### CZ ↔ EN páry (drž je v souladu)
| Čeština | English |
|---|---|
| `index.html` | `en/index.html` |
| `o-mne.html` | `en/about.html` |
| `kviz.html` | `en/quiz.html` |
| `tracker.html` | `en/tracker.html` |
| `obchodni-podminky.html` | `en/terms.html` |
| `ochrana-osobnich-udaju.html` | `en/privacy.html` |
| `blog/<clanek>.html` | `en/blog/<article>.html` |

---

## 5. Dvojjazyčnost (pravidlo #1)

- **Čeština = výchozí na rootu `/`. Angličtina = `/en/`.** Každý jazyk má vlastní indexovatelnou URL (ne JS přepínač).
- Stránky jsou propojené `hreflang` (`cs`, `en`, `x-default`) a přepínačem CZ/EN v hlavičce.
- ⚠️ **Když měníš obsah/nabídku/ceny v CZ, udělej totéž v odpovídající EN stránce (a naopak).** Nenech verze rozejít.
- ⚠️ **Měna se liší:** CZ = **1 290 Kč / CZK**, EN = **€49 / EUR**. Nikdy slepě nekopíruj číslo mezi jazyky — přepočítej/uprav v jeho měně.

---

## 6. Údaje na více místech (pozor při změnách)

**Cena** je v `index.html` na několika místech — při změně projdi VŠECHNA:
1. JSON-LD `Course` → `offers.price` (v `<head>`)
2. lišta `.mobile-cta` (dole)
3. sekce `#cena`: `.price-tag` (`.now` / `.was`), `.price-sub` (splátky), řádek „hodnota všeho uvnitř"
Totéž v `en/index.html` v EUR. Po úpravě si `grep`em ověř, že nikde nezůstala stará hodnota.

---

## 7. Design systém (reuž existující, needituj tokeny bezdůvodně)

Barvy a typografii řídí blok `:root` v `styles.css`:
- **Barvy:** `--cream` #FBF6EE (pozadí), `--sage` #6E9476 (primární zelená), `--sage-ink` #2C3F31 (text), `--clay` #C76B4E (CTA akcent), `--gold` #D7AE63.
- **Fonty:** `--font-display` Fraunces (nadpisy), `--font-body` Plus Jakarta Sans.
- **Typo scale:** `--step--1` … `--step-5` (fluidní `clamp`). **Radii:** `--r-sm/-r/-r-lg/-r-pill`. **Stíny:** `--shadow*`. **Ease:** `--ease`.

**Znovupoužitelné komponenty (třídy, které už existují — použij je, ať nový obsah sedí):**
`.section` (+`--alt`/`--cream`/`--sage`) · `.container` (+`.narrow`) · `.section-head.center` · `.eyebrow` · `.lead` · `.grid.grid-2/3/4` · `.card` (+`--clay`) · `.split` (+`--reverse`) · `.steps/.step` · `.check-list` (+`--ok`) · `.pill/.pill-row` · `.btn` (+`--big/--ghost/--light/--block`) · `.faq/.faq-item` · `.quote` (recenze) · `.recipe` · `.stats/.stat` · `.bonus` · `.guarantee` · `.health-note` · `.reveal` (scroll animace, `data-delay`). Blog používá `.legal-top`, `.post-wrap`, `.post-head`, `.post-body`, `.post-cta`, `.crumbs`, `.post-toc`, `.related`.

> Obsah musí být **vidět i bez JavaScriptu** (`.reveal` jen animuje, neskrývá napevno). Drž relativní cesty k assetům (blog používá `../assets/...`).

---

## 8. Business / konverze

- **Program:** 28denní (4 týdny), online. **Cena:** jednorázově 1 290 Kč (nebo 3× 430 Kč) / €49. **Garance:** 14 dní na vrácení peněz.
- **Bonusy** (sekce `#bonusy`): 3 bonusy zdarma při objednání do 24 h. **Odpočet** je evergreen 24h (`WINDOW_MS` v `main.js`), běží každému návštěvníkovi vlastní.
- **Objednávka / platba:** přes platební panel (QR kód + číslo účtu / převod). E-mail: **info@kortizolreset.cz**.
- **Sběr e-mailů z kvízu** (`assets/js/forms.js`): funkce `window.krSubmitEmail(email, meta)` odesílá přes **Web3Forms** (bez backendu). ⚠️ **Zatím není vyplněný klíč** — v `forms.js` je `CFG.accessKey = 'PASTE-WEB3FORMS-ACCESS-KEY'`. Dokud se nedoplní, kvíz funguje, ale e-mail se neodešle (varování v konzoli). Napojení = vložit access key z web3forms.com.

---

## 9. SEO / GEO konvence (dodržuj u KAŽDÉ stránky)

- Každá stránka: unikátní `<title>`, `meta description`, `link canonical`, **`hreflang` × 3** (cs/en/x-default), Open Graph.
- **Strukturovaná data (JSON-LD):** landing = `Course` + `FAQPage` + `Organization` + `Person`; blogové články = `Article` + `BreadcrumbList`. **FAQPage schema MUSÍ zrcadlit viditelné FAQ na stránce** (Google to vyžaduje).
- **Při přidání nové stránky VŽDY:** doplň ji do `sitemap.xml` (absolutní https URL) a případně do `llms.txt`. `robots.txt` povoluje i AI crawlery (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…).
- Interně prolinkuj (landing ↔ blog ↔ kvíz), používej klíčová slova v `H2` a alt textech přirozeně (ne keyword stuffing).

---

## 10. Zdravotní obsah — POVINNÁ pravidla (YMYL)

Téma je zdraví, takže velmi opatrně:
- **Žádné zdravotní sliby ani garance** („vyléčí", „zaručeně", „odstraní nemoc", „100 %"). Používej „může", „u části žen", „často".
- Vždy zdůrazni, že program **nenahrazuje lékařskou péči** a při potížích **ať se poradí s lékařem**. Každý článek/kvíz má mít disclaimer.
- Žádné strašení, žádné diagnózy. Kvíz i symptomy formuluj jako **orientační**, ne diagnostické.

---

## 11. Pracovní postup

1. Uprav soubory přímo (CZ i EN, viz §5).
2. Ověř lokálně: `python3 -m http.server 4321` → http://localhost:4321 (config je v `.claude/launch.json`).
3. Commit **česky, výstižně** → `git push origin main` (nebo PR → merge). Před pushem `git pull --rebase` (na repu se pracuje i odjinud).
4. Ověř, že je změna reálně živá: `curl -s https://kortizolreset.cz/...` (deploy ~1–2 min, Pages má CDN cache).

---

## 12. Otevřené TODO (ne chyby)

- **Sběr e-mailů z kvízu:** doplnit Web3Forms access key do `assets/js/forms.js` (viz §8).
- **Fotka autorky:** v sekci „O mně" je zatím monogram „HM" — nahradit `assets/img/hana.jpg` (návod v `README.md`).
- **Reference** na landing jsou ukázkové — nahradit skutečnými ohlasy klientek.
