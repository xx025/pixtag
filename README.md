![img.png](frontend/img.png)

# SnapSort

> Quickly sort images in a folder by dragging and dropping them into the correct order.

## Usage



## 1. use docker compose

```
git clone https://github.com/xx025/SnapSort.git
cd SnapSort
docker compose up -d
```



## 2. use source code
```
git clone https://github.com/xx025/SnapSort.git
cd SnapSort
pip install uv # IF YOU HAVE UV , SKIP THIS STEP
uv sync
cd frontend
yarn install
yarn build
cd ..
uv run app.py
```









