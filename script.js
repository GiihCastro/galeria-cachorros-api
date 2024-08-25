document.addEventListener('DOMContentLoaded', () => {
    const breedButtonsContainer = document.getElementById('breed-buttons');
    const imageGallery = document.getElementById('image-gallery');
    const searchInput = document.getElementById('search-input');
    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'loading-message';
    loadingMessage.innerHTML = '<p>Carregando...</p>';
    loadingMessage.style.display = 'none';
    document.body.appendChild(loadingMessage);

    let allBreeds = []; // Para armazenar as raças carregadas
    let breedButtons = {}; // Para armazenar os botões das raças

    // Função para exibir a mensagem de carregamento
    function showLoading() {
        loadingMessage.style.display = 'flex'; // Use 'flex' para centralizar com o CSS
    }

    // Função para ocultar a mensagem de carregamento
    function hideLoading() {
        loadingMessage.style.display = 'none';
    }

    // Função para carregar e exibir os botões de raças
    async function loadBreeds() {
        showLoading();
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            if (!response.ok) throw new Error('Erro na resposta da API');
            const data = await response.json();
            allBreeds = Object.keys(data.message);
            createBreedButtons(allBreeds);
        } catch (error) {
            console.error('Erro ao carregar raças:', error);
            alert('Erro ao carregar raças. Por favor, tente novamente mais tarde.');
        } finally {
            hideLoading();
        }
    }

    // Função para criar botões de raças
    function createBreedButtons(breeds) {
        breedButtonsContainer.innerHTML = '';
        breeds.forEach(breed => {
            const button = document.createElement('button');
            button.className = 'breed-button';
            button.textContent = breed;
            button.addEventListener('click', () => loadImages(breed));
            breedButtonsContainer.appendChild(button);
            breedButtons[breed] = button; // Armazenar o botão para referência futura
        });
    }

    // Função para carregar e exibir imagens da raça selecionada
    async function loadImages(breed) {
        showLoading();
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/16`);
            if (!response.ok) throw new Error('Erro na resposta da API');
            const data = await response.json();
            imageGallery.innerHTML = '';
            data.message.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.alt = `Imagem de um(a) ${breed}`;
                const container = document.createElement('div');
                container.className = 'image-container';
                container.appendChild(img);
                imageGallery.appendChild(container);
            });
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            alert('Erro ao carregar imagens. Por favor, tente novamente mais tarde.');
        } finally {
            hideLoading();
        }
    }

    // Função para filtrar botões de raças com base no input de pesquisa
    function filterBreeds() {
        const searchTerm = searchInput.value.toLowerCase();
        allBreeds.forEach(breed => {
            if (breed.toLowerCase().includes(searchTerm)) {
                breedButtons[breed].style.display = 'inline-block';
            } else {
                breedButtons[breed].style.display = 'none';
            }
        });
    }

    // Carregar raças ao iniciar a aplicação
    loadBreeds();

    // Adicionar evento para filtragem ao digitar no campo de pesquisa
    searchInput.addEventListener('input', filterBreeds);
});
