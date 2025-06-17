document.addEventListener('DOMContentLoaded', () => {
    const memoryForm = document.getElementById('memoryForm');
    const memoriesContainer = document.getElementById('memoriesContainer');
    loadMemories();

    memoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('title');
        const contentInput = document.getElementById('content');
        
        if (titleInput.value.trim() && contentInput.value.trim()) {
            saveMemory(titleInput.value, contentInput.value);
            titleInput.value = '';
            contentInput.value = '';
        }
    });

    function saveMemory(title, content) {
        const memory = {
            id: Date.now(),
            title,
            content,
            date: new Date().toLocaleDateString()
        };

        let memories = JSON.parse(localStorage.getItem('memories') || '[]');
        memories.unshift(memory);
        localStorage.setItem('memories', JSON.stringify(memories));
        
        displayMemory(memory);
    }

    function loadMemories() {
        const memories = JSON.parse(localStorage.getItem('memories') || '[]');
        memories.forEach(memory => displayMemory(memory));
    }

    function displayMemory(memory) {
        const memoryElement = document.createElement('div');
        memoryElement.className = 'memory-card fade-in';
        memoryElement.innerHTML = `
            <h2 class="memory-title">${memory.title}</h2>
            <p>${memory.content}</p>
            <div class="memory-date">${memory.date}</div>
            <button onclick="deleteMemory(${memory.id})">Delete</button>
        `;
        
        if (memoriesContainer.firstChild) {
            memoriesContainer.insertBefore(memoryElement, memoriesContainer.firstChild);
        } else {
            memoriesContainer.appendChild(memoryElement);
        }
    }

    window.deleteMemory = (id) => {
        let memories = JSON.parse(localStorage.getItem('memories') || '[]');
        memories = memories.filter(memory => memory.id !== id);
        localStorage.setItem('memories', JSON.stringify(memories));
        
        const memoryElement = document.querySelector(`[onclick="deleteMemory(${id})"]`).parentElement;
        memoryElement.style.animation = 'fadeIn 0.5s ease-in reverse';
        setTimeout(() => memoryElement.remove(), 500);
    };

    window.openBluePage = () => {
        // Add fade out effect to main content
        document.getElementById('mainContent').classList.add('fade-out');

        setTimeout(() => {
            // Stop main music
            const mainMusic = document.getElementById('backgroundMusic');
            mainMusic.pause();

            // Hide main content
            document.getElementById('mainContent').style.display = 'none';
            document.getElementById('musicPlayer').style.display = 'none';

            // Show blue page with transition
            const bluePage = document.getElementById('bluePage');
            bluePage.style.display = 'block';
            bluePage.classList.add('page-transition');

            // Trigger transition
            requestAnimationFrame(() => {
                bluePage.classList.add('active');
            });

            // Start blue music and video
            setTimeout(() => {
                const blueMusic = document.getElementById('blueMusic');
                const blueVideo = document.getElementById('blueVideo');

                blueMusic.play().catch(e => console.log("Blue music autoplay prevented."));
                blueVideo.play().catch(e => console.log("Video autoplay prevented."));
                document.getElementById('blueMusicBtn').textContent = '⏸';
            }, 400);

        }, 300);
    }

    window.closeBluePage = () => {
        // Add fade out to blue page
        const bluePage = document.getElementById('bluePage');
        bluePage.classList.remove('active');

        setTimeout(() => {
            // Stop blue media
            const blueMusic = document.getElementById('blueMusic');
            const blueVideo = document.getElementById('blueVideo');
            blueMusic.pause();
            blueVideo.pause();

            // Hide blue page
            bluePage.style.display = 'none';
            bluePage.classList.remove('page-transition');

            // Show main content with transition
            const mainContent = document.getElementById('mainContent');
            mainContent.style.display = 'block';
            mainContent.classList.remove('fade-out');
            document.getElementById('musicPlayer').style.display = 'block';

            // Resume main music
            const mainMusic = document.getElementById('backgroundMusic');
            mainMusic.play().catch(e => console.log("Main music resume prevented."));
            document.getElementById('playPauseBtn').textContent = '⏸';
        }, 600);
    }

    // Initialize smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add scroll momentum for mobile
    document.body.style.webkitOverflowScrolling = 'touch';
});
