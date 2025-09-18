// 🌦️ ClimaSonoro
const apiKey = '9352e7e2d6975ee83a6a4d487c93b30c';
const buscarBtn = document.getElementById('buscar');
const cidadeInput = document.getElementById('cidade');
const resultado = document.getElementById('resultado');
const container = document.getElementById('container');
const efeitoClima = document.getElementById('efeito-clima');
const audio = document.getElementById('musica');
const btnVoltar = document.getElementById('voltar');
const btnAvancar = document.getElementById('avancar');
const btnLoop = document.getElementById('loop');
const player = document.getElementById('player-musica');  

// 🎵 Músicas por clima
const musicas = {
  Clear: 'C418 - Danny - Minecraft Volume Alpha.mp3',
  Rain: 'øneheart x reidenshi - snowfall.mp3',
  Clouds: 'Yume Nikki Dream Diary OS - Snow Valley (S l o w e d  +  R e v e r b).mp3',
  Snow: 'øneheart x reidenshi - snowfall.mp3',
  Thunderstorm: 'C418 - Chirp (Minecraft Volume Beta).mp3',
  Drizzle: 'øneheart x reidenshi - snowfall.mp3',
  Fog: 'øneheart x reidenshi - snowfall.mp3',
  Mist: 'øneheart - apathy (slowed).mp3',
  Dust: 'Dust Cloud Rushing Wind Sound Efect.mp3',
  default: 'C418 - Oxygène - Minecraft Volume Alpha.mp3'
};

// Configurações de Estilo Mobile
function centralizarBody() {
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";
  document.body.style.justifyContent = "center";
  document.body.style.alignItems = "center";
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
  document.body.style.paddingTop = "0";
}

function subirBody() {
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";
  document.body.style.justifyContent = "flex-start";
  document.body.style.alignItems = "center";
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
  document.body.style.paddingTop = "40px";
}

// 🔊 Tocar música com base no clima
function tocarMusica(clima) {
  const trilha = musicas[clima] || musicas['default'];
  audio.src = trilha;
  audio.style.display = 'block';
  audio.play();
}
if (window.innerWidth <= 500) {
    centralizarBody();
}

// 🎯 Mostrar clima e aplicar estilos
function mostrarClima(dados) {
  const nome = dados.name || 'Local desconhecido';
  const pais = dados.sys.country || '';
  const temp = dados.main.temp;
  const clima = dados.weather[0].main;
  if (window.innerWidth <= 500) {
    subirBody();
  }

  // Emoji por clima
  const weatherPT = {
  Clear: 'Céu limpo',
  Rain: 'Chuva',
  Clouds: 'Nuvens',
  Snow: 'Neve',
  Thunderstorm: 'Tempestade',
  Drizzle: 'Chuvisco',
  Fog: 'Nevoeiro',
  Mist: 'Névoa',
  Dust: 'Poeira',
  default: 'Clima Indefinido'
};

  const emojis = {
    Clear: '☀️',
    Rain: '🌧️',
    Clouds: '☁️',
    Snow: '❄️',
    Thunderstorm: '🌩️',
    Drizzle: '🌦️',
    Fog: '🌫️',
    Mist: '🌁',
    Dust: '💨',
    default: '🌈'
  };

  const descricao = weatherPT[clima] || weatherPT.default;
  const emoji = emojis[clima] || emojis.default;

  // 🕒 Hora local
  const dt = dados.dt;
  const timezone = dados.timezone;
  const timestampCidade = (dt + timezone) * 1000;
  const horaCidade = new Date(timestampCidade);
  const horaFormatada = horaCidade.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });

  resultado.innerHTML = `
    <h2>${nome}, ${pais}</h2>
    <p>${emoji} ${descricao}</p>
    <p>🌡️ Temperatura: ${temp}°C</p>
    <p>💧 Umidade: ${dados.main.humidity}%</p>
    <p>💨 Vento: ${dados.wind.speed} m/s</p>
    <p>🕒 Hora local: ${horaFormatada}</p>`;
  resultado.classList.add('mostrar');
  tocarMusica(clima);
  // 🎨 Estilo por clima (classe no body)
  document.body.className = '';
  // GARANTIR QUE OS ELEMENTOS EXISTEM ANTES DE USAR

  // DADOS DO CLIMA
  const agora = dados.dt;
  const nascerDoSol = dados.sys.sunrise;
  const porDoSol = dados.sys.sunset;

  const ehNoite = agora < nascerDoSol || agora > porDoSol;
  const climasValidos = ['clear','rain','clouds','snow','thunderstorm','drizzle','fog','mist','dust'];
  const climaLower = climasValidos.includes(clima.toLowerCase()) ? clima.toLowerCase() : 'default';
  const momento = ehNoite ? 'noite' : 'dia';

  // 🎯 Aplica classes no body, container, player
  document.body.className = `${climaLower}${ehNoite ? ' noite' : ''}`;
  container.classList.toggle('tema-noite', ehNoite);
  player.classList.toggle('tema-noite', ehNoite);
  
  // 🎨 Aplica o GIF de fundo
  efeitoClima.className = ''; // limpa anterior
  efeitoClima.classList.add(`${climaLower}-${momento}`); // ex: rain-noite

  // 🎶 Player visível só após  const climaLower = clima.toLowerCase();s a busca
  document.getElementById('player-musica').style.display = 'block';
  document.body.style.paddingTop = "0";
}

function mostrarErro(msg) {
  resultado.innerHTML = `<p style="color:red;">${msg}</p>`;
  document.getElementById("API_ERRO").style.display = "block";
}

// 🔍 Buscar clima
buscarBtn.addEventListener('click', () => {
  const cidade = cidadeInput.value.trim();

  if (!cidade) return mostrarErro('Digite uma cidade 😅');
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

  fetch(url)
  .then(res => {
    if (!res.ok) throw new Error('❌ Cidade não encontrada. Tenta outra! 😅');
    return res.json();
  })
  .then(dados => {
    document.getElementById("API_ERRO").style.display = "none";
    mostrarClima(dados);
  })
  .catch(err => mostrarErro(err.message));
});

// 🔁 Controles de player
btnVoltar.addEventListener('click', () => {
  audio.currentTime = Math.max(audio.currentTime - 5, 0);
});

btnAvancar.addEventListener('click', () => {
  audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
});

let loopAtivo = false;
btnLoop.addEventListener('click', () => {
  loopAtivo = !loopAtivo;
  audio.loop = loopAtivo;
  btnLoop.textContent = loopAtivo ? '🔁 Loop: Ligado' : '🔁 Loop: Desligado';
});
