(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  window.addEventListener("load", function () { requestAnimationFrame(function () { body.classList.add("loaded"); }); });

  /* bolhas discretas no fundo */
  var compactScreen = window.matchMedia("(max-width: 760px)").matches;
  if (!reduce) {
    for (var b = 0; b < (compactScreen ? 3 : 7); b++) {
      var s = document.createElement("span"), z = 6 + Math.random() * 10;
      s.className = "bub";
      s.style.cssText = "left:" + Math.random() * 100 + "%;width:" + z + "px;height:" + z + "px;--dx:" + (Math.random() * 80 - 40) + "px;animation-duration:" + (18 + Math.random() * 12) + "s;animation-delay:" + -Math.random() * 20 + "s";
      $(".bg").appendChild(s);
    }
  }

  /* revelações escalonadas */
  $$("section").forEach(function (sec) { $$(".rv", sec).forEach(function (el, i) { el.style.setProperty("--d", Math.min(i * 0.08, 0.5) + "s"); }); });
  if (!("IntersectionObserver" in window)) { $$(".rv").forEach(function (el) { el.classList.add("in"); }); }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv").forEach(function (el) { io.observe(el); });

  /* tema de fundo por seção, com transição suave de cor */
  var sections = $$("main section"), links = $$("#nav a"), dotsEl = $("#dots");
  sections.forEach(function (sec) {
    var li = document.createElement("li"); li.title = sec.id;
    li.onclick = function () { sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); };
    dotsEl.appendChild(li);
  });
  var dots = $$("li", dotsEl);
  var so = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = sections.indexOf(e.target);
      body.dataset.theme = e.target.dataset.theme || "off";
      sections.forEach(function (s) { s.classList.toggle("active", s === e.target); });
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
      links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (sec) { so.observe(sec); });

  /* rolagem: progresso, cabeçalho, paralaxe do peixe e dos manchas de fundo */
  /* Defer the heavy 3D embed until it is close to the viewport. */
  var stage = $("#stage"), model = $("#stage iframe"), modelObserver;
  if (stage && model) {
    model.addEventListener("load", function () { stage.classList.add("ready"); }, { once: true });
    function loadModel() {
      if (!model.src) { model.loading = "eager"; model.src = model.getAttribute("data-src"); }
      if (modelObserver) modelObserver.disconnect();
    }
    if ("IntersectionObserver" in window) {
      modelObserver = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) loadModel();
      }, { rootMargin: "140px 0px" });
      modelObserver.observe(stage);
    } else loadModel();
  }

  var bar = $("#bar"), top = $(".top"), lastY = 0, tick = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    top.classList.toggle("solid", y > 40);
    top.classList.toggle("hide", !compactScreen && y > lastY && y > 300);
    lastY = y;
    tick = false;
  }
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  var huntScene = document.querySelector(".hunt-scene");
  if (huntScene) { var huntStages = Array.prototype.slice.call(document.querySelectorAll(".hunt-stage")), huntLabels=["Imóvel e camuflado","A presa entra no alcance","Ataque rápido"],huntCopies=["O padrão do corpo se confunde com o substrato enquanto o animal espera.","Ao se aproximar uma presa, o tubarão-anjo continua junto ao fundo.","O corpo parte em um movimento curto para surpreender a presa."],huntTimer=[];function setHuntStage(index){window.clearTimeout(huntTimer[0]);huntScene.dataset.state=huntStages[index].dataset.state;huntStages.forEach(function(button,i){button.classList.toggle("active",i===index);button.setAttribute("aria-pressed",i===index?"true":"false");});document.querySelector("#hunt-label").textContent=huntLabels[index];document.querySelector("#hunt-copy").textContent=huntCopies[index];}huntStages.forEach(function(button,index){button.addEventListener("click",function(){setHuntStage(index);});});document.querySelector("#hunt-play").addEventListener("click",function(){setHuntStage(0);huntTimer[0]=window.setTimeout(function(){setHuntStage(1);huntTimer[0]=window.setTimeout(function(){setHuntStage(2);huntTimer[0]=window.setTimeout(function(){setHuntStage(0);},2200);},2200);},1600);}); }

  var fishTabs = Array.prototype.slice.call(document.querySelectorAll(".fish-tab"));
  if (fishTabs.length) {
    var explorerImage = document.querySelector("#explorer-image"), explorerCard = document.querySelector("#explorer-card");
    fishTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        fishTabs.forEach(function (item) { item.classList.remove("active"); item.setAttribute("aria-pressed", "false"); });
        tab.classList.add("active"); tab.setAttribute("aria-pressed", "true");
        explorerCard.classList.add("switching");
        window.setTimeout(function () {
          explorerImage.src = tab.dataset.image; explorerImage.alt = tab.dataset.alt;
          document.querySelector("#explorer-name").textContent = tab.dataset.name;
          document.querySelector("#explorer-summary").textContent = tab.dataset.summary;
          document.querySelector("#explorer-skeleton").textContent = tab.dataset.skeleton;
          document.querySelector("#explorer-gills").textContent = tab.dataset.gills;
          document.querySelector("#explorer-float").textContent = tab.dataset.float;
          explorerCard.classList.remove("switching");
        }, 120);
      });
    });
  }

  var anatomyLab = document.querySelector(".anatomy-lab");
  if (anatomyLab) {
    var markers = Array.prototype.slice.call(anatomyLab.querySelectorAll(".hotspot"));
    var labTitle = anatomyLab.querySelector("#lab-title"), labCopy = anatomyLab.querySelector("#lab-copy"), progress = anatomyLab.querySelectorAll(".lab-progress i"), labStep = anatomyLab.querySelector(".lab-step");
    markers.forEach(function (marker, index) {
      marker.addEventListener("click", function () {
        markers.forEach(function (item) { item.classList.remove("selected"); item.setAttribute("aria-pressed", "false"); });
        marker.classList.add("selected"); marker.setAttribute("aria-pressed", "true");
        labTitle.textContent = marker.dataset.title; labCopy.textContent = marker.dataset.copy;
        labStep.textContent = "PISTA " + (index + 1) + " / 3";
        progress.forEach(function (item, i) { item.classList.toggle("done", i <= index); });
      });
    });
  }

  /* Desafios de observa\u00e7\u00e3o e conserva\u00e7\u00e3o do tubarao-anjo */
  var Q = [
    { topic: "Leitura da anatomia", scene: "Na ficha de campo: corpo achatado, olhos no topo e fendas branquiais nas laterais.", q: "Qual pista confirma que o animal \u00e9 cartilaginoso?", o: ["Fendas branquiais sem um op\u00e9rculo cobrindo-as", "Br\u00e2nquias escondidas sob uma tampa \u00f3ssea", "Tent\u00e1culos ao redor da boca"], a: 0, e: "Tubar\u00e3es e raias exibem fendas branquiais; peixes \u00f3sseos geralmente t\u00eam op\u00e9rculo." },
    { topic: "Comportamento no fundo", scene: "O tubar\u00e3o-anjo repousa camuflado sobre areia ou lodo e espera a presa se aproximar.", q: "Que estrat\u00e9gia de ca\u00e7a combina com essa observa\u00e7\u00e3o?", o: ["Perseguir cardumes em mar aberto", "Atacar de surpresa em uma emboscada", "Filtrar pl\u00e3ncton enquanto nada"], a: 1, e: "A camuflagem permite ao tubar\u00e3o-anjo surpreender peixes e outros animais que passam perto." },
    { topic: "Ciclo de vida", scene: "A ficha de Squatina dumeril registra ninhadas de 4 a 25 filhotes.", q: "A que esse intervalo se refere?", o: ["A idade em que come\u00e7a a nadar", "Ao n\u00famero de filhotes por ninhada", "A profundidade onde os filhotes sempre nascem"], a: 1, e: "A esp\u00e9cie \u00e9 viv\u00edpara aplacent\u00e3ria: os filhotes se desenvolvem no corpo da m\u00e3e." },
    { topic: "Rastreabilidade", scene: "Na peixaria, a etiqueta diz apenas 'ca\u00e7\u00e3o' e n\u00e3o identifica a esp\u00e9cie.", q: "Qual informa\u00e7\u00e3o ajuda a investigar a origem do produto?", o: ["O nome da esp\u00e9cie e a proced\u00eancia da captura", "Somente o tamanho do pacote", "A cor da embalagem"], a: 0, e: "O nome comercial gen\u00e9rico n\u00e3o revela qual tubar\u00e3o foi capturado; esp\u00e9cie e origem ajudam no rastreamento." },
    { topic: "Conserva\u00e7\u00e3o em campo", scene: "Uma rede perdida continua no mar e pode prender animais mesmo sem estar sendo usada.", q: "Qual resposta ajuda a reduzir esse risco com seguran\u00e7a?", o: ["Puxar a rede sozinho ao encontrar um animal preso", "Registrar o local e avisar uma equipe ou autoridade ambiental", "Deixar a ocorr\u00eancia sem comunicar"], a: 1, e: "Redes perdidas podem continuar capturando animais; o registro ajuda equipes a localizar e responder ao problema." }
  ];
  var box = $("#qbox"), n = 0, pts = 0;
  function bars() { return '<div class="pg">' + Q.map(function (_, i) { return '<i class="' + (i < n ? "d" : "") + '"></i>'; }).join("") + "</div>"; }
  function render() {
    if (n >= Q.length) {
      var report = pts === Q.length ? "Leitura de campo excelente: voc\u00ea conectou anatomia, comportamento e conserva\u00e7\u00e3o." : pts >= 3 ? "Boa investiga\u00e7\u00e3o. Reveja as pistas que passaram despercebidas e continue observando." : "Toda pesquisa come\u00e7a pela observa\u00e7\u00e3o. Volte \u00e0s pistas e tente novamente.";
      box.innerHTML = '<div class="step">' + bars() + '<p class="qn">Relat\u00f3rio da miss\u00e3o</p><p class="qq">' + pts + " de " + Q.length + ' leituras corretas.</p><p class="exp show"></p><button class="btn solid" id="again">Refazer a miss\u00e3o</button></div>';
      $(".exp", box).textContent = report;
      $("#again").onclick = function () { n = 0; pts = 0; render(); };
      return;
    }
    var it = Q[n];
    box.innerHTML = '<div class="step">' + bars() + '<div class="case-note"><span class="case-topic"></span><p class="case-scene"></p></div><p class="qn">Desafio ' + (n + 1) + " de " + Q.length + '</p><p class="qq"></p><div class="os"></div><p class="exp"></p><button class="btn solid" hidden>' + (n === Q.length - 1 ? "Ver relat\u00f3rio" : "Pr\u00f3xima pista") + "</button></div>";
    $(".case-topic", box).textContent = it.topic;
    $(".case-scene", box).textContent = it.scene;
    $(".qq", box).textContent = it.q;
    var exp = $(".exp", box), next = $(".btn", box);
    it.o.forEach(function (t, j) {
      var b = document.createElement("button"); b.className = "opt"; b.textContent = t;
      b.onclick = function () {
        $$(".opt", box).forEach(function (x, k) { x.disabled = true; if (k === it.a) x.classList.add("ok"); });
        if (j === it.a) pts++; else b.classList.add("no");
        exp.textContent = (j === it.a ? "Pista certa. " : "Pista perdida. ") + it.e; exp.classList.add("show"); next.hidden = false;
      };
      $(".os", box).appendChild(b);
    });
    next.onclick = function () { n++; render(); };
  }
  render();
})();
