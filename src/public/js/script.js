let addToCartBtn = document.getElementById("addToCart");
let buyBtn = document.getElementById("buyBtn");
let deleteBtn = document.getElementById("deleteBtn");

const cartLogic = (btn) => {
    btn.addEventListener("click", () => {
        addToCart(btn);
    });
};

const cartBuyLogic = (btn) => {
    btn.addEventListener("click", () => {
        buyHandle(btn);
    });
};

const deleteProductFromCartLogic = (btn) => {
    btn.addEventListener("click", () => {
        deleteProductFromCart(btn);
    });
};

if (addToCartBtn) {
    cartLogic(addToCartBtn);
};

if (buyBtn) {
    cartBuyLogic(buyBtn);
};

if (deleteBtn) {
    deleteProductFromCartLogic(deleteBtn);
};

const addToCart = async (btn) => {
    try {
        const rawResponse = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: btn.dataset.userid, productId: btn.dataset.productid })
        });
        const content = rawResponse.json();
        
        console.log(content);
    } catch (err) {
        console.log(`error: ${err.message}`);
    };
};

const buyHandle = async (btn) => {
    try {
        const rawResponse = await fetch('/api/cart/buy', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: "string", productId: "string" })
        });
        const content = rawResponse.json();
        console.log(content);
        console.log(btn);
    } catch (err) {
        console.log(`error: ${err.message}`);
    };
};

const deleteProductFromCart = async (btn) => {
    try {
        const rawResponse = await fetch('/api/cart/product', {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: btn.dataset.userid, productId: btn.dataset.productid })
        });
        const content = rawResponse.json();
        console.log(content);
        console.log(btn);
    } catch (err) {
        console.log(`error: ${err.message}`);
    };
};