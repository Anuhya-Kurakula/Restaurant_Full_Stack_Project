import numpy as np
from sklearn.linear_model import LinearRegression

# Example historical order data
days = np.array([1,2,3,4,5]).reshape(-1,1)
pizza_orders = np.array([5,7,8,10,12])

model = LinearRegression()
model.fit(days, pizza_orders)

def predict_demand(day):
    prediction = model.predict([[day]])
    return int(prediction[0])