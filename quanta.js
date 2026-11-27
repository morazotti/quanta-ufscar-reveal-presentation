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

// Fórmulas animadas sem distorção, como o TransformMatchingTex do manim.
// O auto-animate leva cada elemento [data-id] (\id, \idc) da posição e do
// tamanho antigos aos novos com translate + scale(largura, altura). Num
// pedaço de fórmula a caixa muda mesmo com a letra igual (K vira K^{-1}, o
// KaTeX põe o espaço do "+" vizinho dentro dela), e a escala separada em x e
// y estica a letra. Aqui sobra só o translate: a letra vai do canto superior
// esquerdo antigo ao novo no seu próprio tamanho.
// O evento autoanimate sai logo depois de a folha de estilo ser montada e
// antes de a transição começar, então dá para editá-la.
(function () {
  Reveal.on('autoanimate', function (evento) {
    var css = evento.sheet.innerHTML;
    evento.toSlide.querySelectorAll('.katex [data-id][data-auto-animate-target]')
      .forEach(function (el) {
        var alvo = '[data-auto-animate-target="' + el.dataset.autoAnimateTarget + '"] {';
        var inicio = css.indexOf(alvo);
        if (inicio < 0) return;
        var fim = css.indexOf('}', inicio);
        css = css.slice(0, inicio) +
              css.slice(inicio, fim).replace(/ ?scale\([^)]*\)/, '') +
              css.slice(fim);
      });
    evento.sheet.innerHTML = css;
  });
})();
