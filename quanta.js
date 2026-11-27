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
