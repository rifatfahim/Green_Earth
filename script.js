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
        <i onclick="removeFromCart(${plant.id})" class="fa-solid fa-xmark text-[#1F2937] cursor-pointer"></i>
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