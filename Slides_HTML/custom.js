// ==========================================================
// NÚMERO DOS SLIDES EM FORMATO DE "PIZZA"
// HTML: pizza dinâmica
// PDF: uma pizza própria em cada slide
// ==========================================================

(function () {

  // ----------------------------------------------------------
  // Verifica se a apresentação está no modo de impressão PDF
  // ----------------------------------------------------------
  function isPrintPdf() {
    return (
      window.location.search.includes('print-pdf') ||
      document.documentElement.classList.contains('print-pdf') ||
      (document.body && document.body.classList.contains('print-pdf'))
    );
  }


  // ==========================================================
  // HTML NORMAL
  // ==========================================================

  function updateHtmlPie() {

    if (typeof Reveal === 'undefined') return;

    var el = document.querySelector('.slide-number');

    if (!el) return;


    // número do slide atual
    var current = Reveal.getSlidePastCount();

    // número total de slides, descontando a capa
    var total = Reveal.getTotalSlides() - 1;


    // esconde a pizza na capa
    if (current === 0) {
      el.style.visibility = 'hidden';
      return;
    }


    el.style.visibility = 'visible';


    // porcentagem preenchida da pizza
    var pct = (current / total * 100).toFixed(1) + '%';

    el.style.setProperty('--pie-progress', pct);


    // número mostrado dentro da pizza
    el.textContent = current;
  }


  // ==========================================================
  // PDF
  // ==========================================================

  function createPdfPies() {

    /*
      Pega apenas os slides reais.

      Reveal.getSlides() é preferível porque já retorna
      os slides que o RevealJS reconhece como slides.
    */
    var slides;

    if (
      typeof Reveal !== 'undefined' &&
      typeof Reveal.getSlides === 'function'
    ) {

      slides = Reveal.getSlides();

    } else {

      // alternativa caso Reveal ainda não esteja disponível
      slides = Array.from(
        document.querySelectorAll(
          '.reveal .slides section:not(.stack)'
        )
      );
    }


    if (!slides || !slides.length) return;


    // desconta a capa
    var total = slides.length - 1;


    slides.forEach(function (slide, i) {

      // ------------------------------------------------------
      // Remove pizza antiga
      // ------------------------------------------------------

      var oldPie = slide.querySelector('.pdf-pie-number');

      if (oldPie) {
        oldPie.remove();
      }


      // ------------------------------------------------------
      // Cria a pizza daquele slide
      // ------------------------------------------------------

      var pie = document.createElement('div');

      pie.className = 'pdf-pie-number';


      // ------------------------------------------------------
      // CAPA
      // ------------------------------------------------------

      if (i === 0 || slide.id === 'title-slide') {

        pie.style.visibility = 'hidden';

      }

      // ------------------------------------------------------
      // DEMAIS SLIDES
      // ------------------------------------------------------

      else {

        /*
          Evita um bug de renderização do conic-gradient
          quando o último slide chega exatamente a 100%.
          Visualmente, 99.9% continua parecendo preenchido.
        */
        var pctValue = (i === total)
          ? 99.9
          : (i / total * 100);

        var pct = pctValue.toFixed(1) + '%';

        pie.style.setProperty('--pie-progress', pct);

        pie.textContent = i;
      }


      slide.appendChild(pie);
    });
  }


  // ==========================================================
  // CRIAÇÃO DAS PIZZAS NO PDF
  // ==========================================================

  function preparePdfPies() {

    /*
      O modo print-pdf pode terminar de organizar os slides
      alguns instantes depois de o Reveal ficar pronto.

      Por isso repetimos a criação algumas vezes.
      Antes de criar novamente, createPdfPies()
      remove a pizza anterior.
    */

    createPdfPies();

    setTimeout(createPdfPies, 100);
    setTimeout(createPdfPies, 300);
    setTimeout(createPdfPies, 700);
    setTimeout(createPdfPies, 1500);
    setTimeout(createPdfPies, 3000);
  }


  // ==========================================================
  // QUANDO O REVEALJS ESTIVER PRONTO
  // ==========================================================

  function startPieNumbers() {

    if (typeof Reveal === 'undefined') {

      // Reveal ainda não carregou:
      // tenta novamente daqui a pouco
      setTimeout(startPieNumbers, 100);

      return;
    }


    // --------------------------------------------------------
    // Reveal já está pronto
    // --------------------------------------------------------

    if (
      typeof Reveal.isReady === 'function' &&
      Reveal.isReady()
    ) {

      if (isPrintPdf()) {

        preparePdfPies();

      } else {

        updateHtmlPie();

        Reveal.on('slidechanged', updateHtmlPie);
      }

      return;
    }


    // --------------------------------------------------------
    // Reveal ainda vai disparar o evento "ready"
    // --------------------------------------------------------

    Reveal.on('ready', function () {

      if (isPrintPdf()) {

        preparePdfPies();

      } else {

        updateHtmlPie();

        Reveal.on('slidechanged', updateHtmlPie);
      }

    });
  }


  // ==========================================================
  // IMPRESSÃO
  // ==========================================================

  /*
    Antes de o navegador abrir a impressão,
    garante novamente que as pizzas existam.
  */
  window.addEventListener('beforeprint', function () {

    if (isPrintPdf()) {
      createPdfPies();
    }

  });


  // ==========================================================
  // INICIALIZAÇÃO
  // ==========================================================

  /*
    Como custom.js pode estar sendo incluído no final do body,
    verificamos se a página já terminou de carregar.
  */

  if (document.readyState === 'complete') {

    startPieNumbers();

  } else {

    window.addEventListener('load', startPieNumbers);

  }

})();