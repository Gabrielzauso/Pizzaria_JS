let modalQtd = 1;
let cart = [];
let modalKey = 0;

const c = (el) => document.querySelector(el);// como vamos criar varios querySelector, cria-se uma variavel para utilizar durante o desenvolvimento do projeto e se tornando um codigo mais limpo
const cs = (el) => document.querySelectorAll(el);


// Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizza = c('.models .pizza-item').cloneNode(true); // clonando o modelo que criamos no html e armazenando nessa variavel

    pizza.setAttribute('data-key', index);

    pizza.querySelector('.pizza-item--name').innerHTML = item.name;
    pizza.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizza.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizza.querySelector('.pizza-item--img img').src = item.img;
    pizza.querySelector('a').addEventListener('click', (e) =>{
        e.preventDefault();
        let modal = c('.pizzaWindowArea');
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1;

        modalKey = key;
        

        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaBig img').src = pizzaJson[key].img;

        c('.pizzaInfo--size.selected').classList.remove('selected');

        cs('.pizzaInfo--size').forEach((size, indexInfo) => {
            if(indexInfo == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[indexInfo];
        });
        

        c('.pizzaInfo--qt').innerHTML = modalQtd;
        
        modal.style.opacity = 0;
        modal.style.display = 'flex';
        setTimeout(() =>{
            modal.style.opacity = 1;
        }, 200)
        
        
        
        return modal;
    })


    c('.pizza-area').append(pizza); // chamando a div principal e adicionando o clone que a gente fez em cima
    
    
});

//Eventos do MODAL

function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
}




c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQtd > 1){
    modalQtd --;
    c('.pizzaInfo--qt').innerHTML = modalQtd;
    }
   
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQtd ++;
    c('.pizzaInfo--qt').innerHTML = modalQtd;
})




cs('.pizzaInfo--size').forEach((size, indexInfo) => {
    size.addEventListener('click', (e) =>
    {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});


c('.pizzaInfo--addButton').addEventListener('click', () =>{

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id +'@'+size;
    let key = cart.findIndex((item)=> item.identifier == identifier)
    if(key > -1){
        cart[key].qt  += modalQtd;

    }else {
    cart.push({
        identifier,
        id: pizzaJson[modalKey].id,
        size,
        qt:modalQtd
     })

    }


    closeModal();
    updateCart();

    
    
    

})

c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
    

})


c('.menu-closer').addEventListener('click', () =>{
    c('aside').style.left = '100vw';
})

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show')
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let total = 0;
        let desconto = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break        
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--;

                }else {
                cart.splice(i, 1);
                }
                updateCart();

            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
                
            })

            

            c('.cart').append(cartItem);



        }

            desconto = subtotal * 0.1;

            total = subtotal - desconto;

                c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
                c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
                c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}




