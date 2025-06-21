#order matching part 
import heapq
import time

class Order:
    def __init__(self, order_id, side, price, quantity):
        self.order_id = order_id
        self.side = side  # "buy" or "sell"
        self.price = price
        self.quantity = quantity
        self.timestamp = time.time()

    def __lt__(self, other):
        # for heapq sorting: lower price for sell, higher price for buy (inverted)
        return self.timestamp < other.timestamp if self.price == other.price else self.price < other.price

class OrderBook:
    def __init__(self):
        self.buy_heap = []
        self.sell_heap = []
        self.trades = []
        self.order_id_counter = 1

    def place_order(self, side, price, quantity):
        order = Order(self.order_id_counter, side, price, quantity)
        self.order_id_counter += 1

        if side == 'buy':
            self.match_order(order, self.sell_heap, self.buy_heap, buy=True)
        else:
            self.match_order(order, self.buy_heap, self.sell_heap, buy=False)

    def match_order(self, order, opposite_heap, same_heap, buy):
        while order.quantity > 0 and opposite_heap:
            best = opposite_heap[0]
            if (buy and order.price >= best.price) or (not buy and order.price <= -best.price):
                trade_qty = min(order.quantity, best.quantity)
                self.trades.append({
                    'buy_id': order.order_id if buy else best.order_id,
                    'sell_id': best.order_id if buy else order.order_id,
                    'price': best.price if buy else order.price,
                    'quantity': trade_qty
                })
                order.quantity -= trade_qty
                best.quantity -= trade_qty
                if best.quantity == 0:
                    heapq.heappop(opposite_heap)
            else:
                break

        if order.quantity > 0:
            price = -order.price if buy else order.price
            heapq.heappush(same_heap, Order(order.order_id, order.side, price, order.quantity))

    def get_order_book(self):
            
        buy_orders = [{'price': -o.price, 'quantity': o.quantity} for o in self.buy_heap]
        sell_orders = [{'price': o.price, 'quantity': o.quantity} for o in self.sell_heap]

        buy_orders = sorted(buy_orders, key=lambda x: x['price'], reverse=True)
        sell_orders = sorted(sell_orders, key=lambda x: x['price'])

        return {
            'buy': buy_orders,
            'sell': sell_orders
        }


    def get_trades(self):
        return self.trades[-10:]  # last 10 trades
