import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

data = {
    "Pizza": [1,1,0,1],
    "Burger": [1,0,1,1],
    "Pasta": [0,1,1,0],
    "Fries": [1,1,1,0],
    "Cold Drink": [1,0,1,1]
}

df = pd.DataFrame(data)

similarity = cosine_similarity(df.T)
similarity_df = pd.DataFrame(similarity, index=df.columns, columns=df.columns)

def recommend_food(item):
    if item not in similarity_df:
        return []

    scores = similarity_df[item].sort_values(ascending=False)
    return scores.iloc[1:4].index.tolist()