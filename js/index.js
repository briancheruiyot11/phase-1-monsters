document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const monsterContainer = document.getElementById('monster-container');
    const createMonsterDiv = document.getElementById('create-monster');
    const loadMoreBtn = document.getElementById('load-more'); 
    let currentPage = 1;

    // Fetch monsters
    async function fetchMonsters(page) {
        const limit = 50;
        try {
            const response = await fetch(`http://localhost:3000/monsters/?_limit=${limit}&_page=${page}`);
            if (!response.ok) throw new Error('Failed to load monsters');
            const monsters = await response.json();
            
            if (monsters.length === 0) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = 'No More Monsters';
                return;
            }
            
            monsters.forEach(monster => displayMonster(monster));
        } catch (error) {
            console.error('Error:', error);
            monsterContainer.innerHTML = '<p>Error loading monsters. Please try again.</p>';
        }
    }

    // Display monster
    function displayMonster(monster) {
        const monsterDiv = document.createElement('div');
        monsterDiv.innerHTML = `
            <h2>${monster.name}</h2>
            <h4>Age: ${monster.age}</h4>
            <p>${monster.description}</p>
            <hr>
        `;
        monsterContainer.appendChild(monsterDiv);
    }

    // Create form
    const form = document.createElement('form');
    form.innerHTML = `
        <input type="text" name="name" placeholder="Name..." required>
        <input type="number" name="age" placeholder="Age..." required>
        <input type="text" name="description" placeholder="Description..." required>
        <button type="submit">Create Monster</button>
    `;
    createMonsterDiv.appendChild(form);

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: e.target.name.value,
            age: parseFloat(e.target.age.value),
            description: e.target.description.value
        };
        
        try {
            const response = await fetch('http://localhost:3000/monsters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) throw new Error('Failed to create monster');
            const newMonster = await response.json();
            displayMonster(newMonster);
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create monster. Please try again.');
        }
    });

    // Load more
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchMonsters(currentPage);
    });

    // Initial load
    fetchMonsters(currentPage);
});