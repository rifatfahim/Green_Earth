let cart = [];

const addToCart = (plant) => {
    const existingPlant = cart.find((item) => item.id === plant.id);
    if (existingPlant) {
        existingPlant.quantity++;
    } else {
        cart.push({ ...plant, quantity: 1 });
    }

    displayCart();
    updateTotal();
};

const toggleSpinner = (isLoading) => {
    const spinner = document.getElementById("loading-spinner");
    const treeContainer = document.getElementById("tree-container");

    if (isLoading) {
        spinner.classList.remove("hidden");
        treeContainer.classList.add("hidden");
    } else {
        spinner.classList.add("hidden");
        treeContainer.classList.remove("hidden");
    }
};

const displayCart = () => {
    const cartContainer = document.getElementById("cart-items-container");
    cartContainer.innerHTML = "";

    cart.forEach((plant) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add(
            "flex",
            "items-center",
            "bg-[#F0FDF4]",
            "py-2",
            "px-3",
            "justify-between",
            "rounded"
        );

        cartItem.innerHTML = `
        <div>
            <h3 class="font-semibold text-sm">${plant.name}</h3>
            <span class="text-[#8C8C8C]">৳${plant.price} x ${plant.quantity}</span>
        </div>
        <span onclick="removeFromCart(${plant.id})" class="cursor-pointer text-sm">❌</span>
    `;

        cartContainer.append(cartItem);
    });
};

const updateTotal = () => {
    const totalPriceElement = document.getElementById("total-price");
    const total = cart.reduce(
        (sum, plant) => sum + plant.price * plant.quantity,
        0
    );

    totalPriceElement.innerText = total;
};

const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then((res) => res.json())
        .then((json) => displayCategories(json.categories));
};

const loadAllTree = () => {
    removeActive();
    const allTreesBtn = document.getElementById("all-trees-btn");
    if (allTreesBtn) {
        allTreesBtn.classList.add("active");
    }

    toggleSpinner(true);

    fetch("https://openapi.programming-hero.com/api/plants")
        .then((res) => res.json())
        .then((json) => {
            displayTree(json.plants);
            toggleSpinner(false);
        });
};

const loadPlants = (id) => {
    toggleSpinner(true);

    const url = `https://openapi.programming-hero.com/api/category/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive();
            const clickCat = document.getElementById(`cat-${id}`);
            clickCat.classList.add("active");
            displayTree(data.plants);
            toggleSpinner(false);
        });
};

const loadCardDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    const plantDetail = Array.isArray(details.plants) ? details.plants[0] : details.plants;

    displayCardDetails(plantDetail);
};

const displayCardDetails = (card) => {
    const displayPlantDetails = document.getElementById("plant-card-details");
    displayPlantDetails.innerHTML = `
    <div class="p-4">
      <!-- Title -->
      <h2 class="text-xl font-semibold mb-3">${card.name}</h2>
      
      <!-- Image -->
      <div>
        <img class="w-full h-[200px] rounded-lg mb-3 object-cover" src="${card.image}" alt="${card.name}">
      </div>
      
      <!-- Category -->
      <p><strong>Category:</strong> ${card.category}</p>
      
      <!-- Price -->
      <p><strong>Price:</strong> ৳${card.price}</p>
      
      <!-- Description -->
      <p class="mt-2"><strong>Description:</strong> ${card.description}</p>
      
      <!-- Add to Cart button -->
      <button id="modal-add-cart" 
              class="w-full bg-[#15803D] text-white font-medium py-3 
              rounded-[999px] mt-4 cursor-pointer hover:bg-[#13a145] transition duration-300">
          Add to Cart
      </button>
    </div>
  `;

    const modal = document.getElementById("plant_card_modal");
    modal.showModal();

    document.getElementById("modal-add-cart").addEventListener("click", () => {
        addToCart(card);
        alert(`Added ${card.name} to cart!`);
    });
};


const removeActive = () => {
    const categoryButtons = document.querySelectorAll(".cat-btn");
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
};

const displayTree = (plants) => {
    const treeContainer = document.getElementById("tree-container");
    treeContainer.innerHTML = "";

    plants.forEach((plant) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add(
            "bg-white",
            "p-4",
            "rounded-lg",
            "flex",
            "flex-col",
            "hover:shadow-lg",
            "hover:scale-105",
            "transition",
            "duration-300"
        );

        cardDiv.innerHTML = `
        <img class="w-full h-42 object-cover rounded-lg mb-3" src="${plant.image}" alt="${plant.name}">
        <div class="flex flex-col flex-grow">
            <h3 onclick="loadCardDetails(${plant.id})" class="font-semibold text-xl cursor-pointer hover:underline">
                ${plant.name}
            </h3>
            <p class="text-[#1F2937] py-5">${plant.description.slice(0, 80)}...</p>
            <div class="mt-auto flex justify-between mb-3">
                <button class="text-[#15803D] bg-[#DCFCE7] py-1 px-3 rounded-[400px] cursor-default">
                    ${plant.category}
                </button>
                <p><span>৳</span>${plant.price}</p>
            </div>
            <button 
    onclick='
        event.stopPropagation();
        addToCart(${JSON.stringify(plant)});
        alert("Added ${plant.name} to cart!");
    ' 
    class="w-full bg-[#15803D] text-white font-medium py-3 rounded-[999px] mt-2 cursor-pointer hover:bg-[#13a145] transition duration-300">
    Add to Cart
</button>
        </div>
    `;

        treeContainer.append(cardDiv);
    });
};


const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("categories-container");
    categoriesContainer.innerHTML = "";

    const allTreesItem = document.createElement("div");
    allTreesItem.innerHTML = `
        <button id="all-trees-btn" onclick="loadAllTree()" class="category-btn w-full text-left p-2 rounded cat-btn hover:bg-blue-200 active">
            All Trees
        </button>
    `;
    categoriesContainer.append(allTreesItem);


    for (const category of categories) {
        const categoryList = document.createElement("div");
        categoryList.innerHTML = `
            <button id="cat-${category.id}" onclick="loadPlants(${category.id})" class="category-btn w-full text-left p-2 rounded cat-btn hover:bg-blue-200">
                ${category.category_name}
            </button>
        `;
        categoriesContainer.append(categoryList);
    }
};

const removeFromCart = (plantId) => {
    const itemIndex = cart.findIndex((item) => item.id === plantId);

    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
    }
    displayCart();
    updateTotal();
};

loadCategories();
loadAllTree();
