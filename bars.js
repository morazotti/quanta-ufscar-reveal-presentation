// Barras laterais: o número de barras acompanha o índice horizontal do slide
// (slide de título = 0 barras, máximo MAX_BARRAS). Navegação vertical não altera.
// Cores alternam azul/laranja a partir da borda (ver custom.css).
// As barras entram/saem uma de cada vez (ATRASO_S entre elas), mesmo em saltos.
// No slide de título (indexh 0) a logo reduzida é ocultada via classe .slide-titulo.
(function () {
  var MAX_BARRAS = 4;
  var ATRASO_S = 0.25;

  var container = document.createElement('div');
  container.className = 'quanta-barras';
  for (var i = 0; i < MAX_BARRAS; i++) {
    var barra = document.createElement('div');
    barra.className = 'quanta-barra';
    barra.style.setProperty('--i', i);
    container.appendChild(barra);
  }
  var viewport = document.querySelector('.reveal-viewport') || document.querySelector('.reveal');
  viewport.appendChild(container);

  var atual = 0;

  function atualizar(indexh) {
    viewport.classList.toggle('slide-titulo', indexh === 0);
    var n = Math.min(indexh, MAX_BARRAS);
    var barras = container.children;
    for (var i = 0; i < MAX_BARRAS; i++) {
      var ordem;
      if (n > atual && i >= atual && i < n) ordem = i - atual;           // entram de dentro p/ fora
      else if (n < atual && i >= n && i < atual) ordem = atual - 1 - i;  // saem da mais externa p/ a primeira
      else continue;
      barras[i].style.transitionDelay = (ordem * ATRASO_S) + 's';
      barras[i].classList.toggle('ativa', i < n);
    }
    atual = n;
  }

  Reveal.on('ready', function (e) { atualizar(e.indexh); });
  Reveal.on('slidechanged', function (e) { atualizar(e.indexh); });
})();
