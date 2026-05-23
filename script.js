const defaultItems = [
    { id: 1, name: 'Помідори', amount: 2, isBought: true },
    { id: 2, name: 'Печиво', amount: 2, isBought: false },
    { id: 3, name: 'Сир', amount: 1, isBought: false }
];

let items = JSON.parse(localStorage.getItem('buyListState'));
if (!items) {
    items = defaultItems;
}

const itemsContainer = document.getElementById('items-container');
const leftToBuyContainer = document.getElementById('left-to-buy-container');
const boughtContainer = document.getElementById('bought-container');
const addForm = document.getElementById('add-form');
const itemInput = document.getElementById('item-input');

function saveAndRender() {
    localStorage.setItem('buyListState', JSON.stringify(items));
    render();
}

function render() {
    itemsContainer.innerHTML = '';
    leftToBuyContainer.innerHTML = '';
    boughtContainer.innerHTML = '';

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'item';

        if (item.isBought) {
            li.innerHTML = `
                <span class="item-name crossed">${item.name}</span>
                <div class="item-controls center-controls">
                    <span class="amount-badge">${item.amount}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-silver btn-unbuy" data-tooltip="Зробити не купленим">Не куплено</button>
                </div>
            `;
            li.querySelector('.btn-unbuy').addEventListener('click', () => toggleBuy(item.id));
        } else {
            li.innerHTML = `
                <span class="item-name">${item.name}</span>
                <div class="item-controls">
                    <button class="btn btn-round btn-red btn-minus ${item.amount === 1 ? 'disabled' : ''}" data-tooltip="Зменшити">-</button>
                    <span class="amount-badge">${item.amount}</span>
                    <button class="btn btn-round btn-green btn-plus" data-tooltip="Збільшити">+</button>
                </div>
                <div class="item-actions">
                    <button class="btn btn-silver btn-buy" data-tooltip="Відмітити як куплене">Куплено</button>
                    <button class="btn btn-square btn-red btn-delete" data-tooltip="Видалити товар">×</button>
                </div>
            `;

            li.querySelector('.btn-plus').addEventListener('click', () => updateAmount(item.id, 1));
            li.querySelector('.btn-minus').addEventListener('click', () => updateAmount(item.id, -1));
            li.querySelector('.btn-buy').addEventListener('click', () => toggleBuy(item.id));
            li.querySelector('.btn-delete').addEventListener('click', () => deleteItem(item.id));

            const nameSpan = li.querySelector('.item-name');
            nameSpan.addEventListener('click', () => startEditingName(item.id, nameSpan));
        }

        itemsContainer.appendChild(li);

        if (index < items.length - 1) {
            const hr = document.createElement('hr');
            hr.className = 'divider';
            itemsContainer.appendChild(hr);
        }

        const badge = document.createElement('span');
        if (item.isBought) {
            badge.className = 'product-item crossed-tag';
            badge.innerHTML = `${item.name} <span class="amount">${item.amount}</span>`;
            boughtContainer.appendChild(badge);
        } else {
            badge.className = 'product-item';
            badge.innerHTML = `${item.name} <span class="amount">${item.amount}</span>`;
            leftToBuyContainer.appendChild(badge);
        }
    });
}

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = itemInput.value.trim();
    if (name) {
        items.push({
            id: Date.now(),
            name: name,
            amount: 1,
            isBought: false
        });
        itemInput.value = '';
        itemInput.focus();
        saveAndRender();
    }
});

function updateAmount(id, delta) {
    const item = items.find(i => i.id === id);
    if (item && item.amount + delta >= 1) {
        item.amount += delta;
        saveAndRender();
    }
}

function deleteItem(id) {
    items = items.filter(i => i.id !== id);
    saveAndRender();
}

function toggleBuy(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        item.isBought = !item.isBought;
        saveAndRender();
    }
}

function startEditingName(id, spanElement) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = item.name;

    spanElement.replaceWith(input);
    input.focus();

    function finishEditing() {
        const newName = input.value.trim();
        if (newName) {
            item.name = newName;
        }
        saveAndRender();
    }

    input.addEventListener('blur', finishEditing);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEditing();
    });
}

render();