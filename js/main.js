/* Software and Computer Museum — поведінка головної сторінки:
   піксельні іконки, мобільне меню, перемикач мови, форма запису. */
(function () {
  'use strict';

  /* ---------- Піксельні іконки: сітка 12×12, колір тексту ---------- */
  var ICONS = {
    computer: ['............', '.##########.', '.#........#.', '.#.######.#.', '.#.#....#.#.', '.#.#....#.#.', '.#.######.#.', '.#........#.', '.##########.', '....####....', '..########..', '............'],
    floppy: ['.#########..', '.#..####.##.', '.#..####..#.', '.#..##.#..#.', '.#..####..#.', '.#........#.', '.#.######.#.', '.#.#....#.#.', '.#.#....#.#.', '.#.#....#.#.', '.##########.', '............'],
    clock: ['....####....', '..##....##..', '.#........#.', '.#....#...#.', '#.....#....#', '#.....#....#', '#.....####.#', '#..........#', '.#........#.', '.#........#.', '..##....##..', '....####....'],
    people: ['...##...##..', '..####.####.', '..####.####.', '...##...##..', '............', '.####.####..', '######.####.', '######.####.', '######.####.', '######.####.', '............', '............'],
    tag: ['......######', '.....#.....#', '....#..##..#', '...#...##..#', '..#........#', '.#........#.', '#........#..', '.#......#...', '..#....#....', '...#..#.....', '....##......', '............'],
    calendar: ['..#.....#...', '############', '#..........#', '############', '#..........#', '#.##.##.##.#', '#..........#', '#.##.##.##.#', '#..........#', '#.##.##....#', '############', '............'],
    phone: ['.###........', '#####.......', '####........', '###.........', '###.........', '.###........', '..###.......', '...####.###.', '....#######.', '.....######.', '......####..', '............'],
    pin: ['....####....', '...######...', '..###..###..', '..##....##..', '..###..###..', '...######...', '...######...', '....####....', '....####....', '.....##.....', '.....##.....', '............'],
    arrow: ['............', '............', '......##....', '.......##...', '........##..', '###########.', '###########.', '........##..', '.......##...', '......##....', '............', '............'],
    check: ['............', '...........#', '..........##', '.........##.', '#.......##..', '##.....##...', '.##...##....', '..##.##.....', '...###......', '....#.......', '............', '............'],
    alert: ['.##########.', '#..........#', '#....##....#', '#....##....#', '#....##....#', '#....##....#', '#....##....#', '#..........#', '#....##....#', '#....##....#', '#..........#', '.##########.'],
    menu: ['............', '############', '############', '............', '............', '############', '############', '............', '............', '############', '############', '............'],
    close: ['............', '.##......##.', '..##....##..', '...##..##...', '....####....', '.....##.....', '....####....', '...##..##...', '..##....##..', '.##......##.', '............', '............'],
    prompt: ['............', '.#..........', '..#.........', '...#........', '....#.......', '...#........', '..#.........', '.#..........', '............', '......######', '............', '............']
  };
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function iconPath(name) {
    var rows = ICONS[name] || ICONS.computer, d = '';
    rows.forEach(function (row, y) {
      var x = 0;
      while (x < row.length) {
        if (row[x] === '#') {
          var s = x;
          while (x < row.length && row[x] === '#') x++;
          d += 'M' + s + ' ' + y + 'h' + (x - s) + 'v1h-' + (x - s) + 'z';
        } else x++;
      }
    });
    return d;
  }
  function drawIcon(svg, name) {
    if (name) svg.setAttribute('data-icon', name);
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', iconPath(svg.getAttribute('data-icon')));
    svg.textContent = '';
    svg.appendChild(path);
  }
  document.querySelectorAll('svg[data-icon]').forEach(function (svg) { drawIcon(svg); });

  /* ---------- Мобільне меню ---------- */
  var menuBtn = document.querySelector('.scm-menu-btn');
  var mobileNav = document.getElementById('scm-mobile-nav');
  function setMenu(open) {
    mobileNav.setAttribute('data-open', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawIcon(menuBtn.querySelector('svg'), open ? 'close' : 'menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(mobileNav.getAttribute('data-open') !== 'true'); });
  mobileNav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  /* ---------- Експонати: «Показати більше» ----------
     Спершу видно перші N карток (data-show-first), решту відкриває кнопка. */
  var exhibitsGrid = document.getElementById('exhibits-grid');
  var moreBtn = document.getElementById('exhibits-more');
  if (exhibitsGrid && moreBtn) {
    var showFirst = parseInt(exhibitsGrid.getAttribute('data-show-first'), 10) || 3;
    var extra = Array.prototype.slice.call(exhibitsGrid.children, showFirst);
    if (extra.length) {
      extra.forEach(function (card) { card.hidden = true; });
      moreBtn.hidden = false;
      moreBtn.addEventListener('click', function () {
        extra.forEach(function (card) { card.hidden = false; });
        moreBtn.setAttribute('aria-expanded', 'true');
        moreBtn.hidden = true;
        /* Фокус — на першу відкриту картку, щоб клавіатура й скрінрідер не загубилися. */
        extra[0].setAttribute('tabindex', '-1');
        extra[0].focus();
      });
    }
  }

  /* ---------- Мова (UA / EN) ----------
     Український текст лежить у розмітці; тут — лише англійський переклад
     і рядки, які форма показує динамічно. */
  var EN = {
    tours: 'Tours', exhibits: 'Exhibits', courses: 'Courses', articles: 'Articles', contacts: 'Contacts', book: 'Book', menu: 'Menu',
    navLabel: 'Main', language: 'Site language',
    heroUpdate: 'The site has been updated automatically',
    slogan: 'Touch the computers that started the digital world — and learn to use today’s ones with confidence.',
    heroGo: 'Where shall we start?',
    toursIntro: 'We will walk you through the museum halls and show how computers have changed. Great for families and school classes alike.',
    exhibitsCount: '6 exhibits from the 80s and 90s — from a 5.25″ floppy disk to a modem',
    exhibitsIntro: 'Machines from the 80s and 90s that you can see up close. Some exhibits still work — ask your guide.',
    showMore: 'Show more',
    coursesIntro: 'Small groups, a calm pace and no jargon. We explain things so that they work the first time.',
    bookingTitle: 'Booking and contacts',
    bookingIntro: 'Leave your name and phone number — we will call you, find a convenient day and answer your questions.',
    tour: 'Tour', course: 'Course', duration: 'Duration', sessions: 'Sessions', audience: 'Who it’s for', price: 'Price', placeholder: 'Placeholder',
    winBooking: 'BOOKING.EXE', winContacts: 'CONTACTS.TXT',
    formNote: 'It takes less than a minute. We will call you back to agree on the date and time.',
    direction: 'Choose', directionPick: 'Pick a tour or a course', prefilled: 'Filled in from the card — you can change it.',
    name: 'Your name', namePh: 'e.g. Olena', phone: 'Phone', phoneHint: 'Format: +380 XX XXX XX XX',
    sendError: 'We could not send your request. Please try again or call us.',
    successTitle: 'Thank you!', success: 'We will call you shortly.', again: 'Send another request',
    address: 'Address', hours: 'Opening hours', route: 'Get directions'
  };
  var DYNAMIC = {
    ua: {
      send: 'Надіслати', sending: 'Надсилаємо…', retry: 'Надіслати ще раз',
      errDirection: 'Оберіть, будь ласка, екскурсію або курс.', errName: "Вкажіть, будь ласка, Ваше ім'я.", errPhone: 'Перевірте номер: потрібен формат +380 і 9 цифр.'
    },
    en: {
      send: 'Send', sending: 'Sending…', retry: 'Try again',
      errDirection: 'Please choose a tour or a course.', errName: 'Please enter your name.', errPhone: 'Please check the number: +380 followed by 9 digits.'
    }
  };
  var lang = 'ua';
  /* Форма є лише на головній; на інших сторінках перемальовувати нічого. */
  var renderForm = function () {};
  var I18N_ATTRS = [['data-i18n', null], ['data-i18n-aria', 'aria-label'], ['data-i18n-label', 'label'], ['data-i18n-placeholder', 'placeholder']];

  function setLang(next) {
    lang = next === 'en' ? 'en' : 'ua';
    I18N_ATTRS.forEach(function (pair) {
      var marker = pair[0], attr = pair[1], store = marker + '-ua';
      document.querySelectorAll('[' + marker + ']').forEach(function (el) {
        if (!el.hasAttribute(store)) el.setAttribute(store, attr ? el.getAttribute(attr) : el.textContent);
        var value = lang === 'en' ? EN[el.getAttribute(marker)] : el.getAttribute(store);
        if (value == null) return;
        if (attr) el.setAttribute(attr, value); else el.textContent = value;
      });
    });
    document.querySelectorAll('.scm-lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    renderForm();
  }
  document.querySelectorAll('.scm-lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---------- Форма запису ---------- */
  var form = document.getElementById('booking-form');
  if (form) initBookingForm();

  function initBookingForm() {
  var success = document.getElementById('booking-success');
  var sendError = document.getElementById('booking-send-error');
  var submitBtn = document.getElementById('booking-submit');
  var fields = { direction: form.elements.direction, name: form.elements.name, phone: form.elements.phone };
  var directionHint = document.getElementById('f-direction-hint');
  var state = { errors: {}, busy: false, failed: false, fromCard: false };

  function normPhone(v) { return (v || '').replace(/[\s()\-]/g, ''); }

  /* TODO: під'єднати справжнє надсилання заявки (сервер або сервіс форм).
     Зараз це заглушка з макета: заявка нікуди не йде. Має повертати Promise. */
  function sendBooking(payload) {
    return new Promise(function (resolve) { setTimeout(resolve, 900); });
  }

  function validate() {
    var err = {};
    if (!fields.direction.value) err.direction = 'errDirection';
    if (fields.name.value.trim().length < 2) err.name = 'errName';
    if (!/^\+380\d{9}$/.test(normPhone(fields.phone.value))) err.phone = 'errPhone';
    return err;
  }

  renderForm = function () {
    var L = DYNAMIC[lang];
    var prefilled = state.fromCard && !!fields.direction.value;
    fields.direction.classList.toggle('scm-prefilled', prefilled);
    directionHint.hidden = !prefilled;

    Object.keys(fields).forEach(function (key) {
      var input = fields[key], wrap = input.closest('.scm-field'), errId = input.id + '-err';
      var old = document.getElementById(errId), msg = state.errors[key];
      if (old) old.remove();
      wrap.classList.toggle('scm-field-invalid', !!msg);
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        var box = document.createElement('span');
        box.className = 'scm-field-error'; box.id = errId; box.setAttribute('role', 'alert');
        var ico = document.createElementNS(SVG_NS, 'svg');
        ico.setAttribute('class', 'scm-icon scm-icon-s'); ico.setAttribute('viewBox', '0 0 12 12'); ico.setAttribute('aria-hidden', 'true');
        drawIcon(ico, 'alert');
        var text = document.createElement('span');
        text.textContent = L[msg];
        box.appendChild(ico); box.appendChild(text);
        wrap.appendChild(box);
      } else input.removeAttribute('aria-invalid');
      var hint = document.getElementById(input.id + '-hint');
      var ids = [hint && !hint.hidden && hint.id, msg && errId].filter(Boolean);
      if (ids.length) input.setAttribute('aria-describedby', ids.join(' ')); else input.removeAttribute('aria-describedby');
    });

    fields.direction.disabled = state.busy;
    fields.name.readOnly = state.busy;
    fields.phone.readOnly = state.busy;
    sendError.hidden = !state.failed;

    submitBtn.disabled = state.busy;
    if (state.busy) submitBtn.setAttribute('aria-busy', 'true'); else submitBtn.removeAttribute('aria-busy');
    var label = submitBtn.querySelector('span'), icon = submitBtn.querySelector('svg');
    label.textContent = state.busy ? L.sending : state.failed ? L.retry : L.send;
    drawIcon(icon, state.busy ? 'clock' : 'arrow');
    submitBtn.insertBefore(icon, state.busy ? label : null); /* годинник — перед текстом, стрілка — після */
  };

  fields.direction.addEventListener('change', function () { state.fromCard = false; renderForm(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (state.busy) return;
    state.failed = false;
    state.errors = validate();
    renderForm();
    if (Object.keys(state.errors).length) {
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    var payload = { direction: fields.direction.value, name: fields.name.value.trim(), phone: normPhone(fields.phone.value) };
    state.busy = true;
    renderForm();
    sendBooking(payload).then(function () {
      state.busy = false;
      renderForm();
      form.hidden = true;
      success.hidden = false;
    }, function () {
      state.busy = false;
      state.failed = true;
      renderForm();
    });
  });

  document.getElementById('booking-again').addEventListener('click', function () {
    form.reset();
    state.errors = {}; state.failed = false; state.fromCard = false;
    success.hidden = true;
    form.hidden = false;
    renderForm();
  });

  /* Кнопка «Записатися» в картці підставляє напрям у форму й прокручує до неї. */
  document.querySelectorAll('[data-book]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      success.hidden = true;
      form.hidden = false;
      fields.direction.value = btn.getAttribute('data-book');
      state.fromCard = true;
      delete state.errors.direction;
      renderForm();
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('booking').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });
  }
})();
