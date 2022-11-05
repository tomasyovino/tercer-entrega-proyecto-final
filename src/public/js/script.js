let addToCartBtn = document.getElementById("addToCart");

const cartLogic = (btn) => {
    btn.addEventListener("click", () => {
        addToCart(btn);
    });
};

if (addToCartBtn) {
    cartLogic(addToCartBtn);
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