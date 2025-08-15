(function() {
       try {
         // Criar painel flutuante
         const panel = document.createElement('div');
         panel.id = 'plataformDestroyerPanel';
         panel.style.cssText = 'position:fixed;top:10px;right:10px;padding:10px;background:#1a1a1a;color:#fff;border-radius:5px;z-index:10000;font-family:Arial, sans-serif;';
         panel.innerHTML = `
           <h3>Auto Imagem - Plataform Destroyer</h3>
           <input type="file" accept="image/*" id="imageUpload"><br>
           <button id="startBtn" disabled>Iniciar Pintura</button>
           <button id="stopBtn" disabled>Parar</button>
           <p id="status">Carregue uma imagem para começar.</p>
         `;
         document.body.appendChild(panel);

         const uploadInput = document.getElementById('imageUpload');
         const startBtn = document.getElementById('startBtn');
         const stopBtn = document.getElementById('stopBtn');
         const status = document.getElementById('status');
         let isRunning = false;
         let imageData = null;
         let startPos = { x: 100, y: 100 }; // Posição inicial automática

         // Detectar paleta de cores (ajuste a classe conforme o site)
         function detectPalette() {
           const palette = document.querySelector('.color-picker'); // Ajuste se necessário
           if (!palette) {
             status.textContent = 'Erro: Abra a paleta de cores clicando em "Pintar".';
             return false;
           }
           return true;
         }

         // Carregar e processar imagem
         uploadInput.addEventListener('change', (e) => {
           const file = e.target.files[0];
           if (!file) return;
           const img = new Image();
           img.onload = () => {
             const canvas = document.createElement('canvas');
             const ctx = canvas.getContext('2d');
             canvas.width = Math.min(img.width, 100);
             canvas.height = Math.min(img.height, 100);
             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
             imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
             status.textContent = 'Imagem carregada. Verificando paleta...';
             if (detectPalette()) {
               status.textContent = `Imagem carregada. Posição automática: x=${startPos.x}, y=${startPos.y}.`;
               startBtn.disabled = false;
             }
           };
           img.src = URL.createObjectURL(file);
         });

         // Simulação de pintura (ajuste para API real do wplace.live)
         async function paintPixel(x, y, color) {
           console.log(`Pintando (${x}, ${y}) com ${color}`);
           await new Promise(resolve => setTimeout(resolve, 30000)); // Cooldown simulado
         }

         // Loop de pintura
         async function startPainting() {
           if (!imageData) {
             status.textContent = 'Erro: Imagem não carregada.';
             return;
           }
           isRunning = true;
           startBtn.disabled = true;
           stopBtn.disabled = false;
           status.textContent = 'Pintando...';

           const { width, height, data } = imageData;
           for (let y = 0; y < height && isRunning; y++) {
             for (let x = 0; x < width && isRunning; x++) {
               const idx = (y * width + x) * 4;
               const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
               if (a === 0 || (r === 255 && g === 255 && b === 255)) continue;
               const canvasX = startPos.x + x;
               const canvasY = startPos.y + y;
               const color = `rgb(${r},${g},${b})`;
               await paintPixel(canvasX, canvasY, color);
               status.textContent = `Progresso: ${Math.round(((y * width + x) / (width * height)) * 100)}%`;
             }
           }
           isRunning = false;
           startBtn.disabled = false;
           stopBtn.disabled = true;
           status.textContent = 'Pintura concluída!';
         }

         // Parar pintura
         stopBtn.addEventListener('click', () => {
           isRunning = false;
           status.textContent = 'Pintura pausada.';
           startBtn.disabled = false;
           stopBtn.disabled = true;
         });

         // Iniciar pintura
         startBtn.addEventListener('click', startPainting);

         // Verificar paleta ao carregar
         if (!detectPalette()) {
           status.textContent = 'Abra a paleta de cores no site.';
         }
       } catch (e) {
         alert('Erro ao executar o script: ' + e.message);
         console.error(e);
       }
     })();
