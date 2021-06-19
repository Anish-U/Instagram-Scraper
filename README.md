<p align="center">
 <img width=140px height=140px src="https://i.pinimg.com/originals/d2/e5/3e/d2e53ea31ec15e6a8129008563713de5.png" alt="Instagram logo">
</p>

<h3 align="center">Instagram Scraper</h3>

---

<p align="center"> 🤖 This script scrapes instagram post of your favorite public accounts.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [How it works](#working)
- [Usage](#usage)
- [Built Using](#built_using)

## 🧐 About <a name = "about"></a>

This script basically scrapes images from the publicly available instagram account's posts and stores them in a folder with proper naming.

Instagram credentials need to be provided in the environmental variables along with the account username to be scraped.



##### For Example:

```
Images are stored in the format : USERNAME-COUNTER-POSTED_DATE.jpg

Instagram Account : RanveerSingh

Output : ./PATH/RanveerSingh/RanveerSingh-1-21-May-2021.jpg

```

## 💭 How it works <a name = "working"></a>

The scraper first opens instagram [login page](https://instagram.com/accounts/login) on an Incognito Chromium tab and enters the credentials specified in the environmental variables.

Then it searches for the account using the username provided, it opens the top account shown in the result box. 

If the account does not have any posts or if the account is private we get an error message on console.

```javascript
  "NO POSTS AVAILABLE"
```

The 12 recent images from post are downloaded in respective folder and are named according to their date. 

The entire script is written in NodeJS (JavaScript)

## 🎈 Usage <a name = "usage"></a>

To use the scraper:

First we need to install all the dependencies

```cmd
  npm install
```

Before running the script, we have to create an .env file with **credentials and username**. 

```
INSTAGRAM_USERNAME = your_username
INSTAGRAM_PASSWORD = your_password
INSTAGRAM_ACCOUNT = account_to_scrape
```


To run the script.

```cmd
npm run dev (or) node index.js
```


## ⛏️ Built Using <a name = "built_using"></a>

- [Node.js](https://nodejs.org/en/about/) - Node.js, an asynchronous event-driven JavaScript runtime
- [Puppeteer](https://pptr.dev/) - Puppeteer, a Node library which provides a high-level API to control Chrome or Chromium 
- [fs](https://nodejs.org/api/fs.html) - Node.js file system module allows you to work with the file system on your computer
- [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv loads environment variables from a .env file into process.env


<small>😄 <i>Developed only for learning purpose. Could use API for better results !</i></small>
