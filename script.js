// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeMusic();
    createFloatingHearts();
    addPhotoClickHandlers();
    optimizeForMobile();
    loadWishes(); // 載入保存的祝福語
});

// 音樂控制
let isMusicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

function initializeMusic() {
    // 由於瀏覽器政策，需要用戶互動才能播放音樂
    musicToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.textContent = '⏸';
            isMusicPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicToggle.textContent = '🎵';
                isMusicPlaying = true;
            }).catch(error => {
                console.log('音樂播放失敗:', error);
                musicToggle.textContent = '⏸';
                showMusicError();
            });
        }
    });

    // 監聽音樂播放狀態
    bgMusic.addEventListener('ended', function() {
        isMusicPlaying = false;
        musicToggle.textContent = '⏸';
    });

    bgMusic.addEventListener('pause', function() {
        isMusicPlaying = false;
        musicToggle.textContent = '⏸';
    });

    bgMusic.addEventListener('play', function() {
        isMusicPlaying = true;
        musicToggle.textContent = '🎵';
    });

    // 檢查音樂文件是否存在
    bgMusic.addEventListener('error', function() {
        showMusicError();
    });
}

// 祝福語功能
function saveWishes() {
    const wishes = {
        wish1: document.getElementById('wish1').value,
        wish2: document.getElementById('wish2').value,
        wish3: document.getElementById('wish3').value,
        wish4: document.getElementById('wish4').value
    };
    
    localStorage.setItem('birthdayWishes', JSON.stringify(wishes));
    
    // 顯示保存成功提示
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

function clearWishes() {
    if (confirm('確定要清空所有祝福語嗎？')) {
        document.getElementById('wish1').value = '';
        document.getElementById('wish2').value = '';
        document.getElementById('wish3').value = '';
        document.getElementById('wish4').value = '';
        localStorage.removeItem('birthdayWishes');
        showClearSuccess();
    }
}

function showSaveSuccess() {
    const toast = document.createElement('div');
    toast.textContent = '💾 祝福語已保存！';
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 105, 180, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 1001;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 3px 10px rgba(255, 105, 180, 0.3);
        animation: slideDown 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function showClearSuccess() {
    const toast = document.createElement('div');
    toast.textContent = '✨ 已清空所有祝福語！';
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 105, 180, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 1001;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 3px 10px rgba(255, 105, 180, 0.3);
        animation: slideDown 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 顯示音樂錯誤提示
function showMusicError() {
    const prompt = document.createElement('div');
    prompt.className = 'music-error';
    prompt.innerHTML = `
        <div class="error-content">
            <p>🎵 音樂文件未找到</p>
            <p>請將你的音樂文件命名為 "your-music.mp3" 並放在網站目錄中</p>
            <button onclick="this.parentElement.parentElement.remove()">知道了</button>
        </div>
    `;
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 105, 180, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1001;
        text-align: center;
        max-width: 300px;
        font-size: 14px;
    `;
    document.body.appendChild(prompt);
    
    setTimeout(() => {
        if (prompt.parentElement) {
            prompt.remove();
        }
    }, 5000);
}


// 頁面導航
function showSection(sectionId) {
    // 隱藏所有區段
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 顯示目標區段
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // 添加進入動畫
        targetSection.style.animation = 'fadeInUp 0.5s ease-out';
        setTimeout(() => {
            targetSection.style.animation = '';
        }, 500);
    }

    // 如果是開場畫面，嘗試播放音樂
    if (sectionId === 'opening' && !isMusicPlaying) {
        showMusicPrompt();
    }
}

// 顯示音樂播放提示
function showMusicPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'music-prompt';
    prompt.innerHTML = `
        <div class="prompt-content">
            <p>🎵 點擊右上角的音樂按鈕來播放背景音樂</p>
            <button onclick="this.parentElement.parentElement.remove()">知道了</button>
        </div>
    `;
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 105, 180, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1001;
        text-align: center;
        font-size: 14px;
    `;
    document.body.appendChild(prompt);
    
    // 3秒後自動消失
    setTimeout(() => {
        if (prompt.parentElement) {
            prompt.remove();
        }
    }, 3000);
}

// 創建更多浮動星星
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const hearts = ['⭐️', '✨', '🌟'];
    
    // 創建更多星星元素
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('span');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heartsContainer.appendChild(heart);
    }
}

// 照片點擊處理
function addPhotoClickHandlers() {
    const photoItems = document.querySelectorAll('.photo-placeholder');
    photoItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            showPhotoModal(index + 1);
        });
        
        // 添加觸摸事件支援
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
    });
}

// 顯示照片模態框
function showPhotoModal(photoNumber) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <div class="modal-photo">
                <span style="font-size: 3rem;">📷</span>
                <p>Photo ${photoNumber}</p>
                <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 8px;">
                    Replace this placeholder with your actual photo
                </p>
                <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 4px;">
                    Edit the HTML file to add your photo path
                </p>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    
    // 關閉模態框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 移動設備優化
function optimizeForMobile() {
    // 防止雙擊縮放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 防止滾動時觸發點擊
    let isScrolling = false;
    document.addEventListener('scroll', function() {
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, 150);
    });

    // 優化按鈕點擊
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
    });
}

// 添加淡入動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        position: relative;
        max-width: 300px;
        width: 90%;
        margin: 20px;
    }
    
    .close-btn {
        position: absolute;
        top: 8px;
        right: 12px;
        font-size: 20px;
        cursor: pointer;
        color: #666;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f0f0f0;
    }
    
    .close-btn:hover {
        color: #333;
        background: #e0e0e0;
    }
    
    .modal-photo {
        margin-top: 15px;
    }
    
    .music-prompt .prompt-content button,
    .music-error .error-content button {
        background: #ff69b4;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 10px;
        font-weight: 500;
        font-size: 14px;
        min-height: 36px;
    }
    
    .music-prompt .prompt-content button:hover,
    .music-error .error-content button:hover {
        background: #ff1493;
    }
    
    .error-content p {
        margin-bottom: 8px;
        line-height: 1.4;
    }
`;
document.head.appendChild(style);

// 鍵盤快捷鍵
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'Escape':
            // 關閉模態框
            const modal = document.querySelector('.photo-modal');
            if (modal) {
                modal.remove();
            }
            break;
        case ' ':
            // 空格鍵切換音樂
            e.preventDefault();
            musicToggle.click();
            break;
        case 'w':
        case 'W':
            // W鍵切換到祝福語頁面
            if (document.getElementById('opening').classList.contains('active')) {
                showSection('wishes');
            }
            break;
        case 'h':
        case 'H':
            // H鍵回到首頁
            if (document.getElementById('wishes').classList.contains('active')) {
                showSection('opening');
            }
            break;
    }
});

// 頁面可見性變化時暫停音樂
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isMusicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        isMusicPlaying = false;
    }
});

// 添加一些隨機的互動效果
setInterval(() => {
    if (Math.random() < 0.03) { // 3% 機率
        const hearts = document.querySelectorAll('.floating-hearts span');
        hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.style.transform = 'scale(1.2) rotate(180deg)';
                setTimeout(() => {
                    heart.style.transform = '';
                }, 300);
            }, index * 100);
        });
    }
}, 10000);

// 日曆互動效果
document.addEventListener('DOMContentLoaded', function() {
    const calendarDays = document.querySelectorAll('.days span');
    calendarDays.forEach(day => {
        day.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('birthday')) {
                this.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            }
        });
        
        // 添加觸摸事件
        day.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
    });
});

// 添加脈衝動畫
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyle); 