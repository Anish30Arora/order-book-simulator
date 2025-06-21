from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from orderbook import OrderBook

app = Flask(__name__)
socketio = SocketIO(app)
order_book = OrderBook()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('place_order')
def handle_order(data):
    side = data['side']
    price = float(data['price'])
    quantity = int(data['quantity'])

    order_book.place_order(side, price, quantity)

    emit('order_book', order_book.get_order_book(), broadcast=True)
    emit('trades', order_book.get_trades(), broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
