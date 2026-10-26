(function () {
  'use strict';

  function calculate(area, coverage, waste) {
    area = Number(area); coverage = Number(coverage);
    if (!Number.isFinite(area) || area < 0.01 || area > 100000 || !Number.isFinite(coverage) || coverage <= 0) return null;
    const netArea = Number(area.toFixed(2));
    const targetArea = waste ? Number((area * 1.1).toFixed(2)) : netArea;
    const wasteArea = waste ? Number((targetArea - netArea).toFixed(2)) : 0;
    const boxes = Math.ceil(area * (waste ? 1.1 : 1) / coverage - 1e-10);
    const covered = boxes * coverage;
    const leftover = Number(Math.max(0, covered - targetArea).toFixed(2));
    const planks = boxes * 10;
    return {
      boxes,
      covered,
      netArea,
      targetArea,
      wasteArea,
      leftover,
      planks
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { calculate };
  if (typeof document === 'undefined' || window.DecokasaSPC) return;

  const initialized = new WeakSet();
  const number = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const integer = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 });

  function init(scope) {
    const pages = [...scope.querySelectorAll('[data-spc-page]')];
    if (scope.matches?.('[data-spc-page]')) pages.unshift(scope);

    pages.forEach(page => {
      if (initialized.has(page)) return;
      initialized.add(page);

      const swatches = [...page.querySelectorAll('[data-color]')];
      const status = page.querySelector('[data-color-status]');
      const form = page.querySelector('[data-spc-calculator]');
      if (!form) return;

      const directArea = form.querySelector('[name="area"]');
      const wasteCheckbox = form.querySelector('[name="waste"]');
      const errorEl = form.querySelector('[data-calc-error]');
      const resultCard = form.querySelector('[data-calc-result]');
      const contactBtn = form.querySelector('[data-calc-contact]');

      // Result breakdown fields
      const boxesEl = form.querySelector('[data-boxes]');
      const boxesStatusEl = form.querySelector('[data-boxes-status]');
      const netAreaEl = form.querySelector('[data-net-area]');
      const targetAreaEl = form.querySelector('[data-target-area]');
      const coveredEl = form.querySelector('[data-covered]');
      const leftoverEl = form.querySelector('[data-leftover]');
      const planksTextEl = form.querySelector('[data-planks-text]');

      // Mode tabs & panels
      const modeTabs = [...form.querySelectorAll('[data-calc-mode]')];
      const panels = [...form.querySelectorAll('[data-panel]')];
      const knownMetersToggle = form.querySelector('[data-known-meters-toggle]');
      const roomsContainer = form.querySelector('[data-rooms-container]');
      const addRoomBtn = form.querySelector('[data-add-room]');
      const roomsCountEl = form.querySelector('[data-rooms-count]');
      const schematicStage = form.querySelector('[data-schematic-stage]');
      const schematicLegend = form.querySelector('[data-schematic-legend]');
      const quickChips = [...form.querySelectorAll('[data-quick-area]')];

      let currentMode = 'dimensions';
      let selectedColorIdx = 0;
      let lastCalculation = null;

      // Catalog link update
      const contactUpdate = () => {
        if (!contactBtn) return;
        const catalogTarget = page.querySelector('.spc-colors')?.id ? `#${page.querySelector('.spc-colors').id}` : '#spc-colores';
        const catalogUrl = page.dataset.catalogUrl || catalogTarget;
        contactBtn.setAttribute('href', catalogUrl);
      };

      const chooseColor = index => {
        selectedColorIdx = (index + swatches.length) % swatches.length;
        swatches.forEach((swatch, i) => swatch.setAttribute('aria-pressed', String(i === selectedColorIdx)));
        if (status) status.textContent = `${swatches[selectedColorIdx].dataset.color} · Color de referencia`;
        contactUpdate();
      };

      swatches.forEach((swatch, i) => swatch.addEventListener('click', () => chooseColor(i)));
      page.querySelectorAll('[data-color-step]').forEach(button => {
        button.hidden = false;
        button.addEventListener('click', () => chooseColor(selectedColorIdx + Number(button.dataset.colorStep)));
      });

      // Mode switching
      function setMode(mode) {
        currentMode = mode;
        modeTabs.forEach(tab => {
          const isActive = tab.dataset.calcMode === mode;
          tab.classList.toggle('is-active', isActive);
          tab.setAttribute('aria-selected', String(isActive));
        });
        if (knownMetersToggle) {
          knownMetersToggle.checked = (mode === 'direct');
        }
        panels.forEach(panel => {
          panel.hidden = panel.dataset.panel !== mode;
        });
        if (mode === 'direct' && directArea) {
          setTimeout(() => directArea.focus(), 60);
        }
        updateRoomsUI();
        recalculate();
      }

      modeTabs.forEach(tab => {
        tab.addEventListener('click', () => setMode(tab.dataset.calcMode));
      });

      if (knownMetersToggle) {
        knownMetersToggle.addEventListener('change', () => {
          const isChecked = typeof knownMetersToggle.checked === 'boolean'
            ? knownMetersToggle.checked
            : (knownMetersToggle.checked !== undefined ? !!knownMetersToggle.checked : knownMetersToggle.hasAttribute('checked'));
          setMode(isChecked ? 'direct' : 'dimensions');
        });
      }

      const isWasteChecked = () => {
        if (!wasteCheckbox) return true;
        if (typeof wasteCheckbox.checked === 'boolean') return wasteCheckbox.checked;
        return wasteCheckbox.checked !== undefined ? !!wasteCheckbox.checked : wasteCheckbox.hasAttribute('checked');
      };

      // Quick chips in direct mode
      quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
          setMode('direct');
          if (directArea) {
            directArea.value = chip.dataset.quickArea;
            directArea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });

      // Room manager
      function getRoomsData() {
        if (!roomsContainer) return [];
        const cards = [...roomsContainer.querySelectorAll('[data-room-item]')];
        return cards.map(card => {
          const nameInput = card.querySelector('[data-room-name]');
          const lenInput = card.querySelector('[data-dim="length"]');
          const widInput = card.querySelector('[data-dim="width"]');
          const length = parseFloat(lenInput?.value) || 0;
          const width = parseFloat(widInput?.value) || 0;
          const area = Math.max(0, length * width);
          return {
            element: card,
            name: nameInput?.value.trim() || '',
            length,
            width,
            area
          };
        });
      }

      function updateRoomsUI() {
        const rooms = getRoomsData();
        const count = rooms.length;
        if (roomsCountEl) {
          roomsCountEl.textContent = `${count} ${count === 1 ? 'ambiente' : 'ambientes'}`;
        }
        rooms.forEach((r, idx) => {
          const subtotalEl = r.element.querySelector('[data-room-subtotal]');
          if (subtotalEl) {
            subtotalEl.textContent = `${number.format(r.area)} m²`;
          }
          const removeBtn = r.element.querySelector('[data-room-remove]');
          if (removeBtn) {
            removeBtn.hidden = count <= 1;
          }
        });
        renderSchematic(rooms);
      }

      function renderSchematic(rooms) {
        if (!schematicStage) return;

        if (currentMode === 'direct') {
          const directVal = parseFloat(directArea?.value) || 0;
          if (directVal <= 0) {
            schematicStage.innerHTML = `
              <div class="spc-schematic-empty">
                <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="28" height="28" rx="3" stroke-dasharray="3 3"/><path d="M6 14h28M14 6v28"/></svg>
                <span>Ingresa el total en m² para generar tu plano visual</span>
              </div>
            `;
            if (schematicLegend) schematicLegend.textContent = 'En espera de m²';
            return;
          }
          if (schematicLegend) schematicLegend.textContent = `Área directa · ${number.format(directVal)} m²`;
          const approxSide = Math.sqrt(directVal);
          const w = 260;
          const h = 100;
          const x = (420 - w) / 2;
          const y = (160 - h) / 2;
          schematicStage.innerHTML = `
            <svg viewBox="0 0 420 160" class="spc-schematic-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="spc-grid-dir" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#spc-grid-dir)" rx="8" />
              <g class="spc-svg-room spc-svg-room--animate" style="--room-delay:0s;" transform="translate(${x}, ${y})">
                <rect width="${w}" height="${h}" rx="8" class="spc-chain-fill" />
                <rect width="${w}" height="${h}" rx="8" pathLength="100" class="spc-chain-outline" />
                <line x1="6" y1="6" x2="${w - 6}" y2="${h - 6}" class="spc-chain-guide" />
                <text x="${w / 2}" y="${h / 2 - 14}" text-anchor="middle" class="spc-svg-name spc-chain-name">Área Total Calculada</text>
                <text x="${w / 2}" y="${h / 2 + 3}" text-anchor="middle" class="spc-svg-dim spc-chain-dim">~${number.format(approxSide)}m × ~${number.format(approxSide)}m proporcional</text>
                <text x="${w / 2}" y="${h / 2 + 20}" text-anchor="middle" class="spc-svg-area spc-chain-area">${number.format(directVal)} m²</text>
              </g>
            </svg>
          `;
          return;
        }

        const valid = rooms.filter(r => r.length > 0 && r.width > 0);
        if (valid.length === 0) {
          schematicStage.innerHTML = `
            <div class="spc-schematic-empty">
              <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="28" height="28" rx="3" stroke-dasharray="3 3"/><path d="M6 14h28M14 6v28"/></svg>
              <span>Ingresa largo y ancho para visualizar tu plano a escala</span>
            </div>
          `;
          if (schematicLegend) schematicLegend.textContent = 'En espera de medidas';
          return;
        }

        // Calculate layout
        const totalArea = valid.reduce((acc, r) => acc + r.area, 0);
        if (schematicLegend) schematicLegend.textContent = `${valid.length} ${valid.length === 1 ? 'zona' : 'zonas'} · ${number.format(totalArea)} m² netos`;

        // Generate stylized SVG with ample breathing room
        const svgW = 420;
        const svgH = 160;
        const padding = 16;
        const gap = 10;
        const availW = svgW - padding * 2 - (valid.length - 1) * gap;
        const availH = svgH - padding * 2;

        const maxLen = Math.max(...valid.map(r => r.length), 1);
        const maxWid = Math.max(...valid.map(r => r.width), 1);
        const scale = Math.min(availW / (valid.length * maxLen), availH / maxWid);

        let currentX = padding;
        const roomRects = valid.map((r, i) => {
          const w = Math.max(90, Math.min(availW / valid.length, r.length * scale * 1.5));
          const h = Math.max(68, Math.min(availH, r.width * scale * 1.5));
          const y = padding + (availH - h) / 2;
          // Strip parenthesis guidance like "(ej. Sala)" so the text doesn't truncate or clip
          const cleanName = (r.name || `Ambiente ${i + 1}`).replace(/\s*\(.*\)/, '').trim() || `Ambiente ${i + 1}`;
          const rect = {
            x: currentX,
            y,
            w,
            h,
            name: cleanName,
            dim: `${number.format(r.length)}m × ${number.format(r.width)}m`,
            area: `${number.format(r.area)} m²`
          };
          currentX += w + gap;
          return rect;
        });

        // Normalize total width inside SVG
        const scaleFactor = Math.min(1, (svgW - padding * 2) / (currentX - padding));
        const svgItems = roomRects.map((rect, idx) => {
          const rw = rect.w * scaleFactor;
          const rh = rect.h;
          const roomDelay = (idx * 0.28).toFixed(2);
          return `
            <g class="spc-svg-room spc-svg-room--animate" style="--room-delay:${roomDelay}s;" transform="translate(${rect.x * scaleFactor}, ${rect.y})">
              <rect width="${rw}" height="${rh}" rx="6" class="spc-chain-fill" />
              <rect width="${rw}" height="${rh}" rx="6" pathLength="100" class="spc-chain-outline" />
              <line x1="4" y1="4" x2="${rw - 4}" y2="${rh - 4}" class="spc-chain-guide" />
              <text x="${rw / 2}" y="${rh / 2 - 13}" text-anchor="middle" class="spc-svg-name spc-chain-name">${rect.name.slice(0, 16)}</text>
              <text x="${rw / 2}" y="${rh / 2 + 3}" text-anchor="middle" class="spc-svg-dim spc-chain-dim">${rect.dim}</text>
              <text x="${rw / 2}" y="${rh / 2 + 19}" text-anchor="middle" class="spc-svg-area spc-chain-area">${rect.area}</text>
            </g>
          `;
        }).join('');

        schematicStage.innerHTML = `
          <svg viewBox="0 0 ${svgW} ${svgH}" class="spc-schematic-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="spc-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spc-grid)" rx="8" />
            ${svgItems}
          </svg>
        `;
      }

      function attachRoomListeners(card) {
        card.querySelectorAll('input').forEach(inp => {
          inp.addEventListener('input', () => {
            updateRoomsUI();
            recalculate();
          });
        });
        const removeBtn = card.querySelector('[data-room-remove]');
        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            const rooms = roomsContainer.querySelectorAll('[data-room-item]');
            if (rooms.length > 1) {
              card.remove();
              updateRoomsUI();
              recalculate();
            }
          });
        }
      }

      if (roomsContainer) {
        roomsContainer.querySelectorAll('[data-room-item]').forEach(attachRoomListeners);
      }

      if (addRoomBtn && roomsContainer) {
        addRoomBtn.addEventListener('click', () => {
          const currentRooms = roomsContainer.querySelectorAll('[data-room-item]');
          if (currentRooms.length >= 8) return;
          const newIdx = currentRooms.length;
          const sectionId = page.dataset.sectionId || 'spc';
          const newCard = document.createElement('div');
          newCard.className = 'spc-room-card spc-room-card--animate-in';
          newCard.dataset.roomItem = String(newIdx);
          newCard.innerHTML = `
            <div class="spc-room-header">
              <input type="text" class="spc-room-name-input" value="Ambiente ${newIdx + 1}" aria-label="Nombre del ambiente" placeholder="Nombre" data-room-name>
              <span class="spc-room-subtotal" data-room-subtotal>0.00 m²</span>
              <button type="button" class="spc-room-remove" data-room-remove aria-label="Eliminar este ambiente" title="Eliminar ambiente">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="spc-room-fields">
              <div class="spc-dim-field">
                <label for="room-${newIdx}-len-${sectionId}">Largo</label>
                <div class="spc-dim-box">
                  <input id="room-${newIdx}-len-${sectionId}" type="number" step="0.01" min="0.1" max="100" inputmode="decimal" placeholder="3.50" data-dim="length">
                  <span class="spc-unit">m</span>
                </div>
              </div>
              <span class="spc-dim-mult" aria-hidden="true">×</span>
              <div class="spc-dim-field">
                <label for="room-${newIdx}-wid-${sectionId}">Ancho</label>
                <div class="spc-dim-box">
                  <input id="room-${newIdx}-wid-${sectionId}" type="number" step="0.01" min="0.1" max="100" inputmode="decimal" placeholder="2.80" data-dim="width">
                  <span class="spc-unit">m</span>
                </div>
              </div>
            </div>
          `;
          roomsContainer.appendChild(newCard);
          attachRoomListeners(newCard);
          updateRoomsUI();
          newCard.querySelector('[data-dim="length"]')?.focus();
        });
      }

      // Calculation execution
      function recalculate() {
        let areaVal = 0;
        if (currentMode === 'dimensions') {
          const rooms = getRoomsData();
          areaVal = rooms.reduce((acc, r) => acc + r.area, 0);
          // Sync with hidden/direct input for any legacy form listeners
          if (directArea && areaVal > 0) directArea.value = areaVal.toFixed(2);
        } else {
          areaVal = parseFloat(directArea?.value) || 0;
        }

        const coverage = parseFloat(page.dataset.coverage) || 2.196;
        const waste = isWasteChecked();

        if (areaVal <= 0) {
          lastCalculation = null;
          if (boxesEl) boxesEl.textContent = '-- cajas';
          if (boxesStatusEl) boxesStatusEl.textContent = 'Ingresa medidas para calcular';
          if (netAreaEl) netAreaEl.textContent = '0.00 m²';
          if (targetAreaEl) targetAreaEl.textContent = '0.00 m²';
          if (coveredEl) coveredEl.textContent = '0.00 m²';
          if (leftoverEl) leftoverEl.textContent = '0.00 m²';
          if (planksTextEl) planksTextEl.textContent = 'Equivale a -- planchas (10 planchas/caja)';
          if (resultCard) resultCard.classList.remove('has-result');
          return;
        }

        const calc = calculate(areaVal, coverage, waste);
        lastCalculation = calc;

        if (!calc) {
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = coverage > 0 ? 'Ingresa un área válida entre 0.01 y 100 000 m².' : 'Consulta al asesor para confirmar el rendimiento por caja.';
          }
          if (resultCard) resultCard.classList.remove('has-result');
          return;
        }

        if (errorEl) errorEl.hidden = true;
        if (resultCard) resultCard.classList.add('has-result');

        if (boxesEl) {
          const oldVal = boxesEl.textContent;
          const newVal = `${calc.boxes} ${calc.boxes === 1 ? 'caja' : 'cajas'}`;
          boxesEl.textContent = newVal;
          if (oldVal !== newVal) {
            boxesEl.classList.remove('spc-metric-pulse');
            void boxesEl.offsetWidth;
            boxesEl.classList.add('spc-metric-pulse');
          }
        }
        if (boxesStatusEl) boxesStatusEl.textContent = `Requeridas para ${number.format(calc.targetArea)} m² totales`;
        if (netAreaEl) netAreaEl.textContent = `${number.format(calc.netArea)} m²`;
        if (targetAreaEl) targetAreaEl.textContent = `${number.format(calc.targetArea)} m²`;
        if (coveredEl) coveredEl.textContent = `${number.format(calc.covered)} m²`;
        if (leftoverEl) leftoverEl.textContent = `${number.format(calc.leftover)} m²`;
        if (planksTextEl) planksTextEl.textContent = `Equivale a ${integer.format(calc.planks)} planchas de 122 × 18 cm`;

        if (currentMode === 'direct') {
          renderSchematic([]);
        }

        contactUpdate();
      }

      // Input events on waste & direct area
      if (wasteCheckbox) {
        wasteCheckbox.addEventListener('change', recalculate);
      }
      if (directArea) {
        directArea.addEventListener('input', () => {
          recalculate();
          if (currentMode === 'direct') renderSchematic([]);
        });
      }

      if (contactBtn) {
        contactBtn.addEventListener('click', e => {
          const href = contactBtn.getAttribute('href') || '';
          if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      }

      form.addEventListener('submit', event => {
        event.preventDefault();
        recalculate();
        if (contactBtn && lastCalculation) {
          contactBtn.focus();
        }
      });

      // Initial run
      updateRoomsUI();
      recalculate();
    });
  }

  window.DecokasaSPC = { init };
  init(document);
  document.addEventListener('shopify:section:load', event => init(event.target));
})();
