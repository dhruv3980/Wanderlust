const mongoose = require("mongoose");

const schema = mongoose.Schema;
const Review = require('./review') 

const listingschema = new schema ({
    title: {
        type:String,
        required:true,
    },
    
    description: String,
    image : {
       url:String,
       filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review"
        }
    ],

    owner:{
        type:schema.Types.ObjectId,
        ref:"User"

    },
     category: {
        type: String,
        enum: ["Rooms", "Iconic cities", "Mountains", "Castles", "Amazing pools", "Camping", "Farms", "Arctic", "Domes", "Boats"],
        required: true
    }
});

listingschema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing", listingschema);

module.exports = Listing;