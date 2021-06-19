// Modules required
const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();

// Instagram variables
let instagramLoginURL = "https://instagram.com/accounts/login";
let instagramUsername = process.env.INSTAGRAM_USERNAME;
let instagramPassword = process.env.INSTAGRAM_PASSWORD;
let instagramAccount = process.env.INSTAGRAM_ACCOUNT;

// Async function to scrape data
scrapeData = async () => {
  // Create a browser
  // {
  //   args (--incognito) => opens tabs in incognito mode,
  //   headless (false) => launches full version of Chromium
  //   defaultViewport (null) => sets viewport to responsive size of chromium
  // }
  const browser = await puppeteer.launch({
    args: ["--incognito"],
    headless: false,
    defaultViewport: null,
  });

  // Create new page in the browser
  const page = await browser.newPage();

  // Redirect to login page and wait until network is
  // idle (<2 active connections) for at least .5 s
  await page.goto(instagramLoginURL, { waitUntil: "networkidle2" });

  // Enter login credentials and submit with delay of 20 ms
  page.waitForSelector("input[name=username]").then(async () => {
    await page.type("input[name=username]", instagramUsername, { delay: 20 });
    await page.type("input[name=password]", instagramPassword, { delay: 20 });
    await page.click("button[type=submit]", { delay: 20 });
  });

  await page.waitForTimeout(5000);

  // Disable notification
  for (let i = 0; i < 2; i++) {
    // Find all the buttons with text 'Not Now' and click
    const notificationBtn = await page.$x(
      "//button[contains(text(), 'Not Now')]"
    );
    if (notificationBtn.length > 0) {
      await notificationBtn[0].click();
    }
    await page.waitForTimeout(2000);
  }

  // Enter instagram account
  await page.type("input[placeholder=Search]", instagramAccount, { delay: 20 });
  await page.waitForTimeout(2000);

  // Get account link
  const accountLink =
    "https://instagram.com" +
    (await page.evaluate(() =>
      document.querySelector(".fuqBx div a[href]").getAttribute("href")
    ));

  // Redirect to account page
  page.goto(accountLink);

  await page.waitForTimeout(5000);

  // Get all the image src attributes
  const imageSrcLinks = await page.evaluate(() => {
    const srcArray = Array.from(document.querySelectorAll("a img")).map(
      (image) => image.getAttribute("src")
    );
    return srcArray;
  });

  const postLinks = await page.evaluate(() => {
    const postArray = Array.from(document.querySelectorAll("article a")).map(
      (image) => image.getAttribute("href")
    );
    return postArray;
  });

  // Removing last instagram logo
  imageSrcLinks.pop();

  // Check if posts are available
  if (imageSrcLinks.length > 0) {
    // Creating directory
    fs.mkdir(
      `./images/${instagramAccount}`,
      { recursive: true },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("New directory successfully created.");
        }
      }
    );

    // Loop through the image src array
    for (let i = 0; i < imageSrcLinks.length; i++) {
      // Create a new page for the post
      const postPage = await browser.newPage();
      postPage.goto("https://instagram.com/" + postLinks[i]);

      await postPage.waitForTimeout(5000);

      // Get date of the post
      let postDate = await postPage.evaluate(() =>
        document.querySelector("a.c-Yi7 time").getAttribute("title")
      );
      postDate = postDate.replace(/,/g, "");
      postDate = postDate.replace(/ /g, "_");

      postPage.close();

      // Create a new page for the image
      const imagePage = await browser.newPage();

      // Store source in a variable
      const viewSource = await imagePage.goto(imageSrcLinks[i]);

      // Create a image file in above created directory
      fs.writeFileSync(
        `images/${instagramAccount}/${instagramAccount}-${i}-${postDate}.jpg`,
        await viewSource.buffer(),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      imagePage.close();
    }
  } else {
    console.log("NO POSTS AVAILABLE");
  }
  browser.close();
};

scrapeData();
