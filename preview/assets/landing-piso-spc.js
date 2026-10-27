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

        const svgW = 420;
        const svgH = 160;
        const padding = 16;

        let roomRects = [];
        if (valid.length === 1) {
          const r = valid[0];
          const aspect = Math.max(0.75, Math.min(1.4, (r.length || 1) / (r.width || 1)));
          const w = Math.round(Math.min(180, Math.max(140, 150 * Math.sqrt(aspect))));
          const h = Math.round(Math.min(124, Math.max(98, 116 / Math.sqrt(aspect))));
          const x = Math.round((svgW - w) / 2);
          const y = Math.round((svgH - h) / 2);
          const cleanName = (r.name || 'Ambiente 1').replace(/\s*\(.*\)/, '').trim() || 'Ambiente 1';
          roomRects = [{
            x,
            y,
            w,
            h,
            name: cleanName.length > 16 ? cleanName.slice(0, 15) + '…' : cleanName,
            dim: `${number.format(r.length)}m × ${number.format(r.width)}m`,
            area: `${number.format(r.area)} m²`,
            fontSizeName: 13,
            fontSizeDim: 11,
            fontSizeArea: 13.5
          }];
        } else {
          // 2 or more rooms: group is centered horizontally.
          // Room 1 naturally slides to the left because groupStartX is significantly to the left!
          const gap = valid.length === 2 ? 18 : 12;
          const availW = svgW - padding * 2;
          const totalGap = (valid.length - 1) * gap;
          const roomW = Math.max(92, Math.min(145, Math.floor((availW - totalGap) / valid.length)));
          const totalGroupWidth = valid.length * roomW + totalGap;
          const groupStartX = Math.max(padding, Math.round((svgW - totalGroupWidth) / 2));

          const maxWid = Math.max(...valid.map(r => r.width), 1);

          let curX = groupStartX;
          roomRects = valid.map((r, i) => {
            const relH = Math.max(0.85, Math.min(1.15, (r.width / maxWid) || 1));
            const h = Math.round(Math.max(90, Math.min(122, 110 * relH)));
            const y = Math.round((svgH - h) / 2);
            const cleanName = (r.name || `Ambiente ${i + 1}`).replace(/\s*\(.*\)/, '').trim() || `Ambiente ${i + 1}`;
            const maxChars = roomW > 125 ? 15 : roomW > 105 ? 12 : 9;
            const displayName = cleanName.length > maxChars ? cleanName.slice(0, maxChars - 1) + '…' : cleanName;
            const rect = {
              x: curX,
              y,
              w: roomW,
              h,
              name: displayName,
              dim: `${number.format(r.length)}m × ${number.format(r.width)}m`,
              area: `${number.format(r.area)} m²`,
              fontSizeName: valid.length === 2 ? 12 : 11,
              fontSizeDim: valid.length === 2 ? 10 : 9.5,
              fontSizeArea: valid.length === 2 ? 12 : 11
            };
            curX += roomW + gap;
            return rect;
          });
        }

        let svg = schematicStage.querySelector('svg.spc-schematic-svg');
        const isDimensionSvg = svg && svg.dataset.mode === 'dimensions';

        if (!isDimensionSvg) {
          const svgItems = roomRects.map((rect, idx) => {
            const rw = rect.w;
            const rh = rect.h;
            const roomDelay = (idx * 0.22).toFixed(2);
            return `
              <g class="spc-svg-room spc-svg-room--animate" data-room-idx="${idx}" style="--room-delay:${roomDelay}s; transform: translate(${rect.x}px, ${rect.y}px);" transform="translate(${rect.x}, ${rect.y})">
                <rect width="${rw}" height="${rh}" rx="8" class="spc-chain-fill" />
                <rect width="${rw}" height="${rh}" rx="8" pathLength="100" class="spc-chain-outline" />
                <line x1="5" y1="5" x2="${rw - 5}" y2="${rh - 5}" class="spc-chain-guide" />
                <text x="${rw / 2}" y="${rh / 2 - 14}" text-anchor="middle" class="spc-svg-name spc-chain-name" style="font-size:${rect.fontSizeName}px">${rect.name}</text>
                <text x="${rw / 2}" y="${rh / 2 + 2}" text-anchor="middle" class="spc-svg-dim spc-chain-dim" style="font-size:${rect.fontSizeDim}px">${rect.dim}</text>
                <text x="${rw / 2}" y="${rh / 2 + 20}" text-anchor="middle" class="spc-svg-area spc-chain-area" style="font-size:${rect.fontSizeArea}px">${rect.area}</text>
              </g>
            `;
          }).join('');

          schematicStage.innerHTML = `
            <svg viewBox="0 0 ${svgW} ${svgH}" class="spc-schematic-svg" data-mode="dimensions" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="spc-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#spc-grid)" rx="8" />
              <g class="spc-svg-rooms-group">
                ${svgItems}
              </g>
            </svg>
          `;
        } else {
          const roomsGroup = svg.querySelector('.spc-svg-rooms-group');
          if (roomsGroup) {
            const existingEls = [...roomsGroup.querySelectorAll('.spc-svg-room')];

            roomRects.forEach((rect, idx) => {
              const rw = rect.w;
              const rh = rect.h;
              let el = roomsGroup.querySelector(`[data-room-idx="${idx}"]`);
              if (el) {
                el.style.transform = `translate(${rect.x}px, ${rect.y}px)`;
                el.setAttribute('transform', `translate(${rect.x}, ${rect.y})`);

                const fillRect = el.querySelector('.spc-chain-fill');
                const outlineRect = el.querySelector('.spc-chain-outline');
                const guide = el.querySelector('.spc-chain-guide');
                const nameText = el.querySelector('.spc-svg-name');
                const dimText = el.querySelector('.spc-svg-dim');
                const areaText = el.querySelector('.spc-svg-area');

                if (fillRect) { fillRect.setAttribute('width', rw); fillRect.setAttribute('height', rh); }
                if (outlineRect) { outlineRect.setAttribute('width', rw); outlineRect.setAttribute('height', rh); }
                if (guide) { guide.setAttribute('x2', rw - 5); guide.setAttribute('y2', rh - 5); }
                if (nameText) {
                  nameText.setAttribute('x', rw / 2);
                  nameText.setAttribute('y', rh / 2 - 14);
                  nameText.style.fontSize = `${rect.fontSizeName}px`;
                  nameText.textContent = rect.name;
                }
                if (dimText) {
                  dimText.setAttribute('x', rw / 2);
                  dimText.setAttribute('y', rh / 2 + 2);
                  dimText.style.fontSize = `${rect.fontSizeDim}px`;
                  dimText.textContent = rect.dim;
                }
                if (areaText) {
                  areaText.setAttribute('x', rw / 2);
                  areaText.setAttribute('y', rh / 2 + 20);
                  areaText.style.fontSize = `${rect.fontSizeArea}px`;
                  areaText.textContent = rect.area;
                }
              } else {
                const newG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                newG.setAttribute('class', 'spc-svg-room spc-svg-room--animate');
                newG.setAttribute('data-room-idx', String(idx));
                newG.setAttribute('style', `--room-delay:0.18s; transform: translate(${rect.x}px, ${rect.y}px);`);
                newG.setAttribute('transform', `translate(${rect.x}, ${rect.y})`);
                newG.innerHTML = `
                  <rect width="${rw}" height="${rh}" rx="8" class="spc-chain-fill" />
                  <rect width="${rw}" height="${rh}" rx="8" pathLength="100" class="spc-chain-outline" />
                  <line x1="5" y1="5" x2="${rw - 5}" y2="${rh - 5}" class="spc-chain-guide" />
                  <text x="${rw / 2}" y="${rh / 2 - 14}" text-anchor="middle" class="spc-svg-name spc-chain-name" style="font-size:${rect.fontSizeName}px">${rect.name}</text>
                  <text x="${rw / 2}" y="${rh / 2 + 2}" text-anchor="middle" class="spc-svg-dim spc-chain-dim" style="font-size:${rect.fontSizeDim}px">${rect.dim}</text>
                  <text x="${rw / 2}" y="${rh / 2 + 20}" text-anchor="middle" class="spc-svg-area spc-chain-area" style="font-size:${rect.fontSizeArea}px">${rect.area}</text>
                `;
                roomsGroup.appendChild(newG);
              }
            });

            existingEls.forEach(el => {
              const idx = parseInt(el.getAttribute('data-room-idx'), 10);
              if (idx >= roomRects.length) {
                el.remove();
              }
            });
          }
        }
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
                  <input id="room-${newIdx}-len-${sectionId}" type="number" step="0.01" min="0.1" max="100" inputmode="decimal" placeholder="3.50" data-dim="length" style="outline:none!important;box-shadow:none!important;">
                  <span class="spc-unit">m</span>
                </div>
              </div>
              <span class="spc-dim-mult" aria-hidden="true">×</span>
              <div class="spc-dim-field">
                <label for="room-${newIdx}-wid-${sectionId}">Ancho</label>
                <div class="spc-dim-box">
                  <input id="room-${newIdx}-wid-${sectionId}" type="number" step="0.01" min="0.1" max="100" inputmode="decimal" placeholder="2.80" data-dim="width" style="outline:none!important;box-shadow:none!important;">
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

        // Synchronize request form (#solicitud) with calculated boxes
        const formBox = page.querySelector('#solicitud');
        if (formBox && lastCalculation && lastCalculation.boxes > 0) {
          const formQty = formBox.querySelector('[name="quantity"]');
          if (formQty && formQty.value !== String(lastCalculation.boxes)) {
            formQty.value = lastCalculation.boxes;
            formQty.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
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

      // Order action modal controls
      const orderBtn = page.querySelector('[data-open-request]');
      const modalEl = page.querySelector('[data-spc-modal]');
      const formBoxEl = page.querySelector('#solicitud');

      function openOrderModal() {
        if (!modalEl) return;
        const reqForm = modalEl.querySelector('[data-request-form]');
        if (reqForm) {
          const fieldset = reqForm.querySelector('fieldset');
          if (fieldset) fieldset.disabled = false;
          const submitBtn = reqForm.querySelector('[data-enable-form]');
          if (submitBtn) submitBtn.disabled = false;
          const qtyInput = reqForm.querySelector('[name="quantity"]');
          if (qtyInput && lastCalculation && lastCalculation.boxes > 0) {
            qtyInput.value = lastCalculation.boxes;
            qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          const commentInput = reqForm.querySelector('[name="comment"]');
          if (commentInput && lastCalculation && lastCalculation.boxes > 0) {
            const wasteMsg = lastCalculation.includeWaste ? ' (+10% merma)' : '';
            let details = '';
            if (currentMode === 'dimensions') {
              const rooms = getRoomsData();
              if (rooms && rooms.length > 0) {
                const rDetails = rooms.map(r => `${r.name || 'Ambiente'}: ${number.format(r.length)}m × ${number.format(r.width)}m (${number.format(r.area)} m²)`).join(', ');
                details = ` [Ambientes: ${rDetails}]`;
              }
            }
            commentInput.value = `Solicitud de Piso SPC: ${lastCalculation.boxes} cajas calculadas para ${number.format(lastCalculation.netArea)} m² netos${wasteMsg} (cobertura total ${number.format(lastCalculation.covered)} m²).${details}`;
          }
        }
        modalEl.style.display = 'flex';
        requestAnimationFrame(() => {
          modalEl.classList.add('is-open');
          modalEl.setAttribute('aria-hidden', 'false');
          document.body.classList.add('spc-modal-open');
        });
        setTimeout(() => {
          const nameInput = modalEl.querySelector('[name="name"]');
          if (nameInput) nameInput.focus();
        }, 250);
      }

      function closeOrderModal() {
        if (!modalEl) return;
        modalEl.classList.remove('is-open');
        modalEl.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('spc-modal-open');
        setTimeout(() => {
          if (!modalEl.classList.contains('is-open')) {
            modalEl.style.display = 'none';
          }
        }, 300);
        if (orderBtn) orderBtn.focus();
      }

      if (orderBtn) {
        orderBtn.addEventListener('click', e => {
          e.preventDefault();
          openOrderModal();
        });
      }

      if (modalEl) {
        modalEl.querySelectorAll('[data-modal-close]').forEach(btn => {
          btn.addEventListener('click', e => {
            e.preventDefault();
            closeOrderModal();
          });
        });

        document.addEventListener('keydown', e => {
          if (e.key === 'Escape' && modalEl.classList.contains('is-open')) {
            closeOrderModal();
          }
        });
      }

      page.querySelectorAll('a[href="#solicitud"]').forEach(link => {
        if (link !== orderBtn) {
          link.addEventListener('click', e => {
            e.preventDefault();
            openOrderModal();
          });
        }
      });

      if (window.location.hash === '#solicitud') {
        setTimeout(openOrderModal, 300);
      }

      // Initialize request form inside #solicitud
      const reqForm = page.querySelector('#solicitud [data-request-form]');
      if (reqForm && !reqForm.dataset.spcInitialized) {
        reqForm.dataset.spcInitialized = 'true';
        const fieldset = reqForm.querySelector('fieldset');
        const submitBtn = reqForm.querySelector('[data-enable-form]');
        if (fieldset) fieldset.disabled = false;
        if (submitBtn) submitBtn.disabled = false;

        const qtyInput = reqForm.querySelector('[name="quantity"]');
        const summaryQty = reqForm.closest('.form-box')?.querySelector('[data-form-qty]');
        const summaryTotal = reqForm.closest('.form-box')?.querySelector('[data-form-total]');
        const select = reqForm.querySelector('[name="variant_id"]');
        const variantOption = select?.selectedOptions[0];
        const unitPriceCents = variantOption ? parseInt(variantOption.dataset.price, 10) || 9500 : 9500;
        const currency = reqForm.dataset.currency || 'PEN';

        function updateFormSummary() {
          const qty = Math.max(1, parseInt(qtyInput?.value, 10) || 1);
          if (summaryQty) summaryQty.textContent = `${qty} ${qty === 1 ? 'caja' : 'cajas'}`;
          if (summaryTotal) {
            const total = (qty * unitPriceCents) / 100;
            summaryTotal.textContent = new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(total);
          }
        }
        if (qtyInput) {
          qtyInput.addEventListener('input', updateFormSummary);
          updateFormSummary();
        }

        reqForm.addEventListener('submit', e => {
          e.preventDefault();
          if (!reqForm.reportValidity()) return;
          const statusEl = reqForm.querySelector('[data-request-status]');
          if (statusEl) {
            const name = reqForm.querySelector('[name="name"]')?.value || 'Cliente';
            const qty = qtyInput?.value || '1';
            const ref = 'SPC-' + Math.floor(100000 + Math.random() * 900000);
            statusEl.textContent = `¡Gracias, ${name}! Tu solicitud para ${qty} caja(s) de Piso SPC ha sido recibida en modo de prueba local.\nReferencia: ${ref}\nUn asesor comercial se comunicará contigo para confirmar el pedido y coordinar la entrega.`;
            statusEl.hidden = false;
            statusEl.focus();
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

      // Mobile Persistent Sticky CTA ("Realizar pedido")
      const mobileStickyCta = page.querySelector('#spc-mobile-sticky-cta') || document.getElementById('spc-mobile-sticky-cta');
      const heroSection = page.querySelector('.spc-hero');
      const calcSection = page.querySelector('#calculadora') || page.querySelector('.spc-installation');

      if (mobileStickyCta && calcSection) {
        let ticking = false;

        const updateStickyCta = () => {
          const heroEnd = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
          const calcRect = calcSection.getBoundingClientRect();
          // The calculator is in the viewport (active zone)
          const calcVisible = calcRect.top < window.innerHeight * 0.75 && calcRect.bottom > window.innerHeight * 0.15;
          const modalOpen = document.body.classList.contains('spc-modal-open');
          const isMobile = window.matchMedia('(max-width: 767px)').matches;
          // Show on mobile, after scrolling past the hero, NOT visible while inside calculator, and modal closed
          const shouldShow = isMobile && heroEnd < 60 && !calcVisible && !modalOpen;

          mobileStickyCta.classList.toggle('is-visible', shouldShow);
          ticking = false;
        };

        const scheduleStickyCta = () => {
          if (ticking) return;
          ticking = true;
          window.requestAnimationFrame(updateStickyCta);
        };

        window.addEventListener('scroll', scheduleStickyCta, { passive: true });
        window.addEventListener('resize', scheduleStickyCta);
        scheduleStickyCta();

        // Smooth scroll to calculator on click
        mobileStickyCta.addEventListener('click', e => {
          e.preventDefault();
          calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            const firstInput = calcSection.querySelector('[data-dim="length"]') || calcSection.querySelector('input');
            if (firstInput) firstInput.focus({ preventScroll: true });
          }, 450);
        });
      }

      // Initial run
      updateRoomsUI();
      recalculate();
    });
  }

  window.DecokasaSPC = { init };
  init(document);
  document.addEventListener('shopify:section:load', event => init(event.target));
})();
