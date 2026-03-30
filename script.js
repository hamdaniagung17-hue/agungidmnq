// 1. KONFIGURASI FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyC5ubrgiVlygL2oexxCbG3BlcripoeAqXs",
  authDomain: "agungidmnq.firebaseapp.com",
  projectId: "agungidmnq",
  storageBucket: "agungidmnq.firebasestorage.app",
  messagingSenderId: "167316829739",
  appId: "1:167316829739:web:2a5e0bb30587e3aa271c6e",
  measurementId: "G-PYJ6PNDTQF",
  databaseURL: "https://agungidmnq-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- FITUR TOMBOL RAHASIA (TITIK) ---
let clickCount = 0;
document.getElementById('secret-dot').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 10) {
        document.getElementById('admin-panel').classList.remove('hidden');
        alert("Akses Pembuat Akun Terbuka!");
        clickCount = 0;
    }
});

// --- FITUR ADMIN: BUAT AKUN ---
function createAccount() {
    const usn = document.getElementById('new-usn').value;
    const pw = document.getElementById('new-pw').value;
    const expiry = document.getElementById('expiry-date').value;

    if (usn && pw && expiry) {
        database.ref('users/' + usn).set({
            password: pw,
            expiryDate: expiry
        }).then(() => {
            alert("Akun " + usn + " Berhasil Dibuat!");
            document.getElementById('admin-panel').classList.add('hidden');
        });
    } else {
        alert("Lengkapi semua data ya!");
    }
}

// --- FITUR LOGIN ---
function handleLogin() {
    const usn = document.getElementById('login-usn').value;
    const pw = document.getElementById('login-pw').value;

    database.ref('users/' + usn).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            const hariIni = new Date().toISOString().split('T')[0];
            if (data.password === pw) {
                if (hariIni <= data.expiryDate) {
                    document.getElementById('login-page').classList.add('hidden');
                    document.getElementById('main-dashboard').classList.remove('hidden');
                    document.getElementById('lebaran-popup').style.display = 'flex';
                } else {
                    alert("Waduh, akun ini sudah kadaluwarsa!");
                }
            } else {
                alert("Password salah bro!");
            }
        } else {
            alert("Username tidak terdaftar!");
        }
    });
}

function closePopup() {
    document.getElementById('lebaran-popup').style.display = 'none';
}

// --- LOGIKA GAME ---
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function showGame(type) {
    const area = document.getElementById('game-area');
    if(type === 'tictactoe') {
        resetTTT();
        renderBoard();
    } else if(type === 'tebak') {
        area.innerHTML = `<h3>Tebak-tebakan Berdua</h3><input type="text" id="soal" placeholder="Pemain 1: Apa kesukaanku?"><button onclick="kunciSoal()">Kunci</button>`;
    }
}

function renderBoard() {
    const area = document.getElementById('game-area');
    area.innerHTML = `<h3>Tic Tac Toe</h3>
    <div style="display:grid; grid-template-columns: repeat(3, 80px); gap: 5px; justify-content: center; margin-bottom: 10px;">
    ${board.map((val, i) => `<button onclick="mainTTT(${i})" style="height:80px; font-size:24px; cursor:pointer;">${val}</button>`).join('')}
    </div>
    <button onclick="resetTTT()">Reset Game</button>`;
}

function mainTTT(i) {
    if(board[i] === '' && gameActive) {
        board[i] = 'X'; 
        renderBoard();
        checkWinner();
        
        if(gameActive) {
            // Bot jalan setelah 500ms
            setTimeout(() => {
                let kosong = board.map((v, idx) => v === '' ? idx : null).filter(v => v !== null);
                if(kosong.length > 0 && gameActive) {
                    board[kosong[Math.floor(Math.random() * kosong.length)]] = 'O';
                    renderBoard();
                    checkWinner();
                }
            }, 500);
        }
    }
}

function checkWinner() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // Horizontal
        [0,3,6], [1,4,7], [2,5,8], // Vertikal
        [0,4,8], [2,4,6]           // Diagonal
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            alert("Pemenangnya adalah: " + board[a]);
            gameActive = false;
            return;
        }
    }

    if (!board.includes('')) {
        alert("Hasilnya SERI! 🤝");
        gameActive = false;
    }
}

function resetTTT() { 
    board = ['', '', '', '', '', '', '', '', '']; 
    gameActive = true;
    renderBoard(); 
}

// --- GAME TEBAK-TEBAKAN ---
function kunciSoal() {
    const soalValue = document.getElementById('soal').value;
    const area = document.getElementById('game-area');
    if(soalValue) {
        area.innerHTML = `<h3>Player 2: Ayo Tebak!</h3>
        <p>Apa yang disukai Pemain 1?</p>
        <input type="text" id="jawaban" placeholder="Tebakanmu?">
        <button onclick="cekJawaban('${soalValue}')">Cek Jawaban</button>`;
    }
}

function cekJawaban(target) {
    const jawabanUser = document.getElementById('jawaban').value;
    if(jawabanUser.toLowerCase() === target.toLowerCase()) {
        alert("🎉 BENAR! Kamu hebat!");
        showGame('tebak');
    } else {
        alert("❌ Salah! Coba lagi.");
    }
}
