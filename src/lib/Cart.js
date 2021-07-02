import find from 'lodash/find';
import remove from 'lodash/remove';
import Dinero from 'dinero.js';
import { calculateDiscount } from './discount.utils';

const Money = Dinero; // alias (definir um outro nome para a biblioteca utilizada)

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

//import _ from 'lodash'; // dessa forma, todos os métodos do Lodash vão ser carregados, e o bundle ficaria muito grande caso seja uma aplicação frontend (em uma aplicação server-side não teria problema)

export default class Cart {
  items = [];

  add(item) {
    const itemToFind = { product: item.product };

    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }

    this.items.push(item);
  }

  remove(product) {
    remove(this.items, { product });
  }

  getTotal() {
    return this.items.reduce((acc, { quantity, product, condition }) => {
      const amount = Money({ amount: quantity * product.price });
      //const amount = Money({ amount: quantity * product.price + 1 }); // para ver o teste falhando

      let discount = Money({ amount: 0 });

      if (condition) {
        discount = calculateDiscount(amount, quantity, condition);
      }

      return acc.add(amount).subtract(discount); // add() e subtract() são métodos da classe Money
    }, Money({ amount: 0 }));
  }

  summary() {
    const total = this.getTotal();
    const formatted = total.toFormat('$0,0.00');
    const items = this.items;

    return {
      total,
      formatted,
      items,
    };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return {
      total: total.getAmount(),
      items,
    };
  }
}
