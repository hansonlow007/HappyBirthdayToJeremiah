// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeMusic();
    createFloatingHearts();
    addPhotoClickHandlers();
    optimizeForMobile();
    loadWishes(); 
});

// --- 音樂控制模組 ---
let isMusicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

function initializeMusic() {
    // 1. 基礎開關邏輯
    musicToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
    });

    // 2. 全局交互觸發：只要用戶點擊頁面任何地方，就嘗試播放
    const autoPlayOnFirstInteraction = () => {
        if (!isMusicPlaying) {
            playMusic();
        }
        // 觸發一次後移除監聽，避免重複執行
        document.removeEventListener('click', autoPlayOnFirstInteraction);
        document.removeEventListener('touchstart', autoPlayOnFirstInteraction);
        document.removeEventListener('keydown', autoPlayOnFirstInteraction);
    };

    document.addEventListener('click', autoPlayOnFirstInteraction);
    document.addEventListener('touchstart', autoPlayOnFirstInteraction);
    document.addEventListener('keydown', autoPlayOnFirstInteraction);

    // 監聽狀態同步 UI
    bgMusic.addEventListener('play', () => {
        isMusicPlaying = true;
        musicToggle.textContent = '🎵';
        musicToggle.classList.add('playing'); // 你可以在CSS加旋轉動畫
    });

    bgMusic.addEventListener('pause', () => {
        isMusicPlaying = false;
        musicToggle.textContent = '⏸';
        musicToggle.classList.remove('playing');
    });

    bgMusic.addEventListener('error', () => showMusicError());
}

// 封裝播放函數
function playMusic() {
    bgMusic.play().then(() => {
        console.log("播放成功");
    }).catch(error => {
        console.log("播放被瀏覽器攔截:", error);
    });
}

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
    } else {
        playMusic();
    }
}

// --- 顯示音樂播放提示 (增強版) ---
function showMusicPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'music-prompt';
    // 修改按鈕文字，引導用戶點擊觸發播放
    prompt.innerHTML = `
        <div class="prompt-content">
            <p>🎵 開啟背景音樂，體驗更佳哦！</p>
            <button id="startMusicBtn">開啟音樂</button>
        </div>
    `;
    
    // 設定樣式
    prompt.style.cssText = `
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 105, 180, 0.9);
        color: white; padding: 25px; border-radius: 15px;
        z-index: 2000; text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(prompt);
    
    // 關鍵：按鈕點擊後立即播放
    document.getElementById('startMusicBtn').addEventListener('click', function() {
        playMusic();
        prompt.remove();
    });
}

// --- 頁面導航 ---
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.animation = 'fadeInUp 0.5s ease-out';
    }

    // 如果是用戶進入開場畫面且音樂沒響，彈出提示
    if (sectionId === 'opening' && !isMusicPlaying) {
        // 先嘗試靜默播放一次
        bgMusic.play().catch(() => {
            showMusicPrompt();
        });
    }
}

// --- 祝福語功能 ---
function saveWishes() {
    const wishes = {
        wish1: document.getElementById('wish1').value,
        wish2: document.getElementById('wish2').value,
        wish3: document.getElementById('wish3').value,
        wish4: document.getElementById('wish4').value
    };
    localStorage.setItem('birthdayWishes', JSON.stringify(wishes));
    showSaveSuccess();
}

function loadWishes() {
    const savedWishes = localStorage.getItem('birthdayWishes');
    if (savedWishes) {
        const wishes = JSON.parse(savedWishes);
        document.getElementById('wish1').value = wishes.wish1 || '';
        document.getElementById('wish2').value = wishes.wish2 || '';
        document.getElementById('wish3').value = wishes.wish3 || '';
        document.getElementById('wish4').value = wishes.wish4 || '';
    }
}

// --- 視覺效果與動畫 ---
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    if(!heartsContainer) return;
    const hearts = ['⭐️', '✨', '🌟', '💖'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('span');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heartsContainer.appendChild(heart);
    }
}

// --- 提示彈窗樣式 ---
function showSaveSuccess() {
    const toast = document.createElement('div');
    toast.textContent = '💾 祝福語已保存！';
    toast.style.cssText = `
        position: fixed; top: 80px; left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 105, 180, 0.9);
        color: white; padding: 12px 24px; border-radius: 25px;
        z-index: 1001; animation: slideDown 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 更多基礎功能保留...
function addPhotoClickHandlers() {
    const photoItems = document.querySelectorAll('.photo-placeholder');
    photoItems.forEach((item, index) => {
        item.addEventListener('click', () => showPhotoModal(index + 1));
    });
}

function optimizeForMobile() {
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) event.preventDefault();
        lastTouchEnd = now;
    }, false);
    let lastTouchEnd = 0;
}

// 動畫樣式注入
const globalStyle = document.createElement('style');
globalStyle.textContent = `
    @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    @keyframes slideUp { from { opacity: 1; transform: translateX(-50%) translateY(0); } to { opacity: 0; transform: translateX(-50%) translateY(-20px); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .playing { animation: rotate 3s linear infinite; display: inline-block; }
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(globalStyle);