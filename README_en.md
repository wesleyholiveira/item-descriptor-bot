# 🎯 Molesker Item's Descriptor  

### 🔍 A bot for Twitch/YouTube that retrieves item effects from *The Binding of Isaac* directly in chat!  

🚀 Uses item descriptions from the **[External Item Descriptions](https://github.com/wofsauge/External-Item-Descriptions)** mod to provide fast and accurate information.  

---

## 📌 **Features**
✅ Integration with Twitch and YouTube.  
✅ Instant lookup of item effects.  
✅ Multi-language support.  
✅ Simple configuration via `.env`.  

---

## 🛠 **How to Run the Project?**  

### 🔹 **Using Docker** (Recommended Method)  
Simply run:  
```sh
docker-compose up
```
Or use the following commands manually:  
```sh
docker build -t <image-name> .
docker run --expose 6379 redis/redis-stack-server:latest
docker run --expose 3000 <image-name>-app --name 'twitch-bot'
docker run <image-name>-redis-seed
```

### 🔹 **Running Standalone**  
1️⃣ Install the required dependencies:  
- **Node.js 20**  
- **Python 3.10**  
- **Redis** with **RediSearch** module  

2️⃣ Install project dependencies:  
```sh
npm i
pip install -r ./scripts/requirements.txt
```

3️⃣ Run the item description processor:  
```sh
python ./scripts/processor.py en
```

---

## ⚙ **Configuration**  
1️⃣ Copy `.env.example` and rename it to `.env`.  
2️⃣ Edit the `.env` file and add your Twitch and YouTube credentials:  

```env
TWITCH_TOKEN=
TWITCH_USERNAME=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_MSG_POOLING=5000
```

3️⃣ If you want to use another language, create a new folder inside `data/raw` and insert the files following the **en/pt-br** structure:  

📂 **Example structure**:  
![File structure](https://github.com/wesleyholiveira/item-descriptor-bot/assets/2742138/b033968d-1afe-44fa-8def-fe3fe7892ef1)  

4️⃣ Update the `.env` file to set the desired language:  
```sh
DESCRIPTION_LANGUAGE=en
```

---

## 🚀 **Contributing**  
Want to help improve the project? Follow these steps:  
1️⃣ Fork this repository.  
2️⃣ Create a branch for your feature (`git checkout -b my-feature`).  
3️⃣ Make your changes and commit (`git commit -m "My contribution"`).  
4️⃣ Submit a pull request!  

---

## 🏷 **License**  
This project is open-source under the **MIT** license.  

📌 **Enjoying the project?** 🌟 Leave a ⭐ on the repository to help increase its visibility!  

---

### 🔎 **Want to contribute or report a bug?**  
Feel free to open an [issue](https://github.com/wesleyholiveira/item-descriptor-bot/issues) or get in touch!  
