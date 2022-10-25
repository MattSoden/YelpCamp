if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, activities } = require('./seedHelpers');

const Campground = require('../models/campground');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random()* 1000);
        const random12 = Math.floor(Math.random()* 12);
        const name = `${sample(descriptors)} ${sample(places)}`;
        const price = Math.floor(Math.random() * 20) + 10;
        const activitiesRandom = getMultipleRandom(activities, random12);

        const location = `${cities[random1000].city}, ${cities[random1000].state}`
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        
        const camp = new Campground({
            author: '63403ca9ae1d9d75761cec43',
            location: location,
            title: name,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem dicta nulla fuga ullam doloremque aperiam officiis quo pariatur est voluptas enim natus molestias velit magnam porro, id quibusdam temporibus nostrum.',
            price,
            activities: activitiesRandom,
            geometry: {
              type: "Point",
              coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude,
              ]
          },
            images: [
                {
                  url: 'https://res.cloudinary.com/dw1bwbiw0/image/upload/v1665500434/YelpCamp/wj2grxosi0ujc99w2brn.avif',
                  filename: 'YelpCamp/wj2grxosi0ujc99w2brn'
                },
                {
                  url: 'https://res.cloudinary.com/dw1bwbiw0/image/upload/v1665500434/YelpCamp/xsdhbydxuy0r4i7tdov1.avif',
                  filename: 'YelpCamp/xsdhbydxuy0r4i7tdov1'
                }
              ]             
        });
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close()
})
