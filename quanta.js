// Fundos com a mesma forma (classes quanta-*, ver custom.css) não piscam
// entre slides vizinhos. O reveal.js faz fade cruzado entre o fundo antigo e
// o novo, e no meio do fade os dois triângulos sobrepostos ficam
// translúcidos. Ele só pula o fade quando os dois fundos têm o mesmo
// data-background-hash, calculado apenas dos atributos data-background-*;
// aqui as classes quanta-* entram nesse hash.
(function () {
  function marcar() {
    Reveal.getSlides().forEach(function (slide) {
      var classes = Array.prototype.filter.call(slide.classList, function (c) {
        return c.indexOf('quanta-') === 0;
      });
      var fundo = Reveal.getSlideBackground(slide);
      if (!classes.length || !fundo) return;
      fundo.setAttribute('data-background-hash',
                         (fundo.getAttribute('data-background-hash') || '') +
                         '|' + classes.sort().join(' '));
    });
  }

  if (Reveal.isReady()) marcar();
  else Reveal.on('ready', marcar);
})();

// Títulos no auto-animate. O reveal.js leva o título do slide anterior ao do
// novo com translate + scale(largura, altura) das caixas. Do slide metade
// (título numa coluna de meia largura) para um slide comum (título na
// largura toda) a escala em x é 0,5: a letra seria esmagada no meio do
// caminho. Aqui sobra só o translate, e o título centralizado desliza do
// centro da caixa antiga ao da nova, no seu próprio tamanho. Títulos
// alinhados à esquerda só perdem a escala.
// O evento autoanimate sai depois de a folha de estilo ser montada e antes
// de a transição começar, então dá para editá-la.
(function () {
  Reveal.on('autoanimate', function (evento) {
    var css = evento.sheet.innerHTML;
    evento.toSlide.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function (h) {
      var id = h.dataset.autoAnimateTarget;
      if (!id) return;
      var alvo = '[data-auto-animate-target="' + id + '"] {';
      var inicio = css.indexOf(alvo);
      if (inicio < 0) return;
      var fim = css.indexOf('}', inicio);
      var regra = css.slice(inicio, fim);
      var escala = /scale\(([^,]+), ([^)]+)\)/.exec(regra);
      if (!escala) return;
      var translado = /translate\(([^,]+)px, ([^)]+)px\)/.exec(regra);
      var dx = translado ? parseFloat(translado[1]) : 0;
      var dy = translado ? parseFloat(translado[2]) : 0;
      if (getComputedStyle(h).textAlign === 'center') {
        dx += h.offsetWidth * (parseFloat(escala[1]) - 1) / 2;
        dy += h.offsetHeight * (parseFloat(escala[2]) - 1) / 2;
      }
      css = css.slice(0, inicio) +
            regra.replace(/transform: [^;]*;/,
                          'transform: translate(' + dx + 'px, ' + dy + 'px) !important;') +
            css.slice(fim);
    });
    evento.sheet.innerHTML = css;
  });
})();
