const socket = io();

// Submit Order
document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const side = document.getElementById('side').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  socket.emit('place_order', { side, price, quantity });
});

// Order Book Updates
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

  updateChart(data.buy, data.sell); // Update chart here
});

// Recent Trades
socket.on('trades', (data) => {
  const tradeList = document.getElementById('trades');
  tradeList.innerHTML = '';
  data.forEach(trade => {
    const li = document.createElement('li');
    li.textContent = `Buy ID ${trade.buy_id} matched Sell ID ${trade.sell_id} at ₹${trade.price} x ${trade.quantity}`;
    tradeList.appendChild(li);
  });
});

// Chart.js Setup
let orderChart;

function updateChart(buyOrders, sellOrders) {
  const buyData = buyOrders.map(order => ({ x: parseFloat(order.price), y: parseInt(order.quantity) }));
  const sellData = sellOrders.map(order => ({ x: parseFloat(order.price), y: parseInt(order.quantity) }));

  if (!orderChart) {
    const ctx = document.getElementById('orderChart').getContext('2d');
    orderChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Buy Orders',
            data: buyData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          },
          {
            label: 'Sell Orders',
            data: sellData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }
        ]
      },
      options: {
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y'
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Price'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantity'
            }
          }
        }
      }
    });
  } else {
    orderChart.data.datasets[0].data = buyData;
    orderChart.data.datasets[1].data = sellData;
    orderChart.update();
  }
}
