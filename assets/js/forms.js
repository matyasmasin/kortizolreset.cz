/* =========================================================================
   KORTIZOL RESET — sběr e-mailů (lead capture)
   Statický web (GitHub Pages) → odesílá přes formulářovou službu bez backendu.
   =========================================================================

   ► JAK NAPOJIT (stačí jednou, ~1 minuta):

   A) Web3Forms (DOPORUČENO – zdarma, jen e-mail, skryje tvou adresu):
      1. Jdi na https://web3forms.com → zadej svůj e-mail → dostaneš "Access Key".
      2. Vlož klíč níže do CFG.accessKey (nahraď text PASTE-WEB3FORMS-ACCESS-KEY).
      Hotovo. Leady ti chodí na e-mail. (Web3Forms umí i webhook do Ecomailu/Zapieru.)

   B) Ecomail / vlastní formulář:
      1. V Ecomailu vytvoř formulář → zkopíruj jeho "action" URL (kam se odesílá).
      2. CFG.provider = 'custom' a CFG.customEndpoint = ta URL.
      (Pozn.: pole se jmenuje "email"; případně uprav v sekci 'custom' níže.)

   C) Formsubmit (bez klíče, jen e-mail – ale adresa je vidět v kódu):
      CFG.provider = 'formsubmit' a CFG.formsubmitEmail = 'tvuj@email.cz'.

   Dokud není nic vyplněno, kvíz funguje dál (ukáže poděkování i slevu),
   jen se e-mail nikam neodešle (upozornění je v konzoli prohlížeče).
   ========================================================================= */
(function () {
  'use strict';
  var CFG = {
    provider: 'web3forms',                    // 'web3forms' | 'ecomail-custom' | 'custom' | 'formsubmit'
    accessKey: 'PASTE-WEB3FORMS-ACCESS-KEY',  // ← sem vlož klíč z web3forms.com
    customEndpoint: '',                        // ← pro 'custom'/'ecomail-custom': action URL formuláře
    formsubmitEmail: ''                        // ← pro 'formsubmit': tvůj e-mail
  };

  function isConfigured() {
    if (CFG.provider === 'web3forms') return CFG.accessKey && CFG.accessKey.indexOf('PASTE') === -1;
    if (CFG.provider === 'formsubmit') return !!CFG.formsubmitEmail;
    return !!CFG.customEndpoint; // custom / ecomail-custom
  }

  /* Vrací Promise<{ok:boolean, demo?:boolean}>. Nikdy nevyhodí výjimku. */
  window.krSubmitEmail = function (email, meta) {
    meta = meta || {};
    if (!isConfigured()) {
      console.warn('[Kortizol Reset] Sběr e-mailů zatím NENÍ napojen. Doplň klíč v assets/js/forms.js (CFG). E-mail "' + email + '" se neodeslal.');
      return Promise.resolve({ ok: true, demo: true });
    }
    var url, body, headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (CFG.provider === 'web3forms') {
      url = 'https://api.web3forms.com/submit';
      body = JSON.stringify({
        access_key: CFG.accessKey,
        from_name: 'kortizolreset.cz',
        subject: 'Kortizol Reset – nový lead (' + (meta.source || 'web') + ')',
        email: email,
        kortizolovy_typ: meta.type || '',
        zdroj: meta.source || ''
      });
    } else if (CFG.provider === 'formsubmit') {
      url = 'https://formsubmit.co/ajax/' + encodeURIComponent(CFG.formsubmitEmail);
      body = JSON.stringify({ email: email, _subject: 'Kortizol Reset – nový lead', typ: meta.type || '', zdroj: meta.source || '' });
    } else { // custom / ecomail-custom
      url = CFG.customEndpoint;
      body = JSON.stringify({ email: email, type: meta.type || '', source: meta.source || '' });
    }
    return fetch(url, { method: 'POST', headers: headers, body: body })
      .then(function (r) { return { ok: r.ok }; })
      .catch(function () { return { ok: false }; });
  };
})();
