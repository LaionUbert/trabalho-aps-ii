interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

class ShoppingCart {
  private items: CartItem[] = [];
  private orderSummaryElement: HTMLElement;

  constructor(orderSummaryId: string) {
    const element = document.getElementById(orderSummaryId);
    if (!element) {
      throw new Error(`Elemento com ID '${orderSummaryId}' não encontrado.`);
    }
    this.orderSummaryElement = element;
    this.renderCart();
  }

  addItem(item: CartItem) {
    const existingItem = this.items.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
    this.renderCart();
  }

  clearCart() {
    this.items = [];
    this.renderCart();
  }

  private renderCart() {
    if (this.items.length === 0) {
      this.orderSummaryElement.innerHTML = `<p id="order-total">Carrinho vazio.</p>`;
      return;
    }

    let summaryHTML = `<ul>`;
    let total = 0;

    this.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      summaryHTML += `
        <li>
          <strong>${item.name}</strong><br>
          Quantidade: ${item.quantity}<br>
          Preço Unitário: R$ ${item.price.toFixed(2)}<br>
          Subtotal: R$ ${itemTotal.toFixed(2)}
        </li>
        <hr>
      `;
    });

    summaryHTML += `</ul>`;
    summaryHTML += `<p id="order-total"><strong>Total: R$ ${total.toFixed(2)}</strong></p>`;

    this.orderSummaryElement.innerHTML = summaryHTML;
  }

  getItems() {
    return this.items;
  }
}

// Função para formatar o preço string para número
function parsePrice(priceString: string): number {
  const cleaned = priceString.replace('R$', '').replace('.', '').replace(',', '.').trim();
  return parseFloat(cleaned);
}

// Função para extrair a quantidade do texto
function parseQuantity(quantityString: string): number {
  const regex = /\((\d+)\s/;
  const match = quantityString.match(regex);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  } else {
    return 1;
  }
}

// Inicialização após o DOM estar carregado
document.addEventListener('DOMContentLoaded', () => {
  const cart = new ShoppingCart('order-summary');

  // Seleciona todos os botões "Adicionar ao Carrinho"
  const addToCartButtons = document.querySelectorAll('.menu-item button');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      const menuItem = (button.closest('.menu-item') as HTMLElement);
      if (!menuItem) return;

      const nameElement = menuItem.querySelector('h3');
      const priceElement = menuItem.querySelector('span');

      if (!nameElement || !priceElement) return;

      const name = nameElement.textContent?.trim() || 'Item sem nome';
      const priceText = priceElement.textContent || 'R$ 0,00';
      const price = parsePrice(priceText);

      const quantity = parseQuantity(priceText);

      const item: CartItem = {
        name,
        price,
        quantity
      };

      cart.addItem(item);
    });
  });

  // Botão "Limpar Carrinho"
  const clearCartButton = document.getElementById('clear-cart');
  if (clearCartButton) {
    clearCartButton.addEventListener('click', (event) => {
      event.preventDefault();
      cart.clearCart();
    });
  }

  // Botão "Realizar Pedido"
  const placeOrderButton = document.getElementById('place-order');
  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (cart.getItems().length === 0) {
        alert("Seu carrinho está vazio!");
        return;
      }

      // Salva o carrinho no sessionStorage
      sessionStorage.setItem('cartItems', JSON.stringify(cart.getItems()));

      // Redireciona para a página de entrega
      window.location.href = 'paginas/pagamento.html';
    });
  }
});
