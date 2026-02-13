const SERVER_ID = '1469997588374880277'; // Replace with your Server ID

async function fetchServerStats() {
    try {
        const response = await fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`);
        const data = await response.json();

        // Update Name and Counts
        document.getElementById('serverName').innerText = data.name;
        document.getElementById('onlineCount').innerText = data.presence_count;
        
        // Note: The public widget API shows "presence_count" (Online). 
        // Total members usually requires a bot, but we can approximate or use online.
        document.getElementById('memberCount').innerText = data.members.length + "+";

        // Update Voice Channels
        const vcList = document.getElementById('vc-list');
        const activeVCs = data.channels.filter(c => c.name); // Channels with people in them

        if (activeVCs.length > 0) {
            vcList.innerHTML = activeVCs.slice(0, 3).map(channel => `
                <p>🔊 ${channel.name}</p>
            `).join('');
        } else {
            vcList.innerHTML = '<p style="font-size: 0.8rem; opacity: 0.5;">Silence in VC...</p>';
        }

    } catch (error) {
        console.error("Failed to fetch server stats. Make sure Widget is enabled in Discord settings.");
    }
}

// Refresh every 30 seconds
setInterval(fetchServerStats, 30000);
fetchServerStats();
