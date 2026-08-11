/* ============================================================
   VITOR GUEDES — app.js
   ============================================================ */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  function svg(tag, a) { var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); return n; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------------------------------------------------------- i18n */
  var lang = "pt";
  var saved = store("vg-lang");
  if (saved && window.I18N[saved]) lang = saved;

  function t(k) { var d = window.I18N[lang] || window.I18N.pt; return d[k] !== undefined ? d[k] : (window.I18N.pt[k] || ""); }

  function applyLang() {
    document.documentElement.setAttribute("lang", t("html.lang"));
    document.title = t("meta.title");

    $$("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (n) { n.innerHTML = t(n.getAttribute("data-i18n-html")); });
    $$("[data-i18n-attr]").forEach(function (n) { var p = n.getAttribute("data-i18n-attr").split("|"); n.setAttribute(p[0], t(p[1])); });

    $$("[data-chips]").forEach(function (n) {
      n.innerHTML = "";
      t(n.getAttribute("data-chips")).split("|").forEach(function (c) {
        if (!c) return;
        var s = document.createElement("span"); s.className = "chip"; s.textContent = c; n.appendChild(s);
      });
    });

    $$("[data-list]").forEach(function (n) {
      n.innerHTML = "";
      t(n.getAttribute("data-list")).split("|").forEach(function (c) {
        if (!c) return;
        var li = document.createElement("li"); li.innerHTML = c; n.appendChild(li);
      });
    });

    $$(".lang button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-lang") === lang); });

    // números: guarda o alvo e reanima se já estava visível
    $$("[data-count]").forEach(function (n) {
      var v = parseFloat(n.textContent.replace(/[^\d.-]/g, ""));
      n.dataset.target = isNaN(v) ? 0 : v;
      if (n.dataset.done === "1") n.textContent = n.dataset.target;
    });

    if (window.__redraw) window.__redraw();
  }

  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { lang = b.getAttribute("data-lang"); store("vg-lang", lang); applyLang(); });
  });

  /* ---------------------------------------------------------- menu mobile */
  var burger = $("#burger"), sheet = $("#sheet"), scrim = $("#scrim");
  function setSheet(open) {
    sheet.classList.toggle("on", open);
    if (scrim) scrim.classList.toggle("on", open);
    burger.classList.toggle("on", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", t(open ? "menu.close" : "menu.open"));
    document.body.style.overflow = open ? "hidden" : "";
  }
  function closeSheet() { setSheet(false); }
  burger.addEventListener("click", function () { setSheet(!sheet.classList.contains("on")); });
  if (scrim) scrim.addEventListener("click", closeSheet);
  $$("#sheet a").forEach(function (a) {
    a.addEventListener("click", function () {
      var id = a.getAttribute("href");
      closeSheet();
      var target = document.querySelector(id);
      if (target) {
        setTimeout(function () {
          var top = target.getBoundingClientRect().top + window.pageYOffset - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--bar")) || 56) - 4;
          window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
        }, 60);
      }
    });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  /* ---------------------------------------------------------- CTA de e-mail */
  $$("[data-mail-toggle]").forEach(function (btn) {
    var box = btn.parentNode;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !box.classList.contains("open");
      $$(".mailcta.open").forEach(function (o) { o.classList.remove("open"); });
      box.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function () {
    $$(".mailcta.open").forEach(function (o) {
      o.classList.remove("open");
      var b = $("[data-mail-toggle]", o); if (b) b.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") $$(".mailcta.open").forEach(function (o) { o.classList.remove("open"); });
  });
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var v = b.getAttribute("data-copy"), old = b.textContent;
      function ok() { b.textContent = t("ct.mcopied"); b.classList.add("done");
        setTimeout(function () { b.textContent = old; b.classList.remove("done"); }, 2200); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v).then(ok, function () {});
      } else {
        var ta = document.createElement("textarea"); ta.value = v; document.body.appendChild(ta);
        ta.select(); try { document.execCommand("copy"); ok(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------------------------------------------------------- reveal + contadores */
  function countUp(n) {
    var target = parseFloat(n.dataset.target || 0);
    n.dataset.done = "1";
    if (reduce || !target) { n.textContent = target; return; }
    var dur = 1100, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      n.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step); else n.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      $$("[data-count]", en.target).forEach(countUp);
      $$("[data-w]", en.target).forEach(function (bar, i) {
        setTimeout(function () { bar.style.width = bar.getAttribute("data-w") + "%"; }, 120 + i * 90);
      });
      if (en.target.__draw) en.target.__draw();
      io.unobserve(en.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -30px 0px" });

  $$(".rv,.stagger,.job,.sec-head,.cmp").forEach(function (n) { io.observe(n); });

  /* ---------------------------------------------------------- slots de imagem */
  $$("[data-shot]").forEach(function (fig) {
    var img = $("img", fig), src = fig.getAttribute("data-shot");
    var cap = $("figcaption", fig), box = fig.parentNode;
    var probe = new Image();
    probe.onload = function () {
      img.src = src;
      if (cap) img.alt = cap.textContent;
      fig.style.display = "";
    };
    probe.onerror = function () {
      fig.remove();
      if (box && !box.children.length) box.remove();
    };
    fig.style.display = "none";
    probe.src = src;
  });

  /* ---------------------------------------------------------- topbar / progresso */
  var topbar = $("#topbar"), progress = $("#progress");
  var navLinks = $$(".nav a, .sheet a");
  var tl = $(".tl"), tlFill = $("#tlFill");
  var blocks = $$("main > section[id], main > article.case");
  var darkSel = ["ink", "case--sf", "case--pr"];

  function onScroll() {
    var y = window.pageYOffset, probe = y + 80, cur = null, dark = false;
    blocks.forEach(function (b) {
      var top = b.offsetTop, bot = top + b.offsetHeight;
      if (probe >= top && probe < bot) {
        dark = darkSel.some(function (c) { return b.classList.contains(c); });
      }
      if (y + window.innerHeight * .35 >= top && y + window.innerHeight * .35 < bot && b.id) cur = b.id;
    });
    topbar.classList.toggle("is-dark", dark);
    navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
    var max = document.body.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + "%";

    if (tlFill && tl) {
      var r = tl.getBoundingClientRect();
      var p = (window.innerHeight * .62 - r.top) / r.height;
      tlFill.style.height = Math.max(0, Math.min(1, p)) * (r.height - 20) + "px";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------------------------------------------------------- helpers de gráfico */
  function smooth(pts) {
    var d = "M" + pts[0][0] + "," + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], cx = (a[0] + b[0]) / 2;
      d += " C" + cx + "," + a[1] + " " + cx + "," + b[1] + " " + b[0] + "," + b[1];
    }
    return d;
  }
  function stroke(node, dur) {
    if (reduce || !node.getTotalLength) return;
    var L = node.getTotalLength();
    node.style.strokeDasharray = L; node.style.strokeDashoffset = L;
    node.getBoundingClientRect();
    node.style.transition = "stroke-dashoffset " + (dur || 1400) + "ms cubic-bezier(.22,.61,.36,1)";
    node.style.strokeDashoffset = 0;
  }
  function fade(node, delay, to) {
    if (reduce) return;
    node.style.opacity = 0;
    node.style.transition = "opacity .7s ease " + (delay || 0) + "ms";
    setTimeout(function () { node.style.opacity = to === undefined ? 1 : to; }, 20);
  }
  function txt(x, y, s, fill, size, anchor, weight, fam) {
    var n = svg("text", {
      x: x, y: y, fill: fill, "font-size": size || 11, "text-anchor": anchor || "middle",
      "font-family": fam || "IBM Plex Mono, monospace", "font-weight": weight || 400
    });
    n.textContent = s; return n;
  }

  /* ---------------------------------------------------------- CASE 1 · Smart Fit */
  (function () {
    var el = $("#art-c1"); if (!el) return;
    var LIME = "#C7F24E", GOLD = "#E9C64A", MUTE = "#3C4A38", FG = "#F1F6EC", DIM = "#93A28F";
    var neg = [80, 77, 61, 42, 28, 20, 17];
    var W = 760, H = 300, L = 46, R = 24, T = 34, B = 46;

    el.__draw = function () {
      el.innerHTML = "";
      var n = neg.length, gap = 14;
      var bw = (W - L - R - gap * (n - 1)) / n;
      var h = H - T - B;

      [0, 50, 100].forEach(function (g) {
        var y = T + (1 - g / 100) * h;
        el.appendChild(svg("line", { x1: L, x2: W - R, y1: y, y2: y, stroke: "rgba(199,242,78,.16)", "stroke-width": 1 }));
        el.appendChild(txt(L - 10, y + 4, g + "%", DIM, 10, "end"));
      });

      neg.forEach(function (v, i) {
        var x = L + i * (bw + gap);
        var negH = h * v / 100, posH = h - negH;
        var gp = svg("g", {});
        gp.appendChild(svg("rect", { x: x, y: T, width: bw, height: posH, fill: LIME, rx: 3 }));
        gp.appendChild(svg("rect", { x: x, y: T + posH, width: bw, height: negH, fill: MUTE, rx: 3 }));
        gp.appendChild(txt(x + bw / 2, H - 24, "S" + (i + 1), DIM, 10));
        el.appendChild(gp);
        fade(gp, 120 + i * 110);

        var lab = txt(x + bw / 2, T + posH - 9, v + "%", i === n - 1 ? LIME : DIM, i === n - 1 ? 12.5 : 10.5, "middle", i === n - 1 ? 600 : 500);
        el.appendChild(lab);
        fade(lab, 420 + i * 110);
      });

      var mx = L + 2 * (bw + gap) + bw + gap / 2;
      var mk = svg("g", {});
      mk.appendChild(svg("line", { x1: mx, x2: mx, y1: T - 14, y2: H - B + 6, stroke: GOLD, "stroke-width": 1.5, "stroke-dasharray": "4 4" }));
      mk.appendChild(txt(mx + 8, T - 18, "ROLLOUT · 762", GOLD, 11, "start", 500));
      el.appendChild(mk); fade(mk, 900);

      var lg = svg("g", {});
      lg.appendChild(svg("rect", { x: L, y: H - 14, width: 10, height: 4, fill: LIME, rx: 2 }));
      lg.appendChild(txt(L + 16, H - 9, "positivas", DIM, 10, "start"));
      lg.appendChild(svg("rect", { x: L + 100, y: H - 14, width: 10, height: 4, fill: MUTE, rx: 2 }));
      lg.appendChild(txt(L + 116, H - 9, "negativas", DIM, 10, "start"));
      el.appendChild(lg); fade(lg, 1000);
    };
    io.observe(el);
  })();

  /* ---------------------------------------------------------- CASE 2 · McDonald's */
  (function () {
    var el = $("#art-c2"); if (!el) return;
    var RED = "#C2311F", GOLD = "#B08526", INK = "#2B1E15", DIM = "#7A6752";
    var vol = [4, 7, 13, 42, 88, 100, 74, 51, 36, 24, 16, 10];
    var marks = [4, 5, 6];
    var W = 760, H = 320, L = 46, R = 26, T = 44, B = 52;

    el.__draw = function () {
      el.innerHTML = "";
      var x = function (i) { return L + i * ((W - L - R) / (vol.length - 1)); };
      var y = function (v) { return T + (1 - v / 100) * (H - T - B); };

      [0, 50, 100].forEach(function (g) {
        el.appendChild(svg("line", { x1: L, x2: W - R, y1: y(g), y2: y(g), stroke: "rgba(43,30,21,.14)", "stroke-width": 1 }));
      });

      var pts = vol.map(function (v, i) { return [x(i), y(v)]; });
      var area = svg("path", { d: smooth(pts) + " L" + x(vol.length - 1) + "," + y(0) + " L" + x(0) + "," + y(0) + " Z", fill: RED, opacity: ".12" });
      el.appendChild(area); fade(area, 200, .12);

      var line = svg("path", { d: smooth(pts), fill: "none", stroke: RED, "stroke-width": 2.6, "stroke-linecap": "round" });
      el.appendChild(line); stroke(line, 1500);

      // raios dourados no pico
      var px = x(5), py = y(100);
      var burst = svg("g", {});
      for (var i = 0; i < 8; i++) {
        var a = (Math.PI * 2 * i) / 8;
        burst.appendChild(svg("line", {
          x1: px + Math.cos(a) * 13, y1: py + Math.sin(a) * 13,
          x2: px + Math.cos(a) * 21, y2: py + Math.sin(a) * 21,
          stroke: GOLD, "stroke-width": 2, "stroke-linecap": "round"
        }));
      }
      el.appendChild(burst); fade(burst, 1300);

      marks.forEach(function (m, k) {
        var g = svg("g", {});
        g.appendChild(svg("line", { x1: x(m), x2: x(m), y1: y(vol[m]), y2: H - B, stroke: GOLD, "stroke-width": 1.2, "stroke-dasharray": "4 4" }));
        g.appendChild(svg("circle", { cx: x(m), cy: y(vol[m]), r: 6, fill: GOLD, stroke: "#F5EEE1", "stroke-width": 2 }));
        g.appendChild(svg("circle", { cx: x(m), cy: H - B + 13, r: 9, fill: "#F5EEE1", stroke: GOLD, "stroke-width": 1.4 }));
        g.appendChild(txt(x(m), H - B + 16.5, "0" + (k + 1), INK, 9.5, "middle", 600));
        el.appendChild(g); fade(g, 1000 + k * 180);
      });

      if (!reduce) {
        var sweep = svg("line", { x1: L, x2: L, y1: T - 6, y2: H - B, stroke: GOLD, "stroke-width": 1.5, opacity: ".5" });
        el.appendChild(sweep);
        var t0 = null;
        requestAnimationFrame(function run(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1500, 1);
          var cx = L + (W - R - L) * p;
          sweep.setAttribute("x1", cx); sweep.setAttribute("x2", cx);
          if (p < 1) requestAnimationFrame(run); else sweep.remove();
        });
      }

      var lab = txt(px, py - 32, "pico da conversa", INK, 11.5, "middle", 600);
      el.appendChild(lab); fade(lab, 1500);
      el.appendChild(txt(L, H - 8, "linha do tempo do assunto", DIM, 10, "start"));
      el.appendChild(txt(W - R, H - 8, "01 · 02 · 03  respostas publicadas", GOLD, 10, "end", 500));
    };
    io.observe(el);
  })();

  /* ---------------------------------------------------------- CASE 2 · o momento cultural */
  (function () {
    var el = $("#art-c2b"); if (!el) return;
    var GOLD = "#B08526", RED = "#C2311F", INK = "#2B1E15", DIM = "#69543F", CREAM = "#F5EEE1";
    var W = 760, H = 240;

    el.__draw = function () {
      el.innerHTML = "";
      var defs = svg("defs", {});
      var g1 = svg("linearGradient", { id: "spot", x1: "0", y1: "0", x2: "0", y2: "1" });
      g1.appendChild(svg("stop", { offset: "0%", "stop-color": GOLD, "stop-opacity": ".28" }));
      g1.appendChild(svg("stop", { offset: "100%", "stop-color": GOLD, "stop-opacity": "0" }));
      defs.appendChild(g1); el.appendChild(defs);

      // cone de luz sobre o momento
      var cone = svg("polygon", { points: "150,0 92,190 208,190", fill: "url(#spot)" });
      el.appendChild(cone); fade(cone, 120);

      // seis indicações
      for (var i = 0; i < 6; i++) {
        var cx = 90 + i * 24, cy = 96, r = 9;
        var pts = [];
        for (var k = 0; k < 10; k++) {
          var a = Math.PI / 2 * 3 + k * Math.PI / 5;
          var rr = (k % 2 === 0) ? r : r * .45;
          pts.push((cx + Math.cos(a) * rr).toFixed(1) + "," + (cy + Math.sin(a) * rr).toFixed(1));
        }
        var star = svg("polygon", { points: pts.join(" "), fill: GOLD });
        el.appendChild(star); fade(star, 200 + i * 110);
      }
      el.appendChild(txt(150, 130, "6 indicações ao GRAMMY", INK, 11.5, "middle", 600));
      el.appendChild(txt(150, 148, "o gatilho da conversa", DIM, 10.5));

      // 490 comentários: nuvem de pontos
      var seed = 7;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      var cloud = svg("g", {});
      for (var j = 0; j < 240; j++) {
        var x = 300 + rnd() * 300, y = 40 + rnd() * 150;
        cloud.appendChild(svg("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: 2.2, fill: RED, opacity: (.16 + rnd() * .3).toFixed(2) }));
      }
      el.appendChild(cloud); fade(cloud, 500);
      el.appendChild(txt(450, 208, "490 comentários públicos no conteúdo de origem", DIM, 10.5));

      // três respostas da marca dentro da nuvem
      var spots = [[372, 78], [468, 122], [552, 70]];
      spots.forEach(function (p, i) {
        var g = svg("g", {});
        g.appendChild(svg("circle", { cx: p[0], cy: p[1], r: 13, fill: "none", stroke: GOLD, "stroke-width": 1.4, opacity: ".7" }));
        g.appendChild(svg("circle", { cx: p[0], cy: p[1], r: 7, fill: GOLD }));
        g.appendChild(txt(p[0], p[1] + 3.4, "0" + (i + 1), CREAM, 9, "middle", 700));
        if (!reduce) {
          var pulse = svg("circle", { cx: p[0], cy: p[1], r: 7, fill: "none", stroke: GOLD, "stroke-width": 1.2 });
          pulse.appendChild(svg("animate", { attributeName: "r", values: "7;22;7", dur: "3s", begin: (i * .6) + "s", repeatCount: "indefinite" }));
          pulse.appendChild(svg("animate", { attributeName: "opacity", values: ".8;0;.8", dur: "3s", begin: (i * .6) + "s", repeatCount: "indefinite" }));
          g.appendChild(pulse);
        }
        el.appendChild(g); fade(g, 900 + i * 220);
      });
      el.appendChild(txt(660, 40, "3 entradas da marca", GOLD, 11, "end", 600));
      el.appendChild(txt(660, 56, "sem verba de mídia", DIM, 10, "end"));
    };
    io.observe(el);
  })();

  /* ---------------------------------------------------------- CASE 3 · Prisma refratando */
  (function () {
    var el = $("#art-c3"); if (!el) return;
    var W = 760, H = 340;
    var SPEC = ["#FF2D6F","#FF5C3A","#FF9A1F","#F2C230","#D8E24A","#5FD66B",
                "#33D2B4","#35A8F0","#4C6BF5","#9B57F0"];

    // um ciclo completo: entra, atravessa, sai
    var CYCLE = 4.2;          // segundos
    var T_HIT  = 0.24;        // fração do ciclo em que a luz atinge o prisma
    var T_OUT  = 0.82;        // fração em que os feixes terminam de sair

    function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

    // pulso de luz percorrendo um caminho, entre duas frações do ciclo
    function pulse(node, from, to, len, width) {
      var P = width * 9;                                  // comprimento do pulso
      node.setAttribute("stroke-dasharray", P + " " + (len + P * 2 + 40));
      if (reduce) { node.setAttribute("stroke-dasharray", "none"); node.setAttribute("opacity", ".7"); return; }
      var a = svg("animate", {
        attributeName: "stroke-dashoffset",
        values: (from > 0 ? P + ";" : "") + P + ";" + (-len) + ";" + (-len),
        keyTimes: (from > 0 ? "0;" : "") + from + ";" + to + ";1",
        dur: CYCLE + "s", repeatCount: "indefinite"
      });
      node.setAttribute("stroke-dashoffset", P);
      node.appendChild(a);
    }
    // acende no instante em que a luz passa
    function flash(node, at, attr, vals) {
      if (reduce) return;
      node.appendChild(svg("animate", {
        attributeName: attr, values: vals,
        keyTimes: "0;" + at + ";" + Math.min(1, at + .12) + ";1",
        dur: CYCLE + "s", repeatCount: "indefinite"
      }));
    }

    el.__draw = function () {
      el.innerHTML = "";
      var defs = svg("defs", {});

      var f = svg("filter", { id: "pz-glow", x: "-70%", y: "-70%", width: "240%", height: "240%" });
      f.appendChild(svg("feGaussianBlur", { stdDeviation: "3.2", result: "b" }));
      var mg = svg("feMerge", {});
      mg.appendChild(svg("feMergeNode", { in: "b" }));
      mg.appendChild(svg("feMergeNode", { in: "SourceGraphic" }));
      f.appendChild(mg); defs.appendChild(f);

      var gF = svg("linearGradient", { id: "pz-face", x1: "0", y1: "0", x2: "1", y2: "1" });
      [["0%","#FFFFFF",".14"],["48%","#E9319C",".24"],["100%","#3352E1",".20"]]
        .forEach(function (s) { gF.appendChild(svg("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] })); });
      defs.appendChild(gF);
      var gS = svg("linearGradient", { id: "pz-side", x1: "0", y1: "0", x2: "1", y2: "0" });
      [["0%","#1B0E28","1"],["100%","#4A2166",".92"]]
        .forEach(function (s) { gS.appendChild(svg("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] })); });
      defs.appendChild(gS);
      // recorte: o que estiver dentro do prisma só aparece dentro dele
      var clip = svg("clipPath", { id: "pz-clip" });
      el.appendChild(defs);

      // ---------- geometria do prisma
      var px = 246, py = 172, s = 82, dx = 28, dy = -18;
      var A = [px, py - s];                     // topo
      var B = [px + s * .87, py + s * .5];      // base direita
      var C = [px - s * .87, py + s * .5];      // base esquerda

      clip.appendChild(svg("polygon", { points: A[0]+","+A[1]+" "+B[0]+","+B[1]+" "+C[0]+","+C[1] }));
      defs.appendChild(clip);

      var E = lerp(A, C, .58);                  // ponto de entrada, na face esquerda
      var inX = 24;

      // ---------- corpo do prisma (atrás da luz interna)
      var side = svg("polygon", {
        points: A[0]+","+A[1]+" "+(A[0]+dx)+","+(A[1]+dy)+" "+(B[0]+dx)+","+(B[1]+dy)+" "+B[0]+","+B[1],
        fill: "url(#pz-side)", stroke: "#6B3486", "stroke-width": 1 });
      el.appendChild(side); fade(side, 200);
      var top = svg("polygon", {
        points: A[0]+","+A[1]+" "+(A[0]+dx)+","+(A[1]+dy)+" "+(C[0]+dx)+","+(C[1]+dy)+" "+C[0]+","+C[1],
        fill: "#2A1240", stroke: "#6B3486", "stroke-width": 1, opacity: ".92" });
      el.appendChild(top); fade(top, 200);
      var face = svg("polygon", {
        points: A[0]+","+A[1]+" "+B[0]+","+B[1]+" "+C[0]+","+C[1],
        fill: "url(#pz-face)", stroke: "#F8F0F8", "stroke-width": 1.8, "stroke-linejoin": "round" });
      el.appendChild(face); fade(face, 260);

      // ---------- 1. feixe branco entrando
      var beamG = svg("g", { filter: "url(#pz-glow)" });
      beamG.appendChild(svg("line", { x1: inX, y1: E[1], x2: E[0], y2: E[1],
        stroke: "#FFFFFF", "stroke-width": 1.6, opacity: ".20", "stroke-linecap": "round" }));
      var white = svg("path", { d: "M" + inX + "," + E[1] + " L" + E[0] + "," + E[1],
        fill: "none", stroke: "#FFFFFF", "stroke-width": 3.4, "stroke-linecap": "round" });
      beamG.appendChild(white);
      el.appendChild(beamG); fade(beamG, 100);
      pulse(white, 0, T_HIT, Math.abs(E[0] - inX), 3.4);

      var lin = txt(inX, E[1] - 16, "luz branca: o convite", "#C9B8D2", 10.5, "start", 500);
      el.appendChild(lin); fade(lin, 180);

      // ---------- 2. travessia interna + 3. saída, no mesmo caminho
      var tx0 = 578;
      var outer = svg("g", {});
      el.appendChild(outer);
      var inner = svg("g", { "clip-path": "url(#pz-clip)" });   // trecho interno recortado pelo prisma
      el.appendChild(inner);

      var rays = [];
      for (var i = 0; i < 10; i++) {
        var ty = 44 + i * 26;
        var col = SPEC[i];
        // ponto de saída na face direita: cada cor sai um pouco diferente
        var X = lerp(A, B, .42 + i * .026);
        // caminho completo: entrada → interior → face de saída → convidado
        var d = "M" + E[0].toFixed(1) + "," + E[1].toFixed(1) +
                " L" + X[0].toFixed(1) + "," + X[1].toFixed(1) +
                " Q" + (tx0 - 200) + "," + ((X[1] + ty) / 2 + (ty - X[1]) * .2) +
                " " + (tx0 - 28) + "," + ty;

        // trilho fraco só depois do prisma
        var trail = svg("path", { d: d, fill: "none", stroke: col, "stroke-width": 1.3, opacity: ".20" });
        outer.appendChild(trail);

        var ray = svg("path", { d: d, fill: "none", stroke: col, "stroke-width": 3,
          "stroke-linecap": "round", filter: "url(#pz-glow)" });
        outer.appendChild(ray);
        rays.push([ray, col, ty, X]);

        // o mesmo trecho, mais claro, aparecendo dentro do prisma
        var innerRay = svg("path", { d: d, fill: "none", stroke: "#FFFFFF", "stroke-width": 4,
          "stroke-linecap": "round", opacity: ".85", filter: "url(#pz-glow)" });
        inner.appendChild(innerRay);

        var L = ray.getTotalLength ? ray.getTotalLength() : 620;
        pulse(ray, T_HIT, T_OUT, L, 3);
        pulse(innerRay, T_HIT, T_OUT, L, 4);

        // convidado acende quando o feixe chega
        var dot = svg("circle", { cx: tx0 - 18, cy: ty, r: 7, fill: "#1B0E28", stroke: col, "stroke-width": 2 });
        var halo = svg("circle", { cx: tx0 - 18, cy: ty, r: 7, fill: "none", stroke: col,
          "stroke-width": 1.5, opacity: "0", filter: "url(#pz-glow)" });
        var at = T_OUT - .06 + i * .004;
        flash(halo, at, "r", "7;7;18;18");
        flash(halo, at, "opacity", "0;.9;0;0");
        flash(dot, at, "r", "7;7;9.5;7");
        outer.appendChild(halo); outer.appendChild(dot);
        outer.appendChild(txt(tx0 - 2, ty + 4, "convidado " + (i + 1 < 10 ? "0" : "") + (i + 1), "#D8CBDC", 10.5, "start"));
      }
      fade(outer, 420); fade(inner, 420);

      // ---------- clarão no ponto de entrada, no instante do impacto
      var hot = svg("circle", { cx: E[0], cy: E[1], r: 3, fill: "#FFFFFF", opacity: ".2", filter: "url(#pz-glow)" });
      flash(hot, T_HIT, "r", "3;3;9;3");
      flash(hot, T_HIT, "opacity", ".2;.2;1;.2");
      el.appendChild(hot); fade(hot, 300);

      var cap = svg("g", {});
      cap.appendChild(txt(px, py + s + 46, "um convite entra, dez relações saem", "#F8F0F8", 11.5, "middle", 600));
      cap.appendChild(txt(px, py + s + 63, "cada faixa é um jurado ou palestrante conduzido", "#A794B0", 10.5));
      el.appendChild(cap); fade(cap, 1200);
    };
    io.observe(el);
  })();

  /* ---------------------------------------------------------- diagrama da 4ª plataforma */
  (function () {
    var el = $("#art-np"); if (!el) return;
    var AMB = "#B87708", INK = "#101319", DIM = "#6A7182", RULE = "#C8C3B7";
    var W = 460, H = 250;

    el.__draw = function () {
      el.innerHTML = "";
      var steps = [
        { y: 26, t: t("np.n1"), s: t("np.n1s") },
        { y: 100, t: t("np.n2"), s: t("np.n2s") },
        { y: 174, t: t("np.n3"), s: t("np.n3s") }
      ];
      steps.forEach(function (st, i) {
        var g = svg("g", {});
        g.appendChild(svg("rect", { x: 6, y: st.y, width: W - 12, height: 54, rx: 5, fill: i === 1 ? "rgba(184,119,8,.10)" : "transparent", stroke: i === 1 ? AMB : RULE, "stroke-width": 1.2 }));
        var n = txt(24, st.y + 24, "0" + (i + 1), i === 1 ? AMB : DIM, 11, "start", 600);
        g.appendChild(n);
        var a = txt(52, st.y + 24, st.t, INK, 13.5, "start", 600, "IBM Plex Sans, sans-serif");
        g.appendChild(a);
        var b = txt(52, st.y + 41, st.s, DIM, 11.5, "start", 400, "IBM Plex Sans, sans-serif");
        g.appendChild(b);
        el.appendChild(g);
        fade(g, 120 + i * 220);

        if (i < 2) {
          var ar = svg("g", {});
          ar.appendChild(svg("line", { x1: W / 2, y1: st.y + 54, x2: W / 2, y2: st.y + 72, stroke: AMB, "stroke-width": 1.6 }));
          ar.appendChild(svg("polygon", { points: (W / 2 - 4) + "," + (st.y + 68) + " " + (W / 2 + 4) + "," + (st.y + 68) + " " + (W / 2) + "," + (st.y + 75), fill: AMB }));
          el.appendChild(ar);
          fade(ar, 240 + i * 220);
        }
      });
    };
    io.observe(el);
  })();

  /* ---------------------------------------------------------- ANT · abas */
  $$(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$(".tab").forEach(function (b) { b.classList.remove("on"); b.setAttribute("aria-selected", "false"); });
      tab.classList.add("on"); tab.setAttribute("aria-selected", "true");
      $$(".panel").forEach(function (p) { p.classList.remove("on"); });
      var p = $("#panel-" + tab.getAttribute("data-panel"));
      if (p) p.classList.add("on");
      if (window.__redraw) window.__redraw();
    });
  });

  /* ---------------------------------------------------------- ALIGN */
  var alignRender = function () {};
  (function () {
    var sl = $("#alignSlider"); if (!sl) return;
    var out = $("#alignDays"), val = $("#alignRisk"), badge = $("#alignBadge"), g = $("#gauge");
    var chain = $$("#chain .node");

    function col(s) { return s < 35 ? "#43D49E" : s < 55 ? "#F0B23C" : s < 75 ? "#FF7C5C" : "#FF4A28"; }
    function key(s) { return s < 35 ? "al.low" : s < 55 ? "al.med" : s < 75 ? "al.high" : "al.crit"; }

    alignRender = function () {
      var d = parseInt(sl.value, 10);
      var score = Math.round(Math.min(100, d / 15 * 100) * .4 + 55 * .35 + Math.min(100, 30 + d * 4.6) * .25);
      var c = col(score);
      out.textContent = d; val.textContent = score; val.style.color = c;
      badge.textContent = t(key(score)); badge.style.color = c;

      g.innerHTML = "";
      g.appendChild(svg("path", { d: "M16,64 A49,49 0 0 1 114,64", fill: "none", stroke: "#212836", "stroke-width": 9, "stroke-linecap": "round" }));
      var a = Math.PI * (1 - score / 100);
      var ex = 65 + 49 * Math.cos(a), ey = 64 - 49 * Math.sin(a);
      g.appendChild(svg("path", {
        d: "M16,64 A49,49 0 " + (score > 50 ? 1 : 0) + " 1 " + ex.toFixed(1) + "," + ey.toFixed(1),
        fill: "none", stroke: c, "stroke-width": 9, "stroke-linecap": "round"
      }));

      chain.forEach(function (n) { n.classList.remove("hit", "warn"); });
      if (d > 0 && d < 5) chain[2].classList.add("warn");
      else if (d >= 5 && d < 10) { chain[2].classList.add("hit"); chain[3].classList.add("warn"); }
      else if (d >= 10) { chain[2].classList.add("hit"); chain[3].classList.add("hit"); chain[4].classList.add("hit"); }
    };
    sl.addEventListener("input", alignRender);
  })();

  /* ---------------------------------------------------------- NEST */
  var nestRender = function () {};
  (function () {
    var el = $("#chart-nest"); if (!el) return;
    var seg = $("#nestSeg"), rootBox = $("#nestRoot"), weekOut = $("#nestWeek");
    var W = 540, H = 210, L = 34, R = 14, T = 16, B = 30;
    var series = {
      all: [22, 25, 31, 29, 44, 38, 62, 54, 41, 33, 28, 24],
      a: [18, 20, 26, 24, 39, 35, 58, 49, 36, 29, 24, 20],
      b: [26, 30, 36, 34, 49, 42, 66, 59, 46, 37, 32, 28]
    };
    var camps = [[3, 5], [8, 9]];
    var cur = "all", week = 6;
    var roots = [[52,21,16,11],[44,26,18,12],[38,30,20,12],[41,25,22,12],[61,18,13,8],[55,22,14,9],
                 [68,15,11,6],[59,20,13,8],[46,24,19,11],[40,27,21,12],[36,29,23,12],[33,31,24,12]];

    function drawRoots() {
      var v = roots[week], keys = ["ne.c1", "ne.c2", "ne.c3", "ne.c4"];
      rootBox.innerHTML = "";
      keys.forEach(function (k, i) {
        var row = document.createElement("div"); row.className = "rrow";
        row.innerHTML = '<div class="rtop"><b>' + t(k) + '</b><span class="num">' + v[i] + '%</span></div><div class="rbar"><i></i></div>';
        rootBox.appendChild(row);
        var bar = row.querySelector("i");
        setTimeout(function () { bar.style.width = v[i] + "%"; }, 50 + i * 80);
      });
      weekOut.textContent = week + 1;
    }

    function draw() {
      var data = series[cur];
      el.innerHTML = "";
      var x = function (i) { return L + i * ((W - L - R) / (data.length - 1)); };
      var y = function (v) { return T + (1 - v / 80) * (H - T - B); };

      camps.forEach(function (c) {
        el.appendChild(svg("rect", { x: x(c[0]), y: T, width: x(c[1]) - x(c[0]), height: H - T - B, fill: "#8398FF", opacity: ".12", rx: 2 }));
      });
      [0, 40, 80].forEach(function (gv) {
        el.appendChild(svg("line", { x1: L, x2: W - R, y1: y(gv), y2: y(gv), stroke: "#2D3543", "stroke-width": 1 }));
        el.appendChild(txt(L - 7, y(gv) + 4, gv, "#9BA3B2", 9.5, "end"));
      });

      var pts = data.map(function (v, i) { return [x(i), y(v)]; });
      el.appendChild(svg("path", { d: smooth(pts) + " L" + x(data.length - 1) + "," + y(0) + " L" + x(0) + "," + y(0) + " Z", fill: "#FF7C5C", opacity: ".10" }));
      var line = svg("path", { d: smooth(pts), fill: "none", stroke: "#FF7C5C", "stroke-width": 2.4, "stroke-linecap": "round" });
      el.appendChild(line); stroke(line, 1000);

      pts.forEach(function (p, i) {
        var dot = svg("circle", { cx: p[0], cy: p[1], r: i === week ? 6 : 4, fill: i === week ? "#FF7C5C" : "#101319", stroke: "#FF7C5C", "stroke-width": 1.8, style: "cursor:pointer" });
        var hit = svg("circle", { cx: p[0], cy: p[1], r: 15, fill: "transparent", style: "cursor:pointer" });
        function pick() { week = i; draw(); drawRoots(); }
        dot.addEventListener("click", pick); hit.addEventListener("click", pick);
        el.appendChild(dot); el.appendChild(hit);
      });
      el.appendChild(txt(x(week), H - 8, "S" + (week + 1), "#FF7C5C", 10, "middle", 500));
    }

    $$("button", seg).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", seg).forEach(function (o) { o.classList.remove("on"); });
        b.classList.add("on"); cur = b.getAttribute("data-line"); draw();
      });
    });

    nestRender = function () { draw(); drawRoots(); };
  })();

  /* ---------------------------------------------------------- TRUST */
  var trustRender = function () {};
  (function () {
    var list = $("#trustList"); if (!list) return;
    var out = $("#trustAcc"), ring = $("#ring"), reset = $("#trustReset");
    var B_T = 11, B_H = 8, total = B_T, hits = B_H;

    function drawRing() {
      var pct = Math.round(hits / total * 100);
      out.textContent = pct + "%";
      ring.innerHTML = "";
      var r = 38, c = 48, C = 2 * Math.PI * r;
      ring.appendChild(svg("circle", { cx: c, cy: c, r: r, fill: "none", stroke: "#212836", "stroke-width": 8 }));
      var fg = svg("circle", {
        cx: c, cy: c, r: r, fill: "none",
        stroke: pct >= 70 ? "#43D49E" : pct >= 50 ? "#F0B23C" : "#FF7C5C",
        "stroke-width": 8, "stroke-linecap": "round",
        "stroke-dasharray": C, "stroke-dashoffset": C * (1 - pct / 100),
        transform: "rotate(-90 " + c + " " + c + ")"
      });
      fg.style.transition = "stroke-dashoffset .7s cubic-bezier(.22,.61,.36,1)";
      ring.appendChild(fg);
    }

    function bind(btn) {
      btn.addEventListener("click", function () {
        var card = btn.parentNode.parentNode;
        total += 1; hits += parseInt(card.getAttribute("data-hit"), 10);
        var span = document.createElement("span");
        span.className = "done"; span.textContent = t("tr.done");
        btn.parentNode.replaceChild(span, btn);
        drawRing();
      });
    }
    $$("[data-impl]", list).forEach(bind);

    if (reset) reset.addEventListener("click", function () {
      total = B_T; hits = B_H;
      $$(".act", list).forEach(function (a) {
        a.innerHTML = "";
        var b = document.createElement("button");
        b.className = "mini"; b.setAttribute("data-impl", ""); b.textContent = t("tr.impl");
        a.appendChild(b); bind(b);
      });
      drawRing();
    });

    trustRender = drawRing;
  })();

  window.__redraw = function () { alignRender(); nestRender(); trustRender(); };

  /* ---------------------------------------------------------- linha do hero */
  (function () {
    var line = $("#heroLine"); if (!line) return;
    var v = [76, 72, 79, 64, 57, 60, 43, 32, 26, 21, 18, 15];
    line.setAttribute("points", v.map(function (n, i) {
      return (70 + i * (860 / (v.length - 1))) + "," + (130 + n / 100 * 350);
    }).join(" "));
    line.style.opacity = ".4";
    if (!reduce) { line.style.strokeDasharray = 1300; line.style.strokeDashoffset = 1300;
      setTimeout(function () { line.style.transition = "stroke-dashoffset 2.2s cubic-bezier(.22,.61,.36,1)"; line.style.strokeDashoffset = 0; }, 400); }
  })();

  /* ---------------------------------------------------------- boot */
  applyLang();
  window.__redraw();
  document.body.classList.add("ready");
  onScroll();
})();
