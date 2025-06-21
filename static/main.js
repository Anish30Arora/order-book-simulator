const socket = io();

document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const side = document.getElementById('side').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  socket.emit('place_order', { side, price, quantity });
});

socket.on('order_book', (data) => {
  const buyTable = document.getElementById('buy-orders');
  const sellTable = document.getElementById('sell-orders');
  
  buyTable.innerHTML = `<tr><th>Price</th><th>Quantity</th></tr>`;
  sellTable.innerHTML = `<tr><th>Price</th><th>Quantity</th></tr>`;

  data.buy.forEach(order => {
    buyTable.innerHTML += `<tr><td>${order.price}</td><td>${order.quantity}</td></tr>`;
  });

  data.sell.forEach(order => {
    sellTable.innerHTML += `<tr><td>${order.price}</td><td>${order.quantity}</td></tr>`;
  });
});


socket.on('trades', (data) => {
  const tradeList = document.getElementById('trades');
  tradeList.innerHTML = '';
  data.forEach(trade => {
    const li = document.createElement('li');
    li.textContent = `Buy ID ${trade.buy_id} matched Sell ID ${trade.sell_id} at ₹${trade.price} x ${trade.quantity}`;
    tradeList.appendChild(li);
  });
});
