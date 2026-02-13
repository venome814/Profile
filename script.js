const USER_ID = '1433079566397735064'; // <--- PUT YOUR ID HERE
const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const timer = document.getElementById('timer');
const glow = document.getElementById('cursor-glow');

// 1. Mouse Follower Logic
window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// 2. Fetch Live Discord Data (Lanyard API)
async function updateStatus() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        const data = await res.json();
        
        if (data.success) {
            const { discord_user, discord_status, activities } = data.data;
            
            // Set User Info
            document.getElementById('username').innerText = discord_user.username;
            document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${USER_ID}/${discord_user.avatar}.png`;
            
            // Set Status Text
            const activity = activities.find(a => a.type === 0); // Playing status
            document.getElementById('status-text').innerText = activity ? activity.name : discord_status.toUpperCase();

            // Set Status Color
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            document.getElementById('status-dot').style.background = colors[discord_status] || '#747f8d';
        }
    } catch (err) {
        console.error("Error fetching Lanyard data");
    }
}

// 3. Music Player Logic
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = "PAUSE";
    } else {
        audio.pause();
        playBtn.innerText = "PLAY";
    }
});

audio.addEventListener('timeupdate', () => {
    const format = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };
    timer.innerText = `${format(audio.currentTime)} / ${format(audio.duration || 0)}`;
});

// Refresh status every 15 seconds
setInterval(updateStatus, 15000);
updateStatus();
